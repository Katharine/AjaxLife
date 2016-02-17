AjaxLife.InstantMessages = function() {
	var sessions = {};
	var session_list = false;
	var unread_count = 0;
	
	// Merges two UUIDs
	function mergeuuids(uuid1, uuid2)
	{
		var binary = {'0': '0000','1': '0001','2': '0010','3': '0011','4': '0100','5': '0101','6': '0110','7': '0111',
						'8': '1000','9': '1001','a': '1010','b': '1011','c': '1100','d': '1101','e': '1110','f': '1111'};
		var hex = {'0000': '0','0001': '1','0010': '2','0011': '3','0100': '4','0101': '5','0110': '6','0111': '7',
					'1000': '8','1001': '9','1010': 'a','1011': 'b','1100': 'c','1101': 'd','1110': 'e','1111': 'f'};
		uuid1 = uuid1.gsub('-','');
		uuid2 = uuid2.gsub('-','');
		var bin1 = '';
		var bin2 = '';
		for(var i = 0; i < 32; ++i)
		{
				bin1 += binary[uuid1.charAt(i)];
				bin2 += binary[uuid2.charAt(i)];
		}
		var mergedbin = '';
		for(var i = 0; i < 128; ++i)
		{
				if(bin1.charAt(i) == '1' || bin2.charAt(i) == '1')
				{
						if(bin1.charAt(i) == '1' && bin2.charAt(i) == '1') mergedbin += '0';
						else mergedbin += '1';
				}
				else
				{
						mergedbin += '0';
				}
		}
		var mergeduuid = '';
		for(var i = 0; i < 128; i += 4)
		{
				mergeduuid += hex[mergedbin.substr(i,4)];
		}
		mergeduuid = mergeduuid.substr(0,8) + "-" + mergeduuid.substr(8,4) + "-" + mergeduuid.substr(12,4) + "-" + mergeduuid.substr(16,4) + "-" + mergeduuid.substr(20,12);
		return mergeduuid;
	}
	
	function updatelist(session)
	{
		var a = session.listentry.down('a');
		if(!a) return;
		if(session.unread > 0)
		{
			a.update(session.name + ' ('+session.unread+')');
		}
		else
		{
			a.update(session.name);
		}
	}
	
	function showmessage(sessionid, name, message)
	{
		if(!sessions[sessionid]) return;
		var session = sessions[sessionid];
		var line = new Element('div');
		var timestamp = new Element('span', {'class': 'timestamp'}).update("[" + AjaxLife.Utils.MakeTimestamp() + "]");
		var display = name;
		// The \ns won't show up in the log, but will show in the notification.
		if(message.startsWith('/me'))
		{
			display += '\n'+message.substr(3);
		}
		else
		{
			display += ': \n'+message;
		}
		var elem = new Element('span', {'class': 'message'}).update(display.escapeHTML());
		line.appendChild(timestamp);
		line.appendChild(elem);
		session.chatlog.appendChild(line);
		session.chatlog.scrollTop = session.chatlog.scrollHeight;
		if(iui.getSelectedPage().id != 'im-panel-'+sessionid)
		{
			// Make the notification show if touched.
			AjaxLife.UI.ShowNotification(display, function() {
				iui.showPage(session.panel);
			});
			++session.unread;
			++unread_count;
			AjaxLife.UI.SetIMCount(unread_count);
			updatelist(session);
		}
		if(session_list.firstChild && session_list.firstChild != session.listentry)
		{
			session_list.insertBefore(session.listentry, session_list.firstChild);
		}
	}
	
	function sendmessage(sessionid, message)
	{
		AjaxLife.Network.Send('SimpleInstantMessage', {
			IMSessionID: sessionid,
			Target: sessions[sessionid].target,
			Message: message
		}); 
	}
	
	// Handles the "Go" button.
	function handlesubmit(e, sessionid)
	{
		Event.stop(e); // We have to stop the form actually being submitted.
		var text = this.value;
		if(!text.blank())
		{
			sendmessage(sessionid, text);
			showmessage(sessionid, AjaxLife.UserName, text);
		}
		this.value = '';
		this.focus();
	}
	
	function panelshown(sessionid)
	{
		if(!sessions[sessionid]) return;
		var session = sessions[sessionid];
		session.chatlog.scrollTop = session.chatlog.scrollHeight;
		if(session.unread > 0)
		{
			unread_count -= session.unread;
			session.unread = 0;
			AjaxLife.UI.SetIMCount(unread_count);
			updatelist(session);
		}
	}
	
	function buildpanel(sessionid, targetkey, targetname)
	{
		// The actual panel
		var panel = AjaxLife.UI.CreateNewPanel('panel', 'im-panel-'+sessionid, targetname, false, false, panelshown.bind(this, sessionid));
		var chatlog = new Element('div', {'class': "comm-chatlog"});
		var spacer = new Element('div', {'class': 'comm-spacer'});
		chatlog.appendChild(spacer);
		panel.appendChild(chatlog);
		var input = new Element('input', {type: 'text', 'class': 'comm-input no-indent'});
		// We have to use a form and handle its submission because the iPhone appears to 
		// fail to fire onkeypress and co.
		var form = new Element('form', {method: 'get', action: '#'});
		form.appendChild(input);
		Event.observe(form, 'submit', handlesubmit.bindAsEventListener(input, sessionid));
		panel.appendChild(form);
		
		// Session list.
		var entry = new Element('li');
		var link = new Element('a', {href: '#im-panel-'+sessionid}).update(targetname);
		entry.appendChild(link);
		session_list.appendChild(entry);
		
		// Track the session
		sessions[sessionid] = {
			target: targetkey,
			name: targetname,
			panel: panel,
			chatlog: chatlog,
			input: input,
			listentry: entry,
			unread: 0
		};
		
		return panel;
	}
	
	function initui()
	{
		session_list = AjaxLife.UI.CreateNewPanel('list', 'imlist', 'Current IMs', false, true);
	}
	
	return {
		init: function() {
			initui();
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				if(data.GroupIM) return; // We don't support group IM yet.
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.MessageFromAgent)
				{
					if(!sessions[data.IMSessionID])
					{
						buildpanel(data.IMSessionID, data.FromAgentID, data.FromAgentName);
					}
					showmessage(data.IMSessionID, data.FromAgentName, data.Message);
				}
			});
		},
		Start: function(id, name, noshow) {
			var sid = mergeuuids(AjaxLife.AgentID, id);
			if(sessions[sid])
			{
				iui.showPage(sessions[sid].panel);
				return;
			}
			var panel = buildpanel(sid, id, name);
			iui.showPage(panel);
			sessions[sid].input.focus();
		}
	};
}();