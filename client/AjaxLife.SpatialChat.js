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
	
	function add(text, sourcetype)
	{
		var line = Ext.get(document.createElement('div'));
		line.addClass("chatline");
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
		timestamp.addClass("chattimestamp");
		var time = new Date();
		timestamp.dom.appendChild(document.createTextNode("["+time.getHours()+":"+((time.getMinutes()<10)?("0"+time.getMinutes()):time.getMinutes())+"]"));
		line.dom.appendChild(timestamp.dom);
		line.dom.appendChild(document.createTextNode(" "+text));
		div_chat_history.dom.appendChild(line.dom);
		div_chat_history.dom.scrollTop = div_chat_history.dom.scrollHeight;
	}
	
	function incomingline (name, message, sourcetype, type)
	{
		if(message.blank())
		{
			return;
		}
		if(sourcetype != AjaxLife.Constants.MainAvatar.ChatSourceType.System)
		{
			if(message.substr(0,3) == "/me")
			{
				message = name+message.substr(3);
			}
			else
			{
				var you = false;
				if(name == gUserName)
				{
					name = _("SpatialChat.You");
					you = true;
				}
				if(type == AjaxLife.Constants.MainAvatar.ChatType.Shout)
				{
					message = name+(you?_("SpatialChat.SecondPersonShout"):_("SpatialChat.ThirdPersonShout"))+" "+message;
				}
				else if(type == AjaxLife.Constants.MainAvatar.ChatType.Whisper)
				{
					message = name+(you?_("SpatialChat.SecondPersonWhisper"):_("SpatialChat.ThirdPersonWhisper"))+" "+message;
				}
				else
				{
					message = name+(you?_("SpatialChat.SecondPersonSay"):_("SpatialChat.ThirdPersonSay"))+" "+message;
				}
			}
		}
		add(message, sourcetype);
	}
	
	return {
		// Public
		init: function() {
			chat_win = new Ext.BasicDialog("dlg_chat",{
				width: 500,
				height: 300,
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("SpatialChat.WindowTitle")
			});
			chat_win.body.setStyle({overflow: 'hidden'});
			div_chat_history = Ext.get(document.createElement('div'));
			div_chat_history.setStyle({height: '241px', width: '99%', overflow: 'auto'});
			box_chat_entry = Ext.get(document.createElement('input'));
			box_chat_entry.dom.setAttribute('type','text');
			box_chat_entry.setStyle({width: '310px', height: '15px', 'float': 'left'});
			
			chat_win.on('resize',function(win, width, height) {
				div_chat_history.setStyle({height: (height-59)+'px'});
				box_chat_entry.setStyle({width: (width-190)+'px'});
				div_chat_history.dom.scrollTop = div_chat_history.dom.scrollHeight;
			});
			
			chat_win.body.dom.appendChild(div_chat_history.dom);
			chat_win.body.dom.appendChild(box_chat_entry.dom);
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
			AjaxLife.Friends.AddStatusCallback(function(friend) {
				add(_("Friends.OnlineNotification",{name: friend.Name, status: (friend.Online?_("Friends.Online"):_("Friends.Offline"))}),AjaxLife.Constants.MainAvatar.ChatSourceType.System);
			});
			
			// Incoming chat.
			AjaxLife.Network.MessageQueue.RegisterCallback('SpatialChat', function(data) {
				//alert(data);
				if(data.Audible > -1)
				{
					if(data.Type == AjaxLife.Constants.MainAvatar.ChatType.Whisper	|| 
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.Shout	||
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.Normal	||
						data.Type == AjaxLife.Constants.MainAvatar.ChatType.OwnerSay)
					{
						incomingline(data.FromName, data.Message,data.SourceType, data.Type);
					}
				}
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromObject)
				{
					incomingline(data.FromAgentName, data.Message, AjaxLife.Constants.MainAvatar.ChatSourceType.Object, AjaxLife.Constants.MainAvatar.ChatType.Normal);
				}
			});
		},
		
		addline: function(name, message, sourcetype, type) {
			incomingline(name, message, sourcetype, type);
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