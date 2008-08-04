AjaxLife.Chat = function() {
	var chat_panel = false;
	var chat_log = false;
	var chat_input = false;
	var last_channel = 0;
	var unread = 0;
	
	function panelshown()
	{
		// This scrolls to the bottom.
		chat_log.scrollTop = chat_log.scrollHeight;
		$('home-to-chat').update('Local chat');
	}
	
	function handlesubmit(e)
	{
		Event.stop(e);
		var message = chat_input.value;
		if(message.blank()) return;
		var channel = 0;
		var nums = [0,1,2,3,4,5,6,7,8,9];
		var indexpos = 0;
		if(message.startsWith("/"))
		{
			if(message.startsWith("//"))
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
			Type: AjaxLife.Constants.MainAvatar.ChatType.Normal
		});
		chat_input.value = '';
		chat_input.focus();
	}
	
	function add(message, source)
	{
		// Build chat line
		var line = new Element('div');
		var timestamp = new Element('span', {'class': 'timestamp'}).update("[" + AjaxLife.Utils.MakeTimestamp() + "]");
		var chat = new Element('span', {'class': 'message'}).update(message);
		switch(source)
		{
		case AjaxLife.Constants.MainAvatar.ChatSourceType.System:
			chat.addClassName("system");
			break;
		case AjaxLife.Constants.MainAvatar.ChatSourceType.Agent:
			chat.addClassName("agent");
			break;
		case AjaxLife.Constants.MainAvatar.ChatSourceType.Object:
			chat.addClassName("object");
			break;
		}
		line.appendChild(timestamp);
		line.appendChild(chat);
		
		// Add line to log
		chat_log.appendChild(line);
		chat_log.scrollTop = chat_log.scrollHeight;
		
		// Increase unread count and display, if applicable.
		if(iui.getSelectedPage().id != 'chat')
		{
			++unread;
			$('home-to-chat').update('Local chat ('+unread+')');
		}
	}
	
	function addline(name, id, message, source, type)
	{
		if(message.blank()) return;
		if(source != AjaxLife.Constants.MainAvatar.ChatSourceType.System)
		{
			if(message.startsWith("/me"))
			{
				message = name+message.substr(3);
			}
			else
			{
				var you = false;
				if(id == AjaxLife.AgentID && source == AjaxLife.Constants.MainAvatar.ChatSourceType.Agent)
				{
					you = true;
					name = "You";
				}
				switch(type)
				{
				case AjaxLife.Constants.MainAvatar.ChatType.Shout:
					message = name + (you ? "shout: " : "shouts: ") + message;
					break;
				case AjaxLife.Constants.MainAvatar.ChatType.Whisper:
					message = name + (you ? "whisper: " : "whispers: ") + message;
					break;
				default:
					message = name + ": " + message;
					break;
				}
			}		
		}
		add(message, source);
	}
	
	function initui()
	{
		// The actual panel
		chat_panel = AjaxLife.UI.CreateNewPanel('panel', 'chat', 'Local chat', false, false, panelshown);
		chat_log = new Element('div', {'class': "comm-chatlog"});
		var spacer = new Element('div', {'class': 'comm-spacer'});
		chat_log.appendChild(spacer);
		chat_panel.appendChild(chat_log);
		chat_input = new Element('input', {type: 'text', 'class': 'comm-input no-indent'});
		// We have to use a form and handle its submission because the iPhone appears to 
		// fail to fire onkeypress and co.
		var form = new Element('form', {method: 'get', action: '#'});
		form.appendChild(chat_input);
		Event.observe(form, 'submit', handlesubmit);
		chat_panel.appendChild(form);
	}
	
	return {
		init: function() {
			initui();
			
			AjaxLife.Network.MessageQueue.RegisterCallback('SpatialChat', function(data) {
				if(data.Audible > -1 && (
					data.Type == AjaxLife.Constants.MainAvatar.ChatType.Whisper	|| 
					data.Type == AjaxLife.Constants.MainAvatar.ChatType.Shout	||
					data.Type == AjaxLife.Constants.MainAvatar.ChatType.Normal	||
					data.Type == AjaxLife.Constants.MainAvatar.ChatType.OwnerSay))
				{
					addline(data.FromName, data.ID, data.Message, data.SourceType, data.Type);
				}
			});
			
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromObject)
				{
					addline(data.FromAgentName, data.FromAgentID, data.Message, AjaxLife.Constants.MainAvatar.ChatSourceType.Object, AjaxLife.Constants.MainAvatar.ChatType.OwnerSay);
				}
			});
		}
	};
}();