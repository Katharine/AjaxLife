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

AjaxLife.SpatialChat = function() {
	// Private
	var chat_win = false;
	var div_chat_history = false;
	var box_chat_entry = false;
	var btn_shout = false;
	var btn_say = false;
	var btn_whisper = false;
	var last_channel = 0;
	var anim_started = false;
	
	// Send a message to the server.
	// If the message starts with a "/", extra processing takes place first:
	// If the message starts "//" it's sent on the the last-used channel.
	// If the message starts "/123" (or other number), the message is sent on that channel.
	// The channel number is determined by counting characters forward until we reach something
	// not in the numbers array.
	// The message will be sent back to us, so we don't have to add it to the log.
	function sendmessage(type, message)
	{
		var channel = 0;
		var nums = [0,1,2,3,4,5,6,7,8,9];
		var indexpos = 0;
		if(message.substr(0,1) == "/")
		{
			if(message.substr(1,1) == "/")
			{
				channel = last_channel;
				message = message.substr(2);
			}
			else
			{
				for(var i = 1; i < message.length; ++i)
				{
					if(nums.indexOf(message.substr(i,1)) > -1)
					{
						indexpos = i;
					}
					else
					{
						break;
					}
				}
				if(indexpos > 0)
				{
					channel = message.substr(1,indexpos);
					last_channel = channel;
					message = message.substr(indexpos+1);
				}
			}
		}
		AjaxLife.Network.Send("SpatialChat", {
			Message: message,
			Channel: channel,
			Type: type
		});
	}
	
	// Add a line to the chatlog. Formatting is applied based on the sourcetype,
	// and a timestamp is calculated in the user's timezone (assuming their computer clock is accurate)
	function add(text, sourcetype)
	{
		text = AjaxLife.Utils.LinkURLs(text.escapeHTML());
		// Make a div to put this in.
		var line = Ext.get(document.createElement('div'));
		line.addClass("chatline");
		// Give the line the appropriate class for the type of message it is.
		if(sourcetype == AjaxLife.Constants.MainAvatar.ChatSourceType.System)
		{
			line.addClass("systemmessage");
		}
		else if(sourcetype == AjaxLife.Constants.MainAvatar.ChatSourceType.Agent)
		{
			line.addClass("agentmessage");
		}
		else if(sourcetype == AjaxLife.Constants.MainAvatar.ChatSourceType.Object)
		{
			line.addClass("objectmessage");
		}
		var timestamp = Ext.get(document.createElement('span'));
		// Make a timestamp in the user's timezone
		timestamp.addClass("chattimestamp");
		var time = new Date();
		// Build the timestamp into an actual string and put it into an HTML node.
		timestamp.dom.appendChild(document.createTextNode("[" + time.getHours() + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : time.getMinutes()) + "]"));
		// Put the timestamp at the beginning of the line.
		line.dom.appendChild(timestamp.dom);
		// Add the actual text.
		line.dom.appendChild(document.createTextNode(" "));
		var span = document.createElement('span');
		span.innerHTML = text;
		line.dom.appendChild(span);
		// Add the line to the chat log.
		div_chat_history.dom.appendChild(line.dom);
		// Scroll the chatlog down to the new entry.
		div_chat_history.dom.scrollTop = div_chat_history.dom.scrollHeight;
	}
	
	// Some incoming chat. This is essentially a wrapper around addline, with some
	// processing to deal with formatting it in the first person, use of "/me"
	// (which requres removal of the colon), and to add the appropriate verb to the line
	// (i.e. if they're shouting or whispering)
	function incomingline (name, message, sourcetype, type)
	{
		// Ignore blank lines.
		if(message.blank())
		{
			return;
		}
		// Only do this processing if it's not a system message.
		if(sourcetype != AjaxLife.Constants.MainAvatar.ChatSourceType.System)
		{
			// If it's a /me, strip the "/me" and combine the name and message.
			if(message.substr(0,3) == "/me")
			{
				message = name+message.substr(3);
			}
			else
			{
				var you = false;
				// If we said it.
				if(name == gUserName)
				{
					name = _("SpatialChat.You");
					you = true;
				}
				// Say it was shouted if it was shouted.
				if(type == AjaxLife.Constants.MainAvatar.ChatType.Shout)
				{
					message = name+(you?_("SpatialChat.SecondPersonShout"):_("SpatialChat.ThirdPersonShout"))+" "+message;
				}
				// Say it was whispered if it was whispered.
				else if(type == AjaxLife.Constants.MainAvatar.ChatType.Whisper)
				{
					message = name+(you?_("SpatialChat.SecondPersonWhisper"):_("SpatialChat.ThirdPersonWhisper"))+" "+message;
				}
				// Otherwise just use a colon.
				else
				{
					message = name+(you?_("SpatialChat.SecondPersonSay"):_("SpatialChat.ThirdPersonSay"))+" "+message;
				}
			}
		}
		// Add it do the display.
		add(message, sourcetype);
	}
	
	return {
		// Public
		init: function() {
			// Build the window and UI
			chat_win = new Ext.BasicDialog("dlg_chat",{
				width: 500,
				height: 300,
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("SpatialChat.WindowTitle"),
				proxyDrag: !AjaxLife.Fancy
			});
			chat_win.body.setStyle({overflow: 'hidden'});
			div_chat_history = Ext.get(document.createElement('div'));
			div_chat_history.setStyle({height: '241px', width: '99%', overflow: 'auto'});
			box_chat_entry = Ext.get(document.createElement('input'));
			box_chat_entry.dom.setAttribute('type','text');
			box_chat_entry.setStyle({width: '310px', height: '15px', 'float': 'left'});
			// Resize the chatlog and input line when the window is resized.
			chat_win.on('resize',function(win, width, height) {
				div_chat_history.setStyle({height: (height-59)+'px'});
				box_chat_entry.setStyle({width: (width-190)+'px'});
				div_chat_history.dom.scrollTop = div_chat_history.dom.scrollHeight;
			});
			
			chat_win.body.dom.appendChild(div_chat_history.dom);
			chat_win.body.dom.appendChild(box_chat_entry.dom);
			// All of these buttons do exactly the same thing, but use a differing ChatType.
			// They clear the input box, focus it, and send the message. Not in that order.
			btn_say = new Ext.Button(chat_win.body, {
				handler: function() {
					sendmessage(AjaxLife.Constants.MainAvatar.ChatType.Normal,box_chat_entry.dom.value);
					box_chat_entry.dom.value = '';
					box_chat_entry.dom.focus();
				},
				text: _("SpatialChat.Say"),
				height: '12px'
			});
			btn_say.getEl().setStyle({position: 'absolute', right: '125px', bottom: '2px'});
			btn_whisper = new Ext.Button(chat_win.body, {
				handler: function() {
					sendmessage(AjaxLife.Constants.MainAvatar.ChatType.Whisper,box_chat_entry.dom.value);
					box_chat_entry.dom.value = '';
					box_chat_entry.dom.focus();
				},
				text: _("SpatialChat.Whisper"),
				height: '12px'
			});
			btn_whisper.getEl().setStyle({position: 'absolute', right: '59px', bottom: '2px'});
			btn_shout = new Ext.Button(chat_win.body, {
				handler: function() {
					sendmessage(AjaxLife.Constants.MainAvatar.ChatType.Shout,box_chat_entry.dom.value);
					box_chat_entry.dom.value = '';
					box_chat_entry.dom.focus();
				},
				text: _("SpatialChat.Shout"),
				height: '12px'
			});
			btn_shout.getEl().setStyle({position: 'absolute', right: '5px', bottom: '2px'});
			// This captures keys pressed in the chatbox. If the key was the return key,
			// we send the message and stop the typing animation. The remainder is handled by
			// the keypress event later on, as that accounts for holding keys down. This isn't there
			// because we don't want the message to be sent repeatedly.
			box_chat_entry.addListener('keyup', function(event) {
				if(event.keyCode == 13 || event.which == 13)
				{
					if(box_chat_entry.dom.value != '')
					{
						AjaxLife.Network.Send("StopAnimation", {
							Animation: AjaxLife.Constants.Animations.avatar_type
						});
						AjaxLife.Network.Send("SpatialChat", {
							Message: "a",
							Channel: 0,
							Type: AjaxLife.Constants.MainAvatar.ChatType.StopTyping
						});
						anim_started = false;
						sendmessage(AjaxLife.Constants.MainAvatar.ChatType.Normal,box_chat_entry.dom.value);
						box_chat_entry.dom.value = '';
						box_chat_entry.dom.focus();
					}
				}
			});
			// This is set by the keypress event in the chatbox. It stops the typing animation
			// and sends the StopTyping message.
			var chat_stop_task = new Ext.util.DelayedTask(function() {
				//AjaxLife.Network.Send("StopAnimation", {
				// FIXME: Code duplication is bad. (See 17 lines up)
				AjaxLife.Network.Send("StopAnimation", {
					Animation: AjaxLife.Constants.Animations.avatar_type
				});
				AjaxLife.Network.Send("SpatialChat", {
					Message: "a",
					Channel: 0,
					Type: AjaxLife.Constants.MainAvatar.ChatType.StopTyping
				});
				anim_started = false;
			});
			// If the first character of the text is not "/", this sends the StartTyping
			// message and starts the typing animation, if this hasn't already been done.
			// After two seconds of not typing, the chat_stop_task function will be fired.
			box_chat_entry.addListener('keypress', function(event) {
				if(!anim_started && box_chat_entry.dom.value.substr(0,1) != '/')
				{
					anim_started = true;
					AjaxLife.Network.Send("StartAnimation", {
						Animation: AjaxLife.Constants.Animations.avatar_type
					});
					AjaxLife.Network.Send("SpatialChat", {
						Message: "a",
						Channel: 0,
						Type: AjaxLife.Constants.MainAvatar.ChatType.StartTyping
					});
				}
				chat_stop_task.delay(2000);
			});
			
			//chat_win.on('open', function() {
			//	box_chat_entry.dom.focus();						 
			//});
			
			// Friend notifications.
			// This just adds an online/offline note to the chatlog when friends log on or off.
			AjaxLife.Friends.AddStatusCallback(function(friend) {
				add(_("Friends.OnlineNotification",{name: friend.Name, status: (friend.Online?_("Friends.Online"):_("Friends.Offline"))}),AjaxLife.Constants.MainAvatar.ChatSourceType.System);
			});
			
			// Incoming chat.
			// This deals with incoming chat. If it's audible, and is a type of standard chat,
			// it is proceesed by the incomingline function. Otherwise we ignore it.
			// (To avoid printing messages whenever people type or annoying things like that)
			AjaxLife.Network.MessageQueue.RegisterCallback('SpatialChat', function(data) {
				if(data.Audible > -1)
				{
					// Check that it is actually a displayable chat message.
					if(data.Type == AjaxLife.Constants.MainAvatar.ChatType.Whisper	|| 
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.Shout	||
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.Normal	||
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.OwnerSay)
					{
						incomingline(data.FromName, data.Message,data.SourceType, data.Type);
					}
				}
			});
			// We subscribe to the InstantMessage event in order to take account of objects
			// using the llInstantMessage function. We simply handle this as normal object chat.
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				// Only do anything if this message comes from an object.
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromObject)
				{
					incomingline(data.FromAgentName, data.Message, AjaxLife.Constants.MainAvatar.ChatSourceType.Object, AjaxLife.Constants.MainAvatar.ChatType.Normal);
				}
			});
		},
		
		// Manually add a line to the chatlog
		addline: function(name, message, sourcetype, type) {
			incomingline(name, message, sourcetype, type);
		},
		// Add a system message to the chatlog.
		systemmessage: function(message) {
			add(message,AjaxLife.Constants.MainAvatar.ChatSourceType.System);
		},
		open: function(opener) {
			if(opener)
			{
				chat_win.show(opener);
			}
			else
			{
				chat_win.show();
			}
		},
		close: function() {
			chat_win.hide();
		},
		toggle: function(opener) {
			if(!chat_win.isVisible())
			{
				if(opener)
				{
					chat_win.show(opener);
				}
				else
				{
					chat_win.show();
				}
			}
			else
			{
				chat_win.hide();
			}
		}
	};
}();