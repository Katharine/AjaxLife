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
	var noted_typing = false;
	
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
		if(chats[sessionid] && chats[sessionid].tab) chats[sessionid].tab.textEl.setStyle({color: origtabcolour});
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
		var chat = chats[sessionid];
		// Notify other person that typing has stopped (unless we're in a group/conference chat)
		if(!chat.groupIM && !chat.conferenceIM)
		{
			AjaxLife.Network.Send('GenericInstantMessage', {
				Message: "none",
				Target: chat.target,
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
			appendline(sessionid, message, {name: gUserName, id: gAgentID});
		}
		else if(chat.groupIM)
		{
			AjaxLife.Network.Send("GroupInstantMessage", {
				Message: message,
				Group: sessionid
			});
		}
		else if(chat.conferenceIM)
		{
			AjaxLife.Network.Send('GenericInstantMessage', {
				Target: chat.target,
				Message: message,
				IMSessionID: sessionid,
				Dialog: 17,
				Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online
			});
		}
		noted_typing = false;
	};
	
	// Creates a new IM session with agent "id" who is called "name".
	// Session ID should be generated such that all IMs with the target will have the same ID,
	// but IMs from different people to the same agent, or the same person to different agents, will not.
	function createTab(id, name, sessionid, groupIM, conferenceIM)
	{
		if(!groupIM) groupIM = false; // Avoid differences between false and undefined.
		if(!conferenceIM) conferenceIM = false;
		// If this sessionid is used, use that tab again.
		if(chats[sessionid])
		{
			chats[sessionid].tab.activate();
			chats[sessionid].entrybox.focus();
			return;
		}
		AjaxLife.Debug("InstantMessage: Creating session "+sessionid+" with "+id+" ("+name+"; groupIM = "+groupIM+"; conferenceIM = "+conferenceIM+")");
		// Add 'conference' to the name if applicable.
		if(conferenceIM)
		{
			name += ' Conference';
		}
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
			groupIM: groupIM,
			conferenceIM: conferenceIM
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
				if(dialog.getTabs().getCount() == 0)
				{
					dialog.hide();
				}
			}
			delete chats[sessionid];
		});
		chats[sessionid].tab.bodyEl.setStyle({'overflow': 'hidden'});
		// Chat area
		var content = Ext.get(document.createElement('div'));
		content.setStyle({overflow: 'auto', width:'99%'});
		chats[sessionid].content = content;
		chats[sessionid].tab.bodyEl.dom.appendChild(content.dom);
		
		var entrybox = new AjaxLife.Widgets.ChatEntryBox(chats[sessionid].tab.bodyEl.dom, 'im-input-'+sessionid, function(text) { sendmessage(id, text, sessionid); }, {height: '20px'});
		
		chats[sessionid].entrybox = entrybox;
		chats[sessionid].tab.bodyEl.setStyle({overflow: 'hidden'});
		
		// Button setup, callbacks and formatting.
		var style = {position: 'absolute', bottom: '0px', right: '0px'};
		chats[sessionid].sendbtn = new Ext.Button(chats[sessionid].tab.bodyEl, {
			handler: function() {
				sendmessage(id, entrybox.getValue(), chats[sessionid].session);
				entrybox.resetLine();
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
		// None of the "... is typing" stuff works in group or conference IMs.
		if(!groupIM && !conferenceIM)
		{
			// Called two seconds after the last key is pressed. Sends not typing notification.
			var delayed_stop_typing = new Ext.util.DelayedTask(function() {
				// Make sure that this session still exists first.
				if(!chats[sessionid]) return;
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
			entrybox.addListener('keypress',function(e) {
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
		
		// ConferenceIM is not supported well
		if(conferenceIM)
		{
			chats[sessionid].sendbtn.disable();
			entrybox.setValue("Sending messages to conference IMs is currently unsupported.");
			entrybox.disable();
		}
		
		chats[sessionid].tab.on('activate',function() {
			unhighlight(sessionid);
			activesession = sessionid;
			fixtab(sessionid);
			entrybox.focus();
		});
		if(dialog.getTabs().getCount() == 1)
		{
			chats[sessionid].tab.activate();
			dialog.show();
			entrybox.focus();
		}
		return chats[sessionid].tab;
	};
	
	// Append a line to the box with a timestamp.
	function appendline(session, text, agent)
	{
		if(chats[session] && chats[session].content)
		{
			text = AjaxLife.Utils.LinkifyText(text);
			if(agent && agent.name && agent.id && agent.id != AjaxLife.Utils.UUID.Zero)
			{
				text = text.sub(agent.name, '<span class="name clickable" onclick="new AjaxLife.Profile(\''+agent.id+'\');">'+agent.name+'</span>');
			}
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
			// Create the new window at 700x400.
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
			
			dialog.body.setStyle({overflow: 'hidden'});
			width = 700;
			height = 400;
			dialog.on('resize', function(d, w, h) {
				width = w;
				height = h;
				fixtab(activesession);
			});
			// Alter the behaviour of the IM window's close button - we only close
			// the active tab.
			dialog.on('beforehide', function(d) {
				if(dialog.getTabs().getCount() > 0)
				{
					var index = dialog.getTabs().getActiveTab().id;
					dialog.getTabs().removeTab(index);
				}
				// Also close the window if there aren't any tabs left. This is 
				// actually redundant - the window is already closed when we remove
				// the tab.
				if(dialog.getTabs().getCount() == 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			});
			
			// Handle successfully started chats.
			AjaxLife.Network.MessageQueue.RegisterCallback('GroupChatJoin', function(data) {
				var group = data.GroupChatSessionID;
				if(chats[group] && !chats[group].entrybox.isEnabled() && chats[group].groupIM)
				{
					if(data.Success)
					{
						chats[group].entrybox.enable();
						chats[group].entrybox.setValue('');
						if(dialog.getTabs().getActiveTab() && dialog.getTabs().getActiveTab().id == 'im-'+group)
						{
							chats[group].entrybox.focus();
						}
						chats[group].sendbtn.enable();
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
				// If we get a group IM with an unknown session ID, it's a conference IM. I think.
				var conference = false;
				if(data.GroupIM && !AjaxLife.Groups.InGroup(data.IMSessionID))
				{
					data.GroupIM = false;
					conference = true;
				}
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromAgent || data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.SessionSend)
				{
					// Create a tab for them if we haven't already. Also play new IM sound.
					if(!chats[data.IMSessionID])
					{
						AjaxLife.Widgets.Ext.msg("",_("InstantMessage.NewIMSession", {from: data.FromAgentName}), "newimsession", true);
						if(data.GroupIM) joingroupchat(data.IMSessionID);
						var created = createTab(data.FromAgentID, data.FromAgentName, data.IMSessionID, data.GroupIM, conference);
						if(!created)
						{
							AjaxLife.Widgets.Ext.msg("Lost Instant Message","From: {0}<br />Message: {1}",data.FromAgentName,data.Message);
							return;
						}
						AjaxLife.Sound.Play("im");
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
					appendline(data.IMSessionID, message, {name: data.FromAgentName, id: data.FromAgentID});
					// If the tab is not active, make it flash.
					if(dialog.getTabs().getActiveTab() && dialog.getTabs().getActiveTab().id != 'im-'+data.IMSessionID)
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
			// Highlighted tabs to flash every half second.
			setInterval(processhighlight,500);
		},
		start: function(id) {
			this.Start(id, false);
		},
		Start: function(id, groupIM, focus) {
			if(!dialog.isVisible())
			{
				dialog.show();
			}
			if(groupIM)
			{
				joingroupchat(id);
				var tab = createTab(id, id, id, true);
				if(focus && tab) tab.activate();
				chats[id].entrybox.disable();
				chats[id].sendbtn.disable();
				chats[id].entrybox.setValue(_("InstantMessage.CreatingGroupChat"));
			}
			else
			{
				AjaxLife.NameCache.Find(id, function(name) {
					var tab = createTab(id,name,AjaxLife.Utils.UUID.Combine(gAgentID,id));
					if(focus && tab) tab.activate();
				});
			}
		}
	};
}();
