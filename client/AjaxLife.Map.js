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
	var sim_down_icons = false;
	var marker_agent_icons = false;
	var marker_event_icons = false;
	var marker_infohub_icons = false;
	var marker_telehub_icons = false;
	var marker_classified_icons = false;
	var marker_for_sale_icons = false;
	var marked_position = false;
	var position = {sim: "Nix", x: 0.0, y: 0.0, z: 0.0};
	var zoom_slider = false;
	var last_click = new Date();
	
	var you_focus_btn = false;
	var target_focus_btn = false;
	var clear_btn = false;
	var home_btn = false;
	var teleport_btn = false;
	var box_x = false;
	var box_y = false;
	var box_z = false;
	var box_sim = false;
	
	var teleport_wait = false;
	
	var sims = {};
	var sim_down_markers = {};
	
	var agent_markers = [];
	var event_markers = [];
	var infohub_markers = [];
	var telehub_markers = [];
	var classified_markers = [];
	var for_sale_markers = [];
	
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
				teleport_wait = Ext.Msg.wait("",_("Map.Teleporting"));
			}
		}
		else
		{
			if(teleport_wait && teleport_wait.isVisible())
			{
				teleport_wait.hide();
				//teleport_wait.getDialog().destroy();
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
	
	// Handle single clicks. Setting a doubleClickHandler broke this, so we do our own double-click detection here too.
	// "Retried" is for internal use only.
	function singleClickHandler(x, y, retried)
	{
		var now = new Date();
		var sim = getRegionName(x,y);
		// Check if the map block loaded yet.
		if(!sim || sim == '')
		{
			// If it hasn't, and we've already tried loading it, give up.
			if(retried)
			{
				AjaxLife.Widgets.Ext.msg("Error","Can't focus on that region until we know its name. Please wait a bit.");
			}
			// If we haven't tried specifically loading it, do so. After a second, call the function.
			else
			{
				AjaxLife.Network.Send("GetMapBlock",{
					X: Math.floor(x),
					Y: Math.floor(y)
				});
				setTimeout(function() {
					// Recursion. Yay.
					singleClickHandler(x, y, true);
				},1000); // Request region data and wait a second. Never know - it might work.
				AjaxLife.Widgets.Ext.msg("","Requsting name for ("+Math.floor(x)+", "+Math.floor(y)+")...");
			}
			return;
		}
		// Work out if we were double clicked by comparing the time and position of the last click 
		// to the time and position of this one.
		// If they're roughly the same, it was a double click.
		if(now.getTime() - last_click.getTime() < 1000 && marked_position.sim == sim && marked_position.x == (x%1)*256 && marked_position.y == (y%1)*256)
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
			// Move the marker to the new position. 
			// This is done by removing it from its current position (if one exists),
			// and placing it at the new one.
			// Lots of math to get it into a format the thing likes.
			if(marker_mark)
			{
				map.removeMarker(marker_mark);
			}
			var icons = false;
			if(sim)
			{
				icons = marker_mark_icons;
			}
			else
			{
				icons = marker_bad_icons;
			}
			marker_mark = new Marker(icons,new XYPoint(x,y));
			map.addMarker(marker_mark);
			marked_position = {sim: sim, x: (x%1)*256, y: (y%1)*256, z: position.z};
			if(sim)
			{
				box_x.dom.value = Math.round((x%1)*256);
				box_y.dom.value = Math.round((y%1)*256);
				box_sim.dom.value = sim;
			}
			else
			{
				box_x.dom.value = 128;
				box_y.dom.value = 128;
				box_z.dom.value = 0;
				box_sim.dom.value = "";
			}
			// We've made a target, so we enable the buttons to focus on and clear it.
			target_focus_btn.enable();
			clear_btn.enable();
		}
		// Log the last click, for double-click detection purposes.
		last_click = new Date();
	};
	
	// Called when the position boxes change. We move the marker to the new position,
	// again by removing and replacing it.
	function textposchanged()
	{
		if(marker_mark)
		{
			map.removeMarker(marker_mark);
		}
		var sim = box_sim.dom.value;
		if(!lh[sim.toLowerCase()]) return;
		var x = parseFloat(box_x.dom.value);
		if(x > 255) x = 255;
		var y = parseFloat(box_y.dom.value);
		if(y > 255) y = 255;
		var z = parseFloat(box_z.dom.value);
		marked_position = {sim: sim, x: x, y: y, z: z};
		target_focus_btn.enable();
		clear_btn.enable();
		marker_mark = new Marker(marker_mark_icons,new SLPoint(sim,x,y));
		map.addMarker(marker_mark);
		map.panOrRecenterToSLCoord(new SLPoint(sim, x, y));
	};
	
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
	// exist on the main grid is excessive (over 50,000 at peak time) and could potentially crash
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
			// This isn't an icon, really. It's a 1 sim x 1 sim translucent red square. We place it in the middle of a sim
			// if it's down. This effectively tints it red. To do this we need a different image for each scale.
			sim_down_icons = [
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay256.png",256,256,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay128.png",128,128,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay64.png" , 64, 64,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay32.png" , 32, 32,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay16.png" , 16, 16,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"images/simdown/overlay8.png"  ,  8,  8,true))
			];
			// If we know where we are, set our position to there.
			// Otherwise use the default position, which was set to the centre of the TG welcome area.
			if(gRegion != "")
			{
				position.sim = gRegion;
			}
			else
			{
				Ext.Msg.alert("",_("Map.NoRegionGiven"));
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
				map = new SLMap(Ext.get('div_map').dom, {hasZoomControls: false, hasPanningControls: false, singleClickHandler: singleClickHandler});
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
			});
			
			// Add initial sim to avoid crash due to dead MapAPI.
			// *shakes fist at LL*
			lh[gRegion.toLowerCase()] = gRegionCoords;
			rlh[gRegionCoords.x+"-"+gRegionCoords.y] = gRegion;
			
			// Create the map and mark us on it.
			map = new SLMap(Ext.get('div_map').dom, {hasZoomControls: false, hasPanningControls: false, singleClickHandler: singleClickHandler});
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
			box_sim.on('keyup',boxposkeyup);
			locationholder.appendChild(box_sim.dom);
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
			box_sim.on('change',textposchanged);
			
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
					if(marker_mark)
					{
						map.removeMarker(marker_mark);
						marker_mark = false;
						clear_btn.disable();
						target_focus_btn.disable();
					}
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
				handler: function () {
					AjaxLife.Widgets.Confirm(_("Map.Teleporting"),_("Map.HomeConfirm"), function(btn) {
						if(btn == 'yes')
						{
							teleport_dialog(true);
							AjaxLife.Network.Send("GoHome",{});
						}
					});
				},
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
					Sound.play(AjaxLife.STATIC_ROOT+"sounds/im.wav");
					Ext.Msg.show({
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
								RequesterID: data.FromAgentID,
								Accept: (btn=="yes")
							});
						}
					});
				}
				// This bit handles teleports from Lindens. You don't get any chances here.
				else if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.GodLikeRequestTeleport)
				{
					AjaxLife.Widgets.Ext.msg("", _("Map.GodLikeTeleportRequest"), "godliketeleportrequest", true);
					teleport_dialog(true);
					AjaxLife.Network.Send("TeleportLureRespond", {
						RequesterID: data.FromAgentID,
						Accept: true
					});
				}
			});
			
			// Handle teleport status updates.
			AjaxLife.Network.MessageQueue.RegisterCallback('Teleport', function(data) {
				// If we're starting a teleport, play the teleport noise and show the progress bar.
				if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Start)
				{
					Sound.play(AjaxLife.STATIC_ROOT+"sounds/teleport.wav");
					teleport_dialog(true);
				}
				// If we've arrived, get rid of the dialog and request our position.
				// Also show a message noting our arrival.
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Finished)
				{
					teleport_dialog(false);
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
					Ext.Msg.alert(_("Map.Teleportation"),_("Map.TeleportError"));
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
				for(var i in blocks.Blocks)
				{
					// If the sim's new, create new entries for it.
					if(!sims[i])
					{
						sims[i] = blocks.Blocks[i];
						sims[i].Items = {
							Agents: [],
							Events: [],
							Telehubs: [],
							Infohubs: [],
							Popular: [],
							ForSale: [],
							Classifieds: []
						};
						rlh[sims[i].X+"-"+sims[i].Y] = sims[i].Name;
						lh[sims[i].Name.toLowerCase()] = {x: sims[i].X, y: sims[i].Y};
						//sims[i].AgentMarker = false;
					}
					// If it's down, add a sim down marker to its centre to show this.
					if(sims[i].Access == AjaxLife.Constants.Map.SimAccess.Down)
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
				}
			});
			// Request the map data
			AjaxLife.Network.Send('GetMapBlocks', {}); 
			
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
		}
	}
}();

//AjaxLife.Map.IconManager = function() {
//	/* Private stuff is here */
//	var map = arg_map;
//	
//	
//	return {
//		/* Public stuff is here */
//	};
//}();