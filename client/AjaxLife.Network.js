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

AjaxLife.Network.Connected = false;

AjaxLife.Network.init = function() {
	AjaxLife.Network.MessageQueue.init();
};

// Sends a logout request, showing a modal dialog until a response is received.
AjaxLife.Network.logout = function(hidemessage) {
	var hanging = false;
	if(!hidemessage)
	{
		hanging = Ext.Msg.wait(_("Network.LoggingOut"));
	}
	var link = new Ext.data.Connection();
	link.request({
		url: "logout.kat",
		method: "POST",
		params: {
			sid: gSessionID
		},
		callback: function(options, success, response)
		{
			if(success)
			{
				AjaxLife.Network.MessageQueue.shutdown();
				if(!hidemessage)
				{
					hanging.hide();
					Ext.Msg.show({
						closable: false,
						title: "",
						msg: _("Network.LogoutSuccess"),
						modal: true,
						buttons: false
					});
				}
			}
			else
			{
				Ext.Msg.alert(_("Network.Error"),_("Network.LogoutError"));
			}
		}
	});
};

// This handles the receiving of messages from the server.
// The concept is a long poll - try looking up COMET in Wikipedia.
// A request to the server is made. The request remains open until 
// either the server has a response, or the 60 second timeout elapses.
// Since the server is set up to always produce a response within 30
// seconds (containing information about position and such), this should
// never happen, and as such is considered an error.
AjaxLife.Network.MessageQueue = function() {
	// Private
	var requesting = false;
	var link = new Ext.data.Connection({timeout: 60000});
	var callbacks = {};
	var interval = false;
	var lastmessage = false;
	
	// This function handled the incoming message queue, which should be an array.
	function processqueue(queue) {
		// Bail out if it's not an array.
		if(!queue.each) return;
		// For each message in the queue, call any applicable callbacks,
		// after checking that the callback really is a function.
		// In addition, some processing for network-oriented events is
		// done here.
		
		// This is where the vast majority of failures in AjaxLife surface - 
		// after an uncaught exception reaches this level, it should be caught and an 
		// (unhelpful) error displayed. If it isn't, the message queue crashes, and no
		// more incoming messages can be received without reloading the page.
		queue.each(function(item) {
			var handled = false;
			if(callbacks[item.MessageType])
			{
				try
				{
					callbacks[item.MessageType].each(function(callback) {
						if(callback && typeof callback == 'function')
						{
							callback(item);
						}
						else if(typeof callback != 'boolean')
						{
							AjaxLife.Widgets.Ext.msg("Error","Typeof callback = "+(typeof callback)+". MessageType = "+item.MessageType);
						}
					});
					handled = true;
				}
				catch(e)
				{
					AjaxLife.Widgets.Ext.msg("Error in processqueue",e.name+" - "+e.message);
				}
			}	
			// If the message is indicating disconnection, it's handled here.
			// If the disconnection was involuntary, a message is displayed.
			if(item.MessageType == 'Disconnected')
			{
				if(item.Reason != AjaxLife.Constants.NetworkManager.DisconnectType.ClientInitiated)
				{
					AjaxLife.Network.logout(true);
					// We should probably fire off some event here so we can disable bits of UI.
					// This used to be an unclosable message. Following feature requests, it can be closed,
					// but no actions can be performed other than viewing logs.
					Ext.Msg.alert(_("Network.Disconnected"),_("Network.LogoutForced", {reason: item.Message}));
				}
			}
			// If an unhandled message is received, complain about it.
			else if(!handled)
			{
				try
				{
					var parsed = '';
					for(var i in item)
					{
						parsed += i+': '+item[i]+'\n';
					}
					AjaxLife.Debug("Unhandled message: "+parsed);
				}
				catch(e)
				{
					// This should never happen. The number of things going wrong you'd have to have to get here is
					// high enough that we can just ignore this - especially since no useful information can be gleaned anyway.
				}
			}
		});
	};
	
	// This function deals with incoming data from the queue.
	function queuecallback(options, success, response)
	{
		lastmessage = new Date();
		// This can sometimes be called after disconnecting. This results in strange inconsistencies,
		// so ignore it.
		if(!AjaxLife.Network.Connected) return;
		// Something is very broken if the "catch" clause here is reached.
		try
		{
			if(success)
			{
				// If we aren't sent back valid JSON this fails. We just ignore it if that happens.
				try
				{
					var data = Ext.util.JSON.decode(response.responseText);
				}
				catch(e)
				{
					// Meep.
					return;
				}
				processqueue(data);
			}
			else
			{
				AjaxLife.Widgets.Ext.msg(_("Network.Error"),_("Network.EventQueueFailure"));
			}
		}
		catch(e)
		{
			AjaxLife.Widgets.Ext.msg("Error in queuecallback",e.name+" - "+e.message);
		}
		requesting = false;
		// We have to do this in case we were disconnected while processing the above - e.g. if we received a
		// simulator crash message. It wouldn't hurt anything to do it again, but it would be a waste.
		if(AjaxLife.Network.Connected) requestqueue();
	}
	
	// (Re-)request the queue. This is called on initialisation and after
	// the message queue is received. A request is made to eventqueue.kat
	// with a 60-second timeout.
	function requestqueue() {
		// If the queue is already running, abort.
		if(requesting) return;
		requesting = true;
		link.request({
			url: "eventqueue.kat",
			method: "POST",
			params: {
				sid: gSessionID
			},
			callback: queuecallback
		});
	};	
	
	function checkstatus() {
		var now = new Date();
		// If the time difference (measured in milliseconds) is greater than 30 seconds...
		if(now.getTime() - lastmessage.getTime() > 35000)
		{
			AjaxLife.Widgets.Ext.msg("",_("Network.Reconnecting"));
			AjaxLife.Network.MessageQueue.shutdown();
			AjaxLife.Network.MessageQueue.init();
		}
	};
	
	return {
		// Public
		// Brings up the message queue. Called once the rest of the system is ready,
		// in order to prevent the loss of any messages.
		init: function() {
			//timer = setInterval(requestqueue,1000);
			// Set the time of last message.
			lastmessage = new Date();
			interval = setInterval(checkstatus,5000);
			AjaxLife.Network.Connected = true;
			requestqueue();
		},
		// Kills the queue.
		shutdown: function() {
			//clearInterval(timer);
			requesting = false;
			AjaxLife.Network.Connected = false;
			clearInterval(interval);
			link.abort();
		},
		// Very important function - registers a callback for incoming data.
		// This is accomplished by adding it to an array of callbacks.
		RegisterCallback: function(message, callback) {
			if(!callbacks[message]) {
				callbacks[message] = new Array();
			};
			var num = callbacks[message].length;
			callbacks[message][num] = callback;
			return num;
		},
		// Removes a callback based on the value returned by RegisterCallback.
		UnregisterCallback: function(message, callback) {
			if(callbacks[message] && callbacks[message][callback])
			{
				callbacks[message][callback] = false;
			}
		}
	};
}();

// This list should match the list in server/Html/SendMessage.cs.
// Extra messages are harmless. Missing messages will not work (unless the
// caller of Network.Send sets opts.signed to true.
AjaxLife.Network.SignedMessages = {
	AcceptFriendship: true,
	DeclineFriendship: true,
	OfferFriendship: true,
	TerminateFriendship: true, 
	SendAgentMoney: true,
	EmptyTrash: true,
	MoveItem: true,
	MoveFolder: true,
	MoveItems: true,
	MoveFolders: true,
	DeleteItem: true,
	DeleteFolder: true,
	DeleteMultiple: true,
	GiveInventory: true,
	UpdateItem: true,
	UpdateFolder: true,
	JoinGroup: true,
	LeaveGroup: true,
	ScriptPermissionResponse: true
};

// Sends a standard message through sendmessage.kat, if we're connected.
// Optionally, a callback can be specified, in which case it will be called
// once the server responds to the request.
AjaxLife.Network.Send = function(message, opts) {
	if(!AjaxLife.Network.Connected) return false;
	var link = new Ext.data.Connection({timeout: 60000});
	if(!opts)
	{
		opts = {};
	}
	opts.sid = gSessionID;
	opts.MessageType = message;
	var callbackf = false;
	if(opts.callback)
	{
		callbackf = opts.callback;
		delete opts.callback;
	}
	// Used to ensure that you can't impersonate someone by grabbing the SID -
	// at least for important messages.
	if(opts.signed || (AjaxLife.Network.SignedMessages[message] && opts.signed !== false))
	{
		if(opts.signed) delete opts.signed;
		var tohash = (++AjaxLife.SignedCallCount).toString() + Object.values(opts).sort().join('') + AjaxLife.Signature;
		var hash = md5(tohash);
		AjaxLife.Debug("Network: Signing '"+message+"' message with '"+hash+"' (from '"+tohash+"')");
		opts.hash = hash;
	}
	else if(opts.signed === false)
	{
		delete opts.signed;
	}
	params = {
		url: "sendmessage.kat",
		method: "POST",
		params: opts
	};
	if(callbackf || opts.hash)
	{
		params.callback = function(options, success, response) {
			if(success)
			{
				if(callbackf)
				{
					// If the exception is thrown by the first line we didn't have valid JSON.
					// Otherwise something's wrong with the callback.
					try
					{
						var data = Ext.util.JSON.decode(response.responseText);
						callbackf(data);
					}
					catch(e)
					{
						AjaxLife.Debug("Network: Response: "+response.responseText);
					}
				}
			}
			// No success. Either the server died or a timeout. Can't really tell.
			else
			{
				// If the send failed the server presumably didn't get the message, so knock this down one to make sure they still match.
				if(opts.hash)
				{
					--AjaxLife.SignedCallCount;
				}
				AjaxLife.Widgets.Ext.msg(_("Network.Error"),_("Network.GenericSendError"));
			}
		};
	}
	link.request(params);
};

AjaxLife.Network.GenericRequest = function(url, opts) {
	var link = new Ext.data.Connection();
	if(!opts)
	{
		opts = {};
	}
	var callbackf = false;
	if(opts.callback)
	{
		callbackf = opts.callback;
		opts.callback = null;
	}
	params = {
		url: "differentorigin.kat?url="+escape(url),
		method: "POST",
		params: opts
	};
	if(callbackf)
	{
		params.callback = function(options, success, response) {
			if(success)
			{
				try
				{
					var data = Ext.util.JSON.decode(response.responseText);
					callbackf(data);
				}
				catch(e)
				{
					callbackf(response.responseText);
				}
			}
			else
			{
				AjaxLife.Widgets.Ext.msg(_("Network.Error"),_("Network.GenericRequestError"));
			}
		};
	}
	link.request(params);
};