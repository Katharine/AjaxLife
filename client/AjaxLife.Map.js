/* Copyright (c) 2007, Katharine Berry
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
	var marked_position = {sim: gRegion, x: gPosition.X, y: gPosition.Y, z: gPosition.Z};
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
	
	function btn_focus_self_clicked()
	{
		map.panOrRecenterToSLCoord(new SLPoint(position.sim, position.x, position.y));
	};
	
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
	
	function singleClickHandler(x, y, retried)
	{
		var now = new Date();
		var sim = getRegionName(x,y);
		// Check if the map block loaded yet.
		if(!sim || sim == '')
		{
			if(retried)
			{
				AjaxLife.Widgets.Ext.msg("Error","Can't focus on that region until we know its name. Please wait a bit.");
			}
			else
			{
				AjaxLife.Network.Send("GetMapBlock",{
					X: Math.floor(x),
					Y: Math.floor(y)
				});
				setTimeout(function() {
					singleClickHandler(x, y, true);
				},1000); // Request region data and wait a second. Never know - it might work.
				AjaxLife.Widgets.Ext.msg("","Requsting name for ("+Math.floor(x)+", "+Math.floor(y)+")...");
			}
			// Try and speed up loading that region.
			return;
		}
		// If double clicked...
		if(now.getTime() - last_click.getTime() < 1000 && marked_position.sim == sim && marked_position.x == (x%1)*256 && marked_position.y == (y%1)*256)
		{
			if(sim)
			{
				teleportTo(marked_position.sim, marked_position.x, marked_position.y, marked_position.z);
			}
		}
		else
		{
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
			target_focus_btn.enable();
			clear_btn.enable();
		}
		last_click = new Date();
	};
	
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
	
	function updateitems()
	{
		AjaxLife.Network.Send('GetSimStatus', {});
	}
	
	return {
		init: function() {
			
			marker_you_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/map_marker_you.png",16,16,true));
			marker_you_icons = [marker_you_img,marker_you_img,marker_you_img,marker_you_img,marker_you_img,marker_you_img];
			marker_mark_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/map_marker_selected.png",16,16,true));
			marker_mark_icons = [marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img, marker_mark_img];
			marker_bad_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/map_marker_bad.png",16,16,true));
			marker_bad_icons = [marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img, marker_bad_img];
			sim_down_icons = [
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=256",256,256,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=128",128,128,true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=64",	64,	64,	true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=32",	32,	32,	true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=16",	16,	16,	true)),
				new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/simdownoverlay.php?size=8",	8,	8,	true))
			];
			var marker_agent_img = new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/map_marker_agent.png",9,9,true));
			marker_agent_icons = [marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img,marker_agent_img];
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
				
				//if(Prototype.Browser.WebKit)
				//{
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
				//}
				//else
				//{
				//	for(var i in sims)
				//	{
				//		if(sims[i].AgentMarker)
				//		{
				//			map.addMarker(sims[i].AgentMarker);
				//		}
				//	}
				//}
			});
			
			// Add initial sim to avoid crash due to dead MapAPI.
			lh[gRegion.toLowerCase()] = gRegionCoords;
			rlh[gRegionCoords.x+"-"+gRegionCoords.y] = gRegion;
			
			map = new SLMap(Ext.get('div_map').dom, {hasZoomControls: false, hasPanningControls: false, singleClickHandler: singleClickHandler});
			map.centerAndZoomAtSLCoord(new SLPoint(position.sim, position.x, position.y),2);
			marker_you = new Marker(marker_you_icons,new SLPoint(position.sim, position.x, position.y));
			map.addMarker(marker_you);
			var showing_markers = true;
			zoom_slider = new AjaxLife.Widgets.Slider('div_map_control', 'map_slider_zoom', {
				width: 180,
				onChange: function(value) {
					map.setCurrentZoomLevel(value);
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
			
			teleport_btn = new Ext.Button(buttonholder, {
				handler: function() {
					teleportTo(marked_position.sim, marked_position.x, marked_position.y, marked_position.z);
				},
				text: _("Map.TeleportVerb")
			});
			teleport_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '70px'});
			you_focus_btn = new Ext.Button(buttonholder, {
				handler: function() {
					map.centerAndZoomAtSLCoord(new SLPoint(position.sim, position.x, position.y),1);
					zoom_slider.setvalue(1);
				},
				text: _("Map.FocusYou")
			});
			you_focus_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '35px'});
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
			target_focus_btn = new Ext.Button(buttonholder, {
				handler: function() {
					map.centerAndZoomAtSLCoord(new SLPoint(marked_position.sim, marked_position.x, marked_position.y),1);
					zoom_slider.setvalue(1);
				},
				text: _("Map.FocusTarget"),
				disabled: true
			});
			target_focus_btn.getEl().setStyle({position: 'absolute', right: '80px', bottom: '0px'});
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
			});
			
			// Handle teleport status updates.
			AjaxLife.Network.MessageQueue.RegisterCallback('Teleport', function(data) {
				if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Start)
				{
					Sound.play(AjaxLife.STATIC_ROOT+"sounds/teleport.wav");
					teleport_dialog(true);
				}
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
							setTimeout('AjaxLife.Network.Send("SendAppearance",{})',1000);
						}
					});
				}
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Failed)
				{
					teleport_dialog(false);
					Ext.Msg.alert(_("Map.Teleportation"),_("Map.TeleportError"));
				}
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Cancelled)
				{
					teleport_dialog(false);
					AjaxLife.Widgets.Ext.msg(_("Map.Teleportation"),_("Map.TeleportCancelled"));
				}
			});
			
			// Map blocks...
			
			AjaxLife.Network.MessageQueue.RegisterCallback('MapBlocks', function(blocks) {
				for(var i in blocks.Blocks)
				{
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
					if(sims[i].Access == AjaxLife.Constants.Map.SimAccess.Down)
					{
						if(!sim_down_markers[i])
						{
							sim_down_markers[i] = new Marker(sim_down_icons, new SLPoint(i,128,128));
							map.addMarker(sim_down_markers[i]);
						}
					}
					else
					{
						if(sim_down_markers[i])
						{
							map.removeMarker(sim_down_markers[i]);
							sim_down_markers[i] = false;
						}
					}
					// Request item set.
					//AjaxLife.Network.Send('GetMapItems',{ItemType: AjaxLife.Constants.Map.Item.AgentLocations, Region: i}); // Don't bother with this until we're slightly more advanced - it'll choke the MG.
				}
			});
			AjaxLife.Network.Send('GetMapBlocks', {}); 
			
			// Map items...
			
			AjaxLife.Network.MessageQueue.RegisterCallback('MapItems', function(items) {
				if(items.ItemType == AjaxLife.Constants.Map.Item.AgentLocations)
				{
					if(items.Items.length > 0)
					{
						var first = true;
						//var querystring = '';
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
							//querystring += '&agent%5B%5D='+item.X+','+item.Y;
							//if(Prototype.Browser.WebKit)
							//{
							var marker = new Marker(marker_agent_icons, new XYPoint(item.X / 256.0, item.Y / 256.0));
							if(map.getCurrentZoomLevel() <= 3) map.addMarker(marker);
							item.marker = marker;
							//}
							sims[sim.toLowerCase()].Items.Agents[sims[sim.toLowerCase()].Items.Agents.length] = item;
						});
						/*
						if(!Prototype.Browser.WebKit)
						{
							var transparent = new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/s.gif",1,1));
							var marker = new Marker([
								new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/agentoverlay.php?size=256"	+querystring,266,	266,true)),
								new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/agentoverlay.php?size=128"	+querystring,138,	138,true)),
								new Icon(new Img(AjaxLife.STATIC_ROOT+"/images/agentoverlay.php?size=64"	+querystring,74,	74,	true)),
								transparent,
								transparent,
								transparent], 
								new SLPoint(sim,128,128)
							);
							if(sims[sim.toLowerCase()].AgentMarker)
							{
								map.removeMarker(sims[sim.toLowerCase()].AgentMarker);
							}
							map.addMarker(marker);
							sims[sim.toLowerCase()].AgentMarker = marker;
						}
						*/
					}
				}
			});	
			
			setInterval(updateitems,600000)		
		},
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
		close: function() {
			map_win.hide();
		},
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
		move: function(sim, x, y, z) {
			map.removeMarker(marker_you);
			marker_you = new Marker(marker_you_icons,new SLPoint(sim,x,y));
			map.addMarker(marker_you);
			position = {sim: sim, x: x, y: y, z: z};
		},
		getpos: function() {
			return position;
		},
		TPDialog: function() {
			teleport_dialog(true);
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