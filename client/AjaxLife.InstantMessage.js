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
	
	function highlighttab(sessionid)
	{
		if(chats[sessionid] && highlighted.indexOf(sessionid) == -1)
		{
			origtabcolour = chats[sessionid].tab.textEl.getStyle('color');
			highlighted[highlighted.length] = sessionid;
		}
	};
	
	function unhighlight(sessionid)
	{
		highlighted = highlighted.without(sessionid);
		if(chats[sessionid]) chats[sessionid].tab.textEl.setStyle({color: origtabcolour});
	};
	
	function processhighlight()
	{
		highlight = !highlight;
		highlighted.each(function(item) {
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
	
	function fixtab(sessionid)
	{
		if(chats[sessionid])
		{
			chats[sessionid].content.dom.scrollTop = chats[sessionid].content.dom.scrollHeight;
			chats[sessionid].content.setStyle({height: (height - 88)+'px'});
			chats[sessionid].entrybox.setStyle({width: (width - 82)+'px'});
		}
	};
	
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
		AjaxLife.Network.Send('GenericInstantMessage', {
			Message: "none",
			Target: chats[sessionid].target,
			IMSessionID: sessionid,
			Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
			Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping
		});
		noted_typing = false;
		AjaxLife.Network.Send("SimpleInstantMessage", {
			IMSessionID: sessionid,
			Target: target,
			Message: message
		});
		if(message.substr(0,3) == "/me")
		{
			message = gUserName+message.substr(3);
		}
		else
		{
			message = gUserName+": "+message;
		}
		appendline(sessionid,message);
	};
	
	function createTab(id, name, sessionid)
	{
		for(var i in chats)
		{
			if(chats[i].target == id)
			{
				chats[i].tab.activate();
				return false;
			}
		}
		chats[sessionid] = {
			tab: dialog.getTabs().addTab("im-"+sessionid+'-'+id,name,"",true),
			name: name,
			target: id,
			content: false,
			entrybox: false,
			sendbtn: false,
			div_typing: false
		};
		chats[sessionid].tab.on('close',function() {
			if(dialog.getTabs().getActiveTab() && dialog.getTabs().getActiveTab().id == chats[sessionid].tab.id)
			{
				activesession = false;
			}
			chats[sessionid] = false;
		});
		var content = Ext.get(document.createElement('div'));
		content.setStyle({overflow: 'auto', width:'99%'});
		chats[sessionid].content = content;
		var entrybox = Ext.get(document.createElement('input'));
		entrybox.setHeight(17);
		chats[sessionid].entrybox = entrybox;
		chats[sessionid].tab.bodyEl.setStyle({overflow: 'hidden'});
		chats[sessionid].tab.bodyEl.dom.appendChild(content.dom);
		chats[sessionid].tab.bodyEl.dom.appendChild(entrybox.dom);
		(new Ext.Button(chats[sessionid].tab.bodyEl, {
			handler: function() {
				sendmessage(id, entrybox.dom.value, sessionid);
				entrybox.dom.value = '';
				entrybox.dom.focus();
			},
			text: _("InstantMessage.Send"),
			height: '12px'
		})).getEl().setStyle({position: 'absolute', bottom: '0px', right: '0px'});
		div_typing = Ext.get(document.createElement('div'));
		div_typing.addClass(['chatline','agenttyping']);
		div_typing.dom.appendChild(document.createTextNode(_("InstantMessage.Typing",{name: name})));
		chats[sessionid].div_typing = div_typing;
		//content.dom.appendChild(div_typing.dom);
		var delayed_stop_typing = new Ext.util.DelayedTask(function() {
			AjaxLife.Network.Send('GenericInstantMessage', {
				Message: "none",
				Target: chats[sessionid].target,
				IMSessionID: sessionid,
				Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
				Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping
			});
			noted_typing = false;
		});
		entrybox.on('keypress',function(e) {
			if(!noted_typing)
			{
				noted_typing = true;
				AjaxLife.Network.Send('GenericInstantMessage', {
					Message: "none",
					Target: chats[sessionid].target,
					IMSessionID: sessionid,
					Online: AjaxLife.Constants.MainAvatar.InstantMessageOnline.Online,
					Dialog: AjaxLife.Constants.MainAvatar.InstantMessageDialog.StartTyping
				});
			}
			delayed_stop_typing.delay(2000);
		});
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
		if(dialog.getTabs().getActiveTab().id == 'im-default-tab')
		{
			chats[sessionid].tab.activate();
		}
		return true;
	};
	
	function appendline(session, text)
	{
		if(chats[session] && chats[session].content)
		{
			var line = Ext.get(document.createElement('div'));
			line.addClass(["agentmessage","chatline"]);
			var timestamp = Ext.get(document.createElement('span'));
			timestamp.addClass("chattimestamp");
			var time = new Date();
			timestamp.dom.appendChild(document.createTextNode("["+time.getHours()+":"+((time.getMinutes()<10)?("0"+time.getMinutes()):time.getMinutes())+"]"));
			line.dom.appendChild(timestamp.dom);
			line.dom.appendChild(document.createTextNode(" "+text));
			chats[session].content.dom.appendChild(line.dom);
			chats[session].content.dom.scrollTop = chats[session].content.dom.scrollHeight;
		}
		else
		{
			AjaxLife.Widgets.Ext.msg("Warning","Instant message with unknown ID {0}:<br />{1}",session,text);
		}
	};
	
	return {
		// Public
		init: function () {
			dialog = new Ext.BasicDialog("dlg_im", {
				height: 400,
				width: 700,
				minHeight: 100,
				minWidth: 150,
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("InstantMessage.WindowTitle")
			});
			dialog.getTabs().addTab("im-default-tab",_("InstantMessage.OnlineFriends"),"",false).activate();
			friendlist = new AjaxLife.Widgets.SelectList('im-friendlist',dialog.getTabs().getActiveTab().bodyEl.dom,{
				width: '99%',
				callback: function(key) {
					AjaxLife.NameCache.Find(key, function(name) {
						createTab(key, name, AjaxLife.Utils.UUID.Combine(gSessionID,key));
					});
				}
			});
			AjaxLife.Friends.AddCallback(function (agentid, name, online) {
				if(online)
				{
					friendlist.add(agentid,name);
				}
				else
				{
					friendlist.remove(agentid);
				}
			});
			dialog.body.setStyle({overflow: 'hidden'});
			width = 700;
			height = 400;
			dialog.on('resize', function(d, w, h) {
				width = w;
				height = h;
				fixtab(activesession);
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage',function(data) {
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromAgent)
				{
					if(!chats[data.IMSessionID])
					{
						var created = createTab(data.FromAgentID, data.FromAgentName, data.IMSessionID);
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
					var message = data.Message;
					if(message.substr(0,3) == "/me")
					{
						message = data.FromAgentName+message.substr(3);
					}
					else
					{
						message = data.FromAgentName+": "+message;
					}
					if(chats[data.IMSessionID].div_typing.dom.parentNode)
					{
						chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
					}
					appendline(data.IMSessionID, message);
					if(dialog.getTabs().getActiveTab().id != 'im-'+data.IMSessionID+'-'+data.FromAgentID)
					{
						highlighttab(data.IMSessionID);
					}
				}
				if(chats[data.IMSessionID])
				{
					if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.StartTyping)
					{
						if(chats[data.IMSessionID].div_typing.dom.parentNode)
						{
							chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
						}
						chats[data.IMSessionID].content.dom.appendChild(chats[data.IMSessionID].div_typing.dom);
					}
					else if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.StopTyping)
					{
						chats[data.IMSessionID].div_typing.dom.parentNode.removeChild(chats[data.IMSessionID].div_typing.dom);
					}
				}
			});
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
				if(opener)
				{
					dialog.show(opener);
				}
				else
				{
					dialog.show();
				}
			}
			else
			{
				dialog.hide();
			}
		}
	};
}();