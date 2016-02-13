/* Copyright (c) 2008, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY KATHARINE BERRY ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KATHARINE BERRY BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/

// Map window stuff
AjaxLife.Map = function() {
	var map_win = false;
	var map = false;
	var marker_you = false;
	var marker_mark = false;
	var marker_agent_img = false;
	var marker_you_img = false;
	var marker_you_icons = false;
	var marker_mark_img = false;
	var marker_mark_icons = false;
	var marker_bad_img = false;
	var marker_bad_icons = false;
	var marker_loading_img = false;
	var marker_loading_icons = false;
	var sim_down_icons = false;
	var marker_agent_icons = false;
	var marker_event_icons = false;
	var marker_infohub_icons = false;
	var marker_telehub_icons = false;
	var marker_classified_icons = false;
	var marker_for_sale_icons = false;
	var marked_position = false;
	var position = {sim: "Ahern", x: 0.0, y: 0.0, z: 0.0};
	var position_before_teleport;
	var zoom_slider = false;
	var last_click = new Date();
	var region_load_timeout = false;
	var old_bounds = {MinX: 0, MinY: 0, MaxX: 0, MaxY: 0};
	
	var you_focus_btn = false;
	var target_focus_btn = false;
	var clear_btn = false;
	var home_btn = false;
	var teleport_btn = false;
	var box_x = false;
	var box_y = false;
	var box_z = false;
	var box_sim = false;
	var highlighted_sim = '';
	var list_sim_search = false;
	
	var teleport_wait = false;
	
	var sims = {};
	var sim_down_markers = {};
	
	var agent_markers = [];
	var event_markers = [];
	var infohub_markers = [];
	var telehub_markers = [];
	var classified_markers = [];
	var for_sale_markers = [];
	
	var markchangecallbacks = [];
	
	// Focus the map on our position when the focus button is clicked.
	function btn_focus_self_clicked()
	{
		map.panOrRecenterToSLCoord(new SLPoint(position.sim, position.x, position.y));
	};
	
	// Teleport dialog, called after the teleport starts.
	// call with show = TRUE to show it, show = FALSE to hide it.
	function teleport_dialog(show)
	{
		if(show)
		{
			if(!teleport_wait || !teleport_wait.isVisible())
			{
				teleport_wait = AjaxLife.Widgets.Modal.wait("",_("Map.Teleporting"));
			}
		}
		else
		{
			if(teleport_wait)
			{
				teleport_wait.hide();
				teleport_wait = false;
			}
		}
	}
	
	// Perform an actual teleport, after confirming we want to do it.
	function teleportTo(sim, x, y, z)
	{
		if(!sim) return;
		AjaxLife.Widgets.Confirm(_("Map.Teleporting"),_("Map.TeleportConfirm",{sim: sim, x: Math.round(x), y: Math.round(y)}), function(btn) {
			if(btn == 'yes')
			{
				teleport_dialog(true);
				AjaxLife.Network.Send("Teleport",{
					Sim: sim,
					X: x,
					Y: y,
					Z: z
				}); 
			}
		});
	};
	
	// Callback for keys being pressed in the target boxes.
	// Trigger teleport if the key was enter (keycode 13)
	function boxposkeyup(e)
	{
		if(e.keyCode != 13 && e.which != 13)
		{
			return;
		}
		if(marked_position !== position)
		{
			teleportTo(marked_position.sim, marked_position.x, marked_position.y, marked_position.z);
		}
	}
	
	function onmarkchanged(pos)
	{
		markchangecallbacks.each(function(item) {
			if(typeof item == 'function')
			{
				try
				{
					item(pos);
				}
				catch(e)
				{
					AjaxLife.Debug("Map: A Map.OnMarkChanged callback failed: "+e.name+": "+e.message);
				}
			}
		});
	}
	
	function settargetpos(sim, pos, center)
	{
		// Whether we're moving or removing, we have to remove it, so we may as well do it first.
		if(marker_mark)
		{
			map.removeMarker(marker_mark);
		}
		// Now, if we're actually moving the marker (not just removing it), re-add it in the right position.
		if(sim !== false)
		{
			if(!pos.z && pos.z !== 0) pos.z = position.z;
			// If the sim is known, use the good icons. Otherwise use the bad ones.
			if(sim)
			{
				marker_mark = new Marker(marker_mark_icons, new SLPoint(sim,pos.x,pos.y));
			}
			else
			{
				marker_mark = new Marker(marker_bad_icons, new XYPoint(pos.x,pos.y));
			}
			// Stick it on the map.
			map.addMarker(marker_mark);
			// Update the position as known by everything except the visual representation.
			if(!sim)
			{
				pos.x = (pos.x%1)*256;
				pos.y = (pos.y%1)*256;
			}
			highlighted_sim = sim;
			marked_position = {sim: sim, x: pos.x, y: pos.y, z: pos.z};
			box_x.dom.value = Math.round(pos.x);
			box_y.dom.value = Math.round(pos.y);
			box_z.dom.value = Math.round(pos.z);
			box_sim.dom.value = sim ? sim : '';
			// Centre on the point if requested.
			if(center && sim)
			{
				map.panOrRecenterToSLCoord(new SLPoint(sim, pos.x, pos.y));
			}
			if(!list_sim_search.contains(sim)) list_sim_search.clear();
			clear_btn.enable();
			target_focus_btn.enable();
			onmarkchanged(marked_position);
		}
		else
		{
			list_sim_search.clear();
			clear_btn.disable();
			target_focus_btn.disable();
			box_x.dom.value = Math.round(position.x);
			box_y.dom.value = Math.round(position.y);
			box_z.dom.value = Math.round(position.z);
			box_sim.dom.value = position.sim;
			onmarkchanged(false);
		}
	}
	
	// Handle single clicks. Setting a doubleClickHandler broke this, so we do our own double-click detection here too.
	// "Retried" is for internal use only.
	function singleClickHandler(x, y, retried)
	{
		// If we were waiting for something to load, forget about it.
		// If we don't, the icon jumps around as all the pending events bubble up.
		if(region_load_timeout)
		{
			clearTimeout(region_load_timeout);
			region_load_timeout = false;
		}
		var now = new Date();
		var sim = getRegionName(x,y);
		// Check if the map block loaded yet.
		if(!sim || sim == '')
		{
			// If it hasn't, and we've already tried loading it, give up.
			if(!retried)
			{
				AjaxLife.Network.Send("GetMapBlocks",{
					MaxX: Math.floor(x),
					MinX: Math.floor(x),
					MaxY: Math.floor(y),
					MinY: Math.floor(y)
				});
				region_load_timeout = setTimeout(function() {
					// Recursion. Yay.
					singleClickHandler(x, y, true);
				},2000); // Request region data and wait a couple of seconds, in the hope some data arrives in the meantime.
				
				// Build and add a loading marker while we wait, so the user knows something's happening.
				if(marker_mark) map.removeMarker(marker_mark);
				marker_mark = new Marker(marker_loading_icons, new XYPoint(x,y));
				map.addMarker(marker_mark);
				return;
			}
		}
		// Convert the x and y coordinates to local coordinates, relative to the sim (which we now know the name of, hopefully.)
		// (x%1)*256 converts a global coordinate (which keeps the local part in the fraction) to a local coordinate (0-256)
		// (x%1) removes the whole part, while *256 multiplies the remaining bit into a number between 0 and 256.
		var xypoint = {x: x, y: y};
		x = (x%1)*256;
		y = (y%1)*256;
		// Work out if we were double clicked by comparing the time and position of the last click 
		// to the time and position of this one.
		// If they're roughly the same, it was a double click.
		if(now.getTime() - last_click.getTime() < 1000 && marked_position.sim == sim && marked_position.x == x && marked_position.y == y)
		{
			// If we know where you clicked, doubleclick means teleport.
			if(sim)
			{
				teleportTo(marked_position.sim, marked_position.x, marked_position.y, marked_position.z);
			}
		}
		// Not a double click. Must be a single click then!
		else
		{
			// Move the marker to the new position. If we don't know the sim name, pass the xypoint
			// from before conversion to local coordinates.
			settargetpos(sim, sim ? {x: x, y: y} : xypoint);
		}
		// Log the last click, for double-click detection purposes.
		last_click = new Date();
	};
	
	// Handles map movement and such.
	function mapStateChanged()
	{
		var bounds = map.getViewportBounds();
		if(bounds.xMin < old_bounds.MinX || bounds.yMin < old_bounds.MinY || bounds.xMax > old_bounds.MaxX || bounds.yMax > old_bounds.MaxY)
		{
			var new_bounds = {
				MaxX: Math.ceil(bounds.xMax),
				MaxY: Math.ceil(bounds.yMax),
				MinX: Math.floor(bounds.xMin),
				MinY: Math.floor(bounds.yMin)
			};
			AjaxLife.Network.Send("GetMapBlocks", new_bounds);
			old_bounds = new_bounds;
		}
	}
	
	// Called when the position boxes change. We move the marker to the new position,
	// again by removing and replacing it.
	function textposchanged()
	{
		var sim = highlighted_sim;
		// Try to get the sim coordinates.
		var simpos = lh[sim.toLowerCase()];
		// If we don't know the sim, just abort.
		if(!simpos) return;
		// If we do, correct capitalisation of the name by looking it up in rlh based on the data in lh.
		sim = rlh[simpos.x+"-"+simpos.y];
		// Try and get the values of the boxes.
		var x = parseFloat(box_x.dom.value);
		if(x > 255) x = 255;
		else if(x < 0) x = 0;
		var y = parseFloat(box_y.dom.value);
		if(y > 255) y = 255;
		else if(y < 0) y = 0;
		var z = parseFloat(box_z.dom.value);
		if(z < 0) z = 0;
		settargetpos(sim, {x: x, y: y, z: z}, true);
	};
	
	function simboxchanged()
	{
		var name = box_sim.dom.value;
		AjaxLife.Network.Send('FindRegion', {
			Name: name
		});
		list_sim_search.clear();
	}
	
	// This recursively removes all items in a sim.
	function clearitems(sim)
	{
		if(sim)
		{
			sim = sim.toLowerCase();
			if(sims[sim])
			{
				for(var i in sims[sim].Items)
				{
					sims[sim].Items[i].each(function (item) {
						if(item.marker)
						{
							map.removeMarker(item.marker);
						}
					});
					sims[sim].Items[i] = [];
				}
			}
		}
	}
	
	// This fetches all items in a sim. Not currently used, as the number of items that would
	// exist on the main grid is excessive (over 60,000 at peak time) and could potentially crash
	// the browser. Also, it'd hog bandwidth.
	function updateitems()
	{
		AjaxLife.Network.Send('GetSimStatus', {});
	}
	
	function focusontarget()
	{
		map.centerAndZoomAtSLCoord(new SLPoint(marked_position.sim, marked_position.x, marked_position.y),1);
		zoom_slider.setvalue(1);
	}
	
	function gohome()
	{
		AjaxLife.Widgets.Confirm(_("Map.Teleporting"),_("Map.HomeConfirm"), function(btn) {
			if(btn == 'yes')
			{
				teleport_dialog(true);
				AjaxLife.Network.Send("GoHome",{});
			}
		});
	}
	
	// These methods are public.
	return {
		init: function() {
			var marked_position = {sim: gRegion, x: gPosition.X, y: gPosition.Y, z: gPosition.Z};
			// Set up all the icons on the map. Use the same size at each scale.
			marker_you_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"images/map_marker_you.png",16,16,true));
			marker_you_icons = [marker_you_img,marker_you_img,marker_you_img,marker_you_img,marker_you_img,marker_you_img];
			marker_mark_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"images/map_marker_selected.png",16,16,true));
			marker_mark_icons = [marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img];
			marker_bad_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"images/map_marker_bad.png",16,16,true));
			marker_bad_icons = [marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img];
			marker_agent_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"images/map_marker_agent.png",9,9,true));
			marker_agent_icons = [marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img];
			marker_loading_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"images/map_marker_loading.gif",16,16));
			marker_loading_icons = [marker_loading_img,marker_loading_img,marker_loading_img,marker_loading_img,marker_loading_img,marker_loading_img];
			// This isn't an icon, really. It's a 1 sim x 1 sim translucent red square. We place it in the middle of a sim
			// if it's down. This effectively tints it red. To do this we need a different image for each scale.
			sim_down_icons = [
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay256.png",256,256,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay128.png",128,128,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay64.png" , 64, 64,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay32.png" , 32, 32,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay16.png" , 16, 16,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay8.png"	 ,	8,	8,true))
			];
			// If we know where we are, set our position to there.
			// Otherwise use the default position, which was set to the centre of the TG welcome area.
			if(gRegion != "")
			{
				position.sim = gRegion;
			}
			else
			{
				AjaxLife.Widgets.Modal.alert("",_("Map.NoRegionGiven"));
			}
			position.x = gPosition.X;
			position.y = gPosition.Y;
			position.z = gPosition.Z;
			
			// Create the map window.
			map_win = new Ext.BasicDialog("dlg_map",{
				width: 700,
				height: 500,
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("Map.WindowTitle"),
				proxyDrag: !AjaxLife.Fancy,
				collapsible: false
			});
			map_win.body.setStyle({overflow: 'hidden'});
			map_win.body.dom.innerHTML = "<div id=\"div_map\" style=\"width:480px; height: 470px;\"></div><div id=\"div_map_control\"></div>";
			// Resize the map viewport when the window is resized.
			// It turns out the map doesn't like this - so we have to actually wipe out and rebuild the whole map.
			// This means replacing us, out target, any downed sims, and agent markers.
			map_win.on('resize',function(themap, width, height) {
				var zoom = map.getCurrentZoomLevel();
				var pos = map.getMapCenter();
				Ext.get('div_map').dom.innerHTML = '';
				map = false;
				Ext.get('div_map').setStyle({width: (width-220)+'px', height: (height-30)+'px'});
				map = new SLMap(Ext.get('div_map').dom, {
					hasZoomControls: false,
					hasPanningControls: false,
					singleClickHandler: singleClickHandler,
					onStateChangedHandler: mapStateChanged}
				);
				map.centerAndZoomAtSLCoord(pos,zoom);
				map.addMarker(marker_you);
				if(marker_mark)
				{
					map.addMarker(marker_mark);
				}
				for(var i in sim_down_markers)
				{
					if(sim_down_markers[i])
					{
						map.addMarker(sim_down_markers[i]);
					}
				}
				
				if(map.getCurrentZoomLevel() <= 3)
				{
					for(var i in sims)
					{
						for(var j in sims[i].Items)
						{
							sims[i].Items[j].each(function(item) {
								map.addMarker(item.marker);
							});
						}
					}
				}
				
				mapStateChanged();
			});
			
			// Add initial sim to avoid crash due to dead MapAPI.
			// *shakes fist at LL*
			lh[gRegion.toLowerCase()] = gRegionCoords;
			rlh[gRegionCoords.x+"-"+gRegionCoords.y] = gRegion;
			
			// Create the map and mark us on it.
			map = new SLMap(Ext.get('div_map').dom, {
				hasZoomControls: false,
				hasPanningControls: false,
				singleClickHandler: singleClickHandler,
				onStateChangedHandler: mapStateChanged}
			);
			map.centerAndZoomAtSLCoord(new SLPoint(position.sim, position.x, position.y),2);
			marker_you = new Marker(marker_you_icons,new SLPoint(position.sim, position.x, position.y));
			map.addMarker(marker_you);
			var showing_markers = true;
			// Set up the slider and have the map zoom in and out when the slider is dragged.
			zoom_slider = new AjaxLife.Widgets.Slider('div_map_control', 'map_slider_zoom', {
				width: 180,
				onChange: function(value) {
					map.setCurrentZoomLevel(value);
					// Don't show the markers when we're at a zoom level greater than 3 (1 is the highest)
					if(value > 3 && showing_markers)
					{
						showing_markers = false;
						for(var i in sims)
						{
							for(var j in sims[i].Items)
							{
								sims[i].Items[j].each(function(item) {
									map.removeMarker(item.marker);
								});
							}
						}
					}
					else if(value <= 3 && !showing_markers)
					{
						showing_markers = true;
						for(var i in sims)
						{
							for(var j in sims[i].Items)
							{
								sims[i].Items[j].each(function(item) {
									map.addMarker(item.marker);
								});
							}
						}
					}
				},
				values: $A($R(1,6)),
				range: $R(1,6),
				sliderValue: map.getCurrentZoomLevel()
			});
			// UI fun.
			var locationholder = document.createElement('div');
			locationholder.setAttribute('id','div_map_location_boxes');
			var regionpara = document.createElement('p');
			regionpara.appendChild(document.createTextNode(_("Map.RegionLabel")));
			locationholder.appendChild(regionpara);
			box_sim = Ext.get(document.createElement('input'));
			box_sim.setStyle({width: '190px'});
			box_sim.dom.setAttribute('value', marked_position.sim);
			locationholder.appendChild(box_sim.dom);
			var simsearchholder = Ext.get(document.createElement('div'));
			simsearchholder.setStyle({marginLeft: '5px'});
			locationholder.appendChild(simsearchholder.dom);
			var locationpara = document.createElement('p');
			locationpara.appendChild(document.createTextNode(_("Map.PositionLabel")));
			locationholder.appendChild(locationpara);
			box_x = Ext.get(document.createElement('input'));
			box_x.dom.setAttribute('type','input');
			box_x.dom.setAttribute('value',Math.round(marked_position.x));
			box_x.on('keyup',boxposkeyup);
			locationholder.appendChild(box_x.dom);
			box_y = Ext.get(document.createElement('input'));
			box_y.dom.setAttribute('type','input');
			box_y.dom.setAttribute('value',Math.round(marked_position.y));
			box_y.on('keyup',boxposkeyup);
			locationholder.appendChild(box_y.dom);
			box_z = Ext.get(document.createElement('input'));
			box_z.dom.setAttribute('type','input');
			box_z.dom.setAttribute('value',Math.round(marked_position.z));
			box_z.on('keyup',boxposkeyup);
			locationholder.appendChild(box_z.dom);
			Ext.get('div_map_control').dom.appendChild(locationholder);
			var buttonholder = document.createElement('div');
			buttonholder.setAttribute('id','div_map_control_buttons');
			Ext.get('div_map_control').dom.appendChild(buttonholder);
			box_x.on('change',textposchanged);
			box_y.on('change',textposchanged);
			box_z.on('change',textposchanged);
			box_sim.on('change',simboxchanged);
			
			list_sim_search = new AjaxLife.Widgets.SelectList('lst_sim_list', simsearchholder, {
				sort: true,
				width: '190px',
				height: '200px',
				callback: function(key) {
					box_sim.dom.value = key;
					highlighted_sim = key;
					textposchanged();
				}
			})
			
			// Make some buttons, and make them do stuff.
			// Teleport when the teleport button's clicked.
			teleport_btn = new Ext.Button(buttonholder, {
				handler: function() {
					teleportTo(marked_position.sim, marked_position.x, marked_position.y, marked_position.z);
				},
				text: _("Map.TeleportVerb")
			});
			teleport_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '70px'});
			// Focus on you and zoom all the way in when the focus on you button's clicked.
			you_focus_btn = new Ext.Button(buttonholder, {
				handler: function() {
					map.centerAndZoomAtSLCoord(new SLPoint(position.sim, position.x, position.y),1);
					zoom_slider.setvalue(1);
				},
				text: _("Map.FocusYou")
			});
			you_focus_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '35px'});
			// Remove the icon when the clear button's clicked.
			clear_btn = new Ext.Button(buttonholder, {
				handler: function() {
					settargetpos(false);
				},
				text: _("Map.Clear"),
				disabled: true
			});
			clear_btn.getEl().setStyle({position: 'absolute', right: '5px', bottom: '35px'});
			// Focus and zoom in on the target when this button's pressed.
			target_focus_btn = new Ext.Button(buttonholder, {
				handler: focusontarget,
				text: _("Map.FocusTarget"),
				disabled: true
			});
			target_focus_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '0px'});
			// Teleport directly home when the teleport home button's pressed.
			home_btn = new Ext.Button(buttonholder, {
				handler: gohome,
				text: _("Map.HomeButton")
			});
			home_btn.getEl().setStyle({position: 'absolute', right: '5px', bottom: '0px'});
			
			// Now for teleport event handling...
			
			// Handle teleport lures
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				// If this is a teleport request, play the IM sound, then offer an accept/decline box.
				// If it's accepted, pull up the teleport box and send the affirmative to the server.
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.RequestTeleport)
				{
					AjaxLife.Sound.Play("im");
					AjaxLife.Widgets.Modal.show({
						title: _("Map.TeleportRequestTitle"),
						msg: _("Map.TeleportRequest", {name: data.FromAgentName, message: data.Message}),
						buttons: {
							yes: _("Widgets.Accept"),
							no: _("Widgets.Decline")
						},
						modal: false,
						closable: false,
						fn: function(btn) {
							if(btn=="yes")
							{
								teleport_dialog(true);
							}
							AjaxLife.Network.Send("TeleportLureRespond",{
								SessionID: data.IMSessionID,
								RequesterID: data.FromAgentID,
								Accept: (btn=="yes")
							});
						}
					});
				}
				// This bit handles teleports from Lindens. You don't get any chances here.
				else if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.GodLikeRequestTeleport)
				{
					AjaxLife.Widgets.Ext.msg("", _("Map.GodLikeTeleportRequest"), "godliketeleportrequest");
					AjaxLife.Network.Send("GodLikeTeleportLureRespond", {
						RequesterID: data.FromAgentID,
						SessionID: data.IMSessionID
					});
				}
			});
			
			// Handle teleport status updates.
			AjaxLife.Network.MessageQueue.RegisterCallback('Teleport', function(data) {
				// If we're starting a teleport, play the teleport noise and show the progress bar.
				if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Start)
				{
					position_before_teleport = AjaxLife.Utils.Clone(position);
					AjaxLife.Sound.Play("teleport");
					teleport_dialog(true);
				}
				// If we've arrived, get rid of the dialog and request our position.
				// Also show a message noting our arrival.
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Finished)
				{
					// Remove the dialogue.
					teleport_dialog(false);
					// Put a message in the chat history showing where we just came from.
					AjaxLife.SpatialChat.systemmessage(_("Map.TeleportCompleteMessage", {url: "http://slurl.com/secondlife/"+escape(position_before_teleport.sim)+"/"+Math.round(position_before_teleport.x)+"/"+Math.round(position_before_teleport.y)+"/"+Math.round(position_before_teleport.z)}));
					AjaxLife.Network.Send("GetPosition", {
						callback: function(response) {
							AjaxLife.Widgets.Ext.msg(
								_("Map.Teleportation"),
								_("Map.TeleportSuccess", {sim: response.Sim, x: Math.round(response.Position.X), y: Math.round(response.Position.Y), z: Math.round(response.Position.Z)})
							);
							AjaxLife.Map.move(response.Sim, response.Position.X, response.Position.Y, response.Position.Z);
							setTimeout('AjaxLife.Network.Send("SendAppearance",{});AjaxLife.Network.Send("ReRotate",{});',1000);
						}
					});
				}
				// Something didn't work. Pop up an error box.
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Failed)
				{
					teleport_dialog(false);
					AjaxLife.Widgets.Modal.alert(_("Map.Teleportation"),_("Map.TeleportError"));
				}
				// The user somehow cancelled the teleport, despite not having a cancel button. Amazing.
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Cancelled)
				{
					teleport_dialog(false);
					AjaxLife.Widgets.Ext.msg(_("Map.Teleportation"),_("Map.TeleportCancelled"));
				}
			});
			
			// Map blocks...
			
			// Deal with incoming map data. This generally means lists of sim positions and names,
			// along with their status.
			AjaxLife.Network.MessageQueue.RegisterCallback('MapBlocks', function(blocks) {
				var search_result = false;
				var sims_found = [];
				blocks.Blocks.each(function(block) {
					var i = block.Name.toLowerCase();
					// If it's a search result, X/Y are set to zero.
					if(block.X == 0 && block.Y == 0)
					{
						search_result = true;
						return; // break
					}
					sims_found.push(block.Name);
					// If the sim's new, create new entries for it.
					if(!sims[i])
					{
						sims[i] = block;
						sims[i].Items = {
							Agents: [],
							Events: [],
							Telehubs: [],
							Infohubs: [],
							Popular: [],
							ForSale: [],
							Classifieds: []
						};
						rlh[block.X+"-"+block.Y] = block.Name;
						lh[block.Name.toLowerCase()] = {x: block.X, y: block.Y};
						//sims[i].AgentMarker = false;
					}
					// If it's down, add a sim down marker to its centre to show this.
					if(block.Access == AjaxLife.Constants.Map.SimAccess.Down)
					{
						if(!sim_down_markers[i])
						{
							sim_down_markers[i] = new Marker(sim_down_icons, new SLPoint(i,128,128));
							map.addMarker(sim_down_markers[i]);
						}
					}
					// If it's up, but we marked it as down, remove the marker.
					else
					{
						if(sim_down_markers[i])
						{
							map.removeMarker(sim_down_markers[i]);
							sim_down_markers[i] = false;
						}
					}
					// Request item set.
					// Actaully, don't bother with this until we're slightly more advanced - 
					// it'll choke the MG.
					//AjaxLife.Network.Send('GetMapItems',{ItemType: AjaxLife.Constants.Map.Item.AgentLocations, Region: i});
				});
				
				if(search_result)
				{
					list_sim_search.clear();
					sims_found.each(function(result) {
						list_sim_search.add(result, result);
					})
				}
			});
			
			// Map items...
			
			AjaxLife.Network.MessageQueue.RegisterCallback('MapItems', function(items) {
				// If they're agent locations, mark them all on the map.
				// This means clearing the current set of marks and adding a new one.
				// Note that if the sim's down we abort the process.
				if(items.ItemType == AjaxLife.Constants.Map.Item.AgentLocations)
				{
					if(items.Items.length > 0)
					{
						var first = true;
						var sim = '';
						items.Items.each(function(item) {
							sim = getRegionName(item.X/256,item.Y/256);
							if(sim && first)
							{
								clearitems(sim);
								if(sims[sim.toLowerCase()].Access == AjaxLife.Constants.Map.SimAccess.Down) throw $break;
								first = false;
							}
							if(item.X % 256 == 0 && item.Y % 256 == 0) return;
							var marker = new Marker(marker_agent_icons, new XYPoint(item.X / 256.0, item.Y / 256.0));
							if(map.getCurrentZoomLevel() <= 3) map.addMarker(marker);
							item.marker = marker;
							sims[sim.toLowerCase()].Items.Agents[sims[sim.toLowerCase()].Items.Agents.length] = item;
						});
					}
				}
			}); 
			
			// Update our position every time we get the periodic "UsefulData" message.
			AjaxLife.Network.MessageQueue.RegisterCallback('UsefulData', function(data) {
				if(data.YourRegion != position.sim || 
					data.YourPosition.X != position.x ||
					data.YourPosition.Y != position.y ||
					data.YourPosition.Z != position.z)
				{
					AjaxLife.Map.move(data.YourRegion,data.YourPosition.X,data.YourPosition.Y,data.YourPosition.Z);
				}
			});
			
			// Update the sim status.
			setInterval(updateitems,600000)		
		},
		// Open the window.
		open: function(opener) {
			if(opener)
			{
				map_win.show(opener);
			}
			else
			{
				map_win.show();
			}
		},
		// Close the window.
		close: function() {
			map_win.hide();
		},
		// Close the open window, or open the closed window
		toggle: function(opener) {
			if(!map_win.isVisible())
			{
				this.open(opener);
			}
			else
			{
				this.close();
			}
		},
		// Set the position to some else.
		move: function(sim, x, y, z) {
			map.removeMarker(marker_you);
			marker_you = new Marker(marker_you_icons,new SLPoint(sim,x,y));
			map.addMarker(marker_you);
			position = {sim: sim, x: x, y: y, z: z};
			AjaxLife.MiniMap.SetPos(position);
		},
		// Returns a vector with the current position.
		getpos: function() {
			return position;
		},
		// Forces the teleport dialog.
		TPDialog: function() {
			teleport_dialog(true);
		},
		// Teleport somewhere.
		TeleportTo: function(sim, x, y, z) {
			teleportTo(sim, x, y, z);
		},
		// Register a callback so that another module can know when the mark is moved.
		OnMarkChanged: function(fn) {
			markchangecallbacks[markchangecallbacks.length] = fn;
		},
		// Called onclick by certain links.
		HandleLink: function(sim, x, y, z, el) {
			AjaxLife.Debug("Map: HandleLink: "+sim+", "+x+", "+y+", "+z+", "+el);
			// Because this is a URL, unescape the sim name.
			sim = unescape(sim);
			this.open();
			if(z == '') z = position.z; // If z wasn't specified, use our own height.
			settargetpos(sim, {x: x*1, y: y*1, z: z*1}, true); // Multiply by one to convert to int.
			return false; // Abort the navigation.
		},
		GoHome: function() {
			gohome();
		}
	}
}();
