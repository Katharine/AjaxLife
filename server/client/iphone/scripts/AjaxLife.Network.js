AjaxLife.Network = function() {
	function loggedout(reason)
	{
		var text = "You have logged out of Second Life.";
		if(reason)
		{
			text = "You have been logged out of Second Life:<br /><br />"+reason.escapeHTML();
		}
		var loggedout = AjaxLife.UI.CreateNewPanel('panel', 'loggedout', 'Logged out', true, true);
		var message = new Element('h2', {align: 'center'}).setStyle({paddingTop: '50px'}).update(text);
		loggedout.appendChild(message);
		iui.showPageById('loggedout');
	}

	return {
		init: function() {
			AjaxLife.Network.MessageQueue.init();
		},
		Logout: function(noprompt, message) {
			if(!noprompt && !confirm("Are you sure you want to log out?")) return;
			if(!message)
			{
				new Ajax.Request('api/logout', {
					method: 'post',
					parameters: {
						sid: AjaxLife.SessionID
					},
					onComplete: function(xhr) {
						AjaxLife.Network.MessageQueue.Shutdown();
						loggedout(message);
					}
				});
			}
			else
			{
				AjaxLife.Network.MessageQueue.Shutdown();
				loggedout(message);
			}
		},
		Send: function(message, opts) {
			if(!opts) opts = {};
			opts.sid = AjaxLife.SessionID;
			opts.MessageType = message;
			var callback = false;
			if(opts.callback)
			{
				callback = opts.callback;
			}
			delete opts.callback;
			new Ajax.Request('api/send', {
				method: 'post',
				parameters: opts,
				onSuccess: function(xhr) {
					if(xhr.responseJSON && callback)
					{
						callback(xhr.responseJSON);
					}
				}
			});
		},
		Connected: false
	};
}();

AjaxLife.Network.MessageQueue = function() {
	var interval = false;
	var callbacks = {};
	var requesting = false;
	var lastmessage = false;
	var disconnectwarned = false;
	
	// Check if we're still connected.
	function checkstatus()
	{
		if(disconnectwarned || !AjaxLife.Network.Connected) return;
		var now = new Date();
		if(!now.getTime() - lastmessage.getTime() > 60000)
		{
			disconnectwarned = true;
			alert("No data has been received for over a minute. You may have been disconnected.");
		}
	}
	
	function processqueue(queue)
	{
		if(!queue.each) return;
		queue.each(function(item) {
			if(callbacks[item.MessageType])
			{
				callbacks[item.MessageType].each(function(callback) {
					try
					{
						callback(item);
					}
					catch(e)
					{
						//
					}
				});
			}
			if(item.MessageType == 'Disconnected')
			{
				if(item.Reason != AjaxLife.Constants.NetworkManager.DisconnectType.ClientInitiated)
				{
					AjaxLife.Network.Logout(true, item.Message);
				}
			}
		});
	}
	
	function queuecallback(xhr)
	{
		var queue = xhr.responseJSON;
		if(!queue)
		{
			requestqueue();
		}
		lastmessage = new Date();
		disconnectwarned = false;
		processqueue(queue);
		requesting = false;
		if(AjaxLife.Network.Connected) requestqueue();
	}
	
	// Request queue.
	function requestqueue()
	{
		if(requesting) return;
		requesting = true;
		new Ajax.Request('api/events', {
			method: 'post',
			parameters: {
				sid: AjaxLife.SessionID
			},
			onSuccess: queuecallback,
			onFailure: function() {
				requesting = false;
				requestqueue();
			}
		});
	}
	
	return {
		init: function() {
			lastmessage = new Date();
			interval = setInterval(checkstatus, 10000); // Check every ten seconds.
			AjaxLife.Network.Connected = true;
			requestqueue();
		},
		Shutdown: function() {
			clearInterval(interval);
			AjaxLife.Network.Connected = false;
		},
		RegisterCallback: function(message, callback) {
			if(!callbacks[message]) callbacks[message] = [];
			callbacks[message].push(callback);
		}
	}
}();