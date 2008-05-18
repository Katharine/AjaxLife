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

// IM Window Handler
AjaxLife.InstantMessage = function() {
	// Private
	var dialog = false;
	var activesession = false;
	var width = 700;
	var height = 400;
	var chats = {};
	var highlighted = new Array();
	var origtabcolour = false;
	var highlightcolour = 'red';
	var highlight = false;
	var friendlist = false;
	var noted_typing = false;
	var grouplist = false;
	var groups = {};
	
	function fillgroups(data)
	{
		for(var key in data.Groups)
		{
			var group = data.Groups[key];
			groups[key] = group;
			AjaxLife.NameCache.AddGroup(key,group.Name);
			grouplist.add(key,group.Name);
		}
	}
	
	// Set a tab to flash
	function highlighttab(sessionid)
	{
		if(chats[sessionid] && highlighted.indexOf(sessionid) == -1)
		{
			origtabcolour = chats[sessionid].tab.textEl.getStyle('color');
			highlighted[highlighted.length] = sessionid;
		}
	};
	
	// Set a tab to stop flashing
	function unhighlight(sessionid)
	{
		highlighted = highlighted.without(sessionid);
		if(chats[sessionid]) chats[sessionid].tab.textEl.setStyle({color: origtabcolour});
	};
	
	// Turn the text of a tab red or not red, alternating each time it's called.
	function processhighlight()
	{
		highlight = !highlight;
		highlighted.each(function(item) {
			// Check that the tab's still there. If it's not, remove it from the array.
			if(chats[item])
			{
				chats[item].tab.textEl.setStyle({color: highlight?highlightcolour:origtabcolour});
			}
			else
			{
				highlighted = highlighted.without(item);
			}
		});
	};
	
	// Handles resized tabs.
	function fixtab(sessionid)
	{
		if(chats[sessionid])
		{
			chats[sessionid].content.dom.scrollTop = chats[sessionid].content.dom.scrollHeight;
			chats[sessionid].content.setStyle({height: (height - 88)+'px'});
			chats[sessionid].entrybox.setStyle({width: (width - 133)+'px'});
		}
	};
	
	// Sends an IM saying the target, using the sessionid.
	// NOTE: sessionid should be the same each time an agent is messaged - otherwise the IM
	// will appear in a different tab in the official client.
	function sendmessage(target, message, sessionid)
	{
		if(message.blank())
		{
			return;
		}
		if(sessionid == null)
		{
			sessionid = AjaxLife.Utils.UUID.Random();
		}
		// Notify other person that typing has stopped (unless we're in a group chat)
		if(!chats[sessionid].groupIM)
		{
			AjaxLife.Network.Send('GenericInstantMessage', {
				Message: "none",
				Target: chats[sessionid].target,
				IMSessionID: sessionid,
				Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
				Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping
			});
			AjaxLife.Network.Send("SimpleInstantMessage", {
				IMSessionID: sessionid,
				Target: chats[sessionid].groupIM ? sessionid : target,
				Message: message
			});
			// Add the IM to your own window, being sure to handle /me correctly.
			if(message.substr(0,3) == "/me")
			{
				message = gUserName+message.substr(3);
			}
			else
			{
				message = gUserName+": "+message;
			}
			appendline(sessionid,message);
		}
		else
		{
			AjaxLife.Network.Send("GroupInstantMessage", {
				Message: message,
				Group: sessionid
			});
		}
		noted_typing = false;
	};
	
	// Creates a new IM session with agent "id" who is called "name".
	// Session ID should be generated such that all IMs with the target will have the same ID,
	// but IMs from different people to the same agent, or the same person to different agents, will not.
	function createTab(id, name, sessionid, groupIM)
	{
		if(!groupIM) groupIM = false; // Avoid differences between false and undefined.
		AjaxLife.Debug("InstantMessage: Creating session "+sessionid+" with "+id+" ("+name+"; groupIM = "+groupIM+")");
		// Create the tab and add to the array.
		chats[sessionid] = {
			tab: dialog.getTabs().addTab("im-"+sessionid, (groupIM ? "(hippos)" : name), "", true),
			name: name,
			target: id,
			content: false,
			entrybox: false,
			sendbtn: false,
			div_typing: false,
			session: sessionid,
			groupIM: groupIM
		};
		if(groupIM)
		{
			AjaxLife.Debug("InstantMessage: Looking up group "+sessionid+"...");
			AjaxLife.NameCache.FindGroup(sessionid, function(groupname) {
				AjaxLife.Debug("InstantMessage: Found group name: "+groupname);
				chats[sessionid].name = groupname;
				chats[sessionid].tab.setText(groupname);
			});
		}
		chats[sessionid].tab.on('close',function() {
			// Send message informing that we have left the conversation.
			AjaxLife.Network.Send('GenericInstantMessage', {
				Message: "",
				Target: id,
				IMSessionID: sessionid,
				Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
				Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.SessionDrop
			});
			if(dialog.getTabs().getActiveTab() && dialog.getTabs().getActiveTab().id == chats[sessionid].tab.id)
			{
				activesession = false;
			}
			delete chats[sessionid];
		});
		chats[sessionid].tab.bodyEl.setStyle({'overflow': 'hidden'});
		// Chat area
		var content = Ext.get(document.createElement('div'));
		content.setStyle({overflow: 'auto', width:'99%'});
		chats[sessionid].content = content;
		var entrybox = Ext.get(document.createElement('input'));
		entrybox.setHeight(20);
		chats[sessionid].entrybox = entrybox;
		chats[sessionid].tab.bodyEl.setStyle({overflow: 'hidden'});
		chats[sessionid].tab.bodyEl.dom.appendChild(content.dom);
		chats[sessionid].tab.bodyEl.dom.appendChild(entrybox.dom);
		// Button setup, callbacks and formatting.
		var style = {position: 'absolute', bottom: '0px', right: '0px'};
		chats[sessionid].sendbtn = new Ext.Button(chats[sessionid].tab.bodyEl, {
			handler: function() {
				sendmessage(id, entrybox.dom.value, chats[sessionid].session);
				entrybox.dom.value = '';
				entrybox.dom.focus();
			},
			text: _("InstantMessage.Send")
		});
		chats[sessionid].sendbtn.getEl().setStyle(style);
		style.right = '48px';
		// We can't do group profiles yet.
		if(!groupIM)
		{
			(new Ext.Button(chats[sessionid].tab.bodyEl, {
				handler: function() {
					new AjaxLife.Profile(chats[sessionid].target);
				},
				text: _("InstantMessage.Profile")
			})).getEl().setStyle(style);
		}
		div_typing = Ext.get(document.createElement('div'));
		div_typing.addClass(['chatline','agenttyping']);
		div_typing.dom.appendChild(document.createTextNode(_("InstantMessage.Typing",{name: name})));
		chats[sessionid].div_typing = div_typing;
		// None of the "... is typing" stuff works in group IMs.
		if(!groupIM)
		{
			// Called two seconds after the last key is pressed. Sends not typing notification.
			var delayed_stop_typing = new Ext.util.DelayedTask(function() {
				AjaxLife.Network.Send('GenericInstantMessage', {
					Message: "none",
					Target: chats[sessionid].target,
					IMSessionID: chats[sessionid].session,
					Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
					Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping
				});
				noted_typing = false;
			});
			// Sends typing notification and sets timeout for above function to two seconds.
			entrybox.on('keypress',function(e) {
				if(!noted_typing)
				{
					noted_typing = true;
					AjaxLife.Network.Send('GenericInstantMessage', {
						Message: "none",
						Target: chats[sessionid].target,
						IMSessionID: chats[sessionid].session,
						Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
						Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StartTyping
					});
				}
				delayed_stop_typing.delay(2000);
			});
		}
		entrybox.on('keyup',function(e) {
			if(e.keyCode == 13 || e.which == 13)
			{
				sendmessage(id, entrybox.dom.value, sessionid);
				entrybox.dom.value = '';
				entrybox.dom.focus();
			}
		});
		chats[sessionid].tab.on('activate',function() {
			unhighlight(sessionid);
			activesession = sessionid;
			fixtab(sessionid);
			entrybox.dom.focus();
		});
		var currenttab = dialog.getTabs().getActiveTab().id;
		// These are essentially contentless, so switch IM window if we're activated and on one of these.
		if(currenttab == 'im-default-tab' || currenttab == 'im-group-tab')
		{
			chats[sessionid].tab.activate();
		}
		return true;
	};
	
	// Append a line to the box with a timestamp.
	function appendline(session, text)
	{
		if(chats[session] && chats[session].content)
		{
			text = AjaxLife.Utils.LinkURLs(text.escapeHTML());
			var line = Ext.get(document.createElement('div'));
			line.addClass(["agentmessage","chatline"]);
			var timestamp = Ext.get(document.createElement('span'));
			timestamp.addClass("chattimestamp");
			var time = new Date();
			timestamp.dom.appendChild(document.createTextNode("["+time.getHours()+":"+((time.getMinutes()<10)?("0"+time.getMinutes()):time.getMinutes())+"]"));
			line.dom.appendChild(timestamp.dom);
			line.dom.appendChild(document.createTextNode(" "));
			var span = document.createElement('span');
			span.innerHTML = text;
			line.dom.appendChild(span);
			chats[session].content.dom.appendChild(line.dom);
			// Scroll to the end.
			chats[session].content.dom.scrollTop = chats[session].content.dom.scrollHeight;
		}
		else
		{
			AjaxLife.Widgets.Ext.msg("Warning","Instant message with unknown ID {0}:<br />{1}",session,text);
		}
	};
	
	function joingroupchat(group)
	{		
		AjaxLife.Network.Send("GenericInstantMessage", {
			Message: "",
			Target: group,
			IMSessionID: group,
			Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
			Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.SessionGroupStart
		});
	}
	
	return {
		// Public
		init: function () {
			// Create the new window at 700x400, with a default tab for friendlist.
			dialog = new Ext.BasicDialog("dlg_im", {
				height: 400,
				width: 700,
				minHeight: 100,
				minWidth: 150,
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("InstantMessage.WindowTitle"),
				proxyDrag: !AjaxLife.Fancy
			});
			
			dialog.getTabs().addTab("im-default-tab",_("InstantMessage.OnlineFriends"),"",false).activate();
			friendlist = new AjaxLife.Widgets.SelectList('im-friend-list',dialog.getTabs().getActiveTab().bodyEl.dom,{
				width: '99%',
				callback: function(key) {
					AjaxLife.NameCache.Find(key, function(name) {
						createTab(key, name, AjaxLife.Utils.UUID.Combine(gAgentID,key));
					});
				}
			});
			var sortdelay = new Ext.util.DelayedTask(function() {
				friendlist.sort();
			});
			// Deal with adding and removing friends to/from the friend list.
			var addname = function (friend) {
				if(friend.Online)
				{
					friendlist.add(friend.ID,friend.Name);
				}
				else
				{
					friendlist.remove(friend.ID);
				}
				sortdelay.delay(200);
			};
			AjaxLife.Friends.AddStatusCallback(addname);
			AjaxLife.Friends.AddNewFriendCallback(addname);
			dialog.body.setStyle({overflow: 'hidden'});
			width = 700;
			height = 400;
			dialog.on('resize', function(d, w, h) {
				width = w;
				height = h;
				fixtab(activesession);
			});
			
			var grouptab = dialog.getTabs().addTab("im-group-tab",_("InstantMessage.Groups"), "", false);
			
			grouplist = new AjaxLife.Widgets.SelectList("im-group-list", grouptab.bodyEl.dom, {
				width: '99%',
				callback: function(key) {
					joingroupchat(key);
					createTab(key, key, key, true);
					chats[key].entrybox.dom.enabled = false;
					chats[key].sendbtn.getEl().dom.enabled = false;
				}
			});
			
			// Handle successfully started chats.
			AjaxLife.Network.MessageQueue.RegisterCallback('ChatGroupJoin', function(data) {
				var group = data.GroupChatSessionID;
				if(chats[group] && !chats[group].entrybox.dom.enabled)
				{
					if(data.Success)
					{
						chats[group].entrybox.dom.enabled = true;
						chats[group].sentbtn.dom.enabled = true;
					}
					else
					{
						appendline(group, _("InstantMessage.SessionCreateFailed"));
					}
				}
			});
			
			// Handle incoming IMs.
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage',function(data) {
				// Ensure it's something to display
				if(data.IMSessionID == AjaxLife.Utils.UUID.Zero) return; // Estate messages have null sessions.
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromAgent || data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.SessionSend)
				{
					// Create a tab for them if we haven't already. Also play new IM sound.
					if(!chats[data.IMSessionID])
					{
						AjaxLife.Widgets.Ext.msg("",_("InstantMessage.NewIMSession", {from: data.FromAgentName}), "newimsession", true);
						if(data.GroupIM) joingroupchat(data.IMSessionID);
						var created = createTab(data.FromAgentID, data.FromAgentName, data.IMSessionID, data.GroupIM);
						if(!created)
						{
							AjaxLife.Widgets.Ext.msg("Lost Instant Message","From: {0}<br />Message: {1}",data.FromAgentName,data.Message);
							return;
						}
						if(!dialog.isVisible())
						{
							dialog.show();
						}
						Sound.play(AjaxLife.STATIC_ROOT+"sounds/im.wav");
					}
					// Format the incoming message, taking care of /me.
					var message = data.Message;
					if(message.substr(0,3) == "/me")
					{
						message = data.FromAgentName+message.substr(3);
					}
					else
					{
						message = data.FromAgentName+": "+message;
					}
					// Assume they stopped typing.
					if(chats[data.IMSessionID].div_typing.dom.parentNode)
					{
						chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
					}
					// Actually add the line.
					appendline(data.IMSessionID, message);
					// If the tab is not active, make it flash.
					if(dialog.getTabs().getActiveTab().id != 'im-'+data.IMSessionID)
					{
						highlighttab(data.IMSessionID);
					}
				}
				// If we have a tab for the sessionid...
				if(chats[data.IMSessionID])
				{
					// Show typing note on StartTyping message, remove it on StopTyping.
					if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.StartTyping)
					{
						// If it's already there higher up, remove it from there.
						// This is arguably completely redundant.
						if(chats[data.IMSessionID].div_typing.dom.parentNode)
						{
							chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
						}
						chats[data.IMSessionID].content.dom.appendChild(chats[data.IMSessionID].div_typing.dom);
						// Scroll down to show it.
						chats[data.IMSessionID].content.dom.scrollTop = chats[data.IMSessionID].content.dom.scrollHeight;
					}
					else if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping)
					{
						if(chats[data.IMSessionID].div_typing && 
							chats[data.IMSessionID].div_typing.dom.parentNode && 
							typeof chats[data.IMSessionID].div_typing.dom.parentNode.removeChild == 'function')
						{
							chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
						}
					}
				}
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('CurrentGroups', fillgroups);
			AjaxLife.Network.Send("RequestCurrentGroups",{});
			// Highlighted tabs to flash every half second.
			setInterval(processhighlight,500);
		},
		open: function(opener) {
			if(opener)
			{
				dialog.show(opener);
			}
			else
			{
				dialog.show();
			}
		},
		close: function() {
			dialog.hide();
		},
		toggle: function(opener) {
			if(!dialog.isVisible())
			{
				this.open(opener);
			}
			else
			{
				this.close();
			}
		},
		start: function(id) {
			AjaxLife.NameCache.Find(id, function(name) {
				createTab(id,name,AjaxLife.Utils.UUID.Combine(gAgentID,id));
			});
		}
	};
}();