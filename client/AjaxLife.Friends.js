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

AjaxLife.Friends = function() {
	var friends = {};
	var onchangecallbacks = [];
	var onnewcallbacks = [];
	
	// Called when a friend's status changes - expects the standard friend object.
	function statuschange(friend)	{
		// Check if anything's actually changed.
		if(!friends[friend.ID] || friends[friend.ID].Online !== friend.Online)
		{
			if(friend.Name == '' && friends[friend.ID] && friends[friend.ID].Name != '')
			{
				friend.Name = friends[friend.ID].Name;
			}
			// More anti-null code.
			AjaxLife.NameCache.Find(friend.ID, function(name) {
				friend.Name = name;
				// If the friend was already known..
				if(friends[friend.ID])
				{
					// Notification + run any applicable callbacks.
					AjaxLife.Widgets.Ext.msg("",_("Friends.OnlineNotification",{name: friend.Name, status: (friend.Online?_("Friends.Online"):_("Friends.Offline"))}), "onoff");
					onchangecallbacks.each(function(callback) {
						callback(friend);
					});
				}
				else
				{
					// Friend wasn't known - probably login spam from the server. Handle it as a new friend.
					added(friend);
				}
				// Update information.
				friends[friend.ID] = friend;
			});
		}
	}
	
	// Call callbacks when a friend is added.
	function added(friend)
	{
		onnewcallbacks.each(function (callback) {
			callback(friend);
		});
	}
	
	function loadlist()
	{
		AjaxLife.Debug("Friends: Requesting friend list.");
		AjaxLife.Network.Send("GetFriendList",{
			callback: function(data) {
				if(data.each)
				{
					AjaxLife.Debug("Friends: Received friend list.");
					data.each(function(friend) {
						if(friend && friend.Name != '')
						{
							AjaxLife.NameCache.Add(friend.ID, friend.Name);
						}
						else
						{
							AjaxLife.Debug("Got friend "+friend.ID+" with null name.");
						}
						AjaxLife.NameCache.Find(friend.ID, function(name) {
							friend.Name = name;
							if(!friends[friend.ID])
							{
								added(friend);
							}
							friends[friend.ID] = friend;
						});
					});
				}
				else
				{
					alert(data);
				}
			}
		});
	}
	
	return {
		// Init function. Register for network events.
		init: function() {
			// Friend login/logoff
			AjaxLife.Network.MessageQueue.RegisterCallback('FriendOnOffline', function(data) {
				statuschange(data);
			});
			
			// Show a dialog to accept or decline friendship, and send back the response. Show confirmation too.
			AjaxLife.Network.MessageQueue.RegisterCallback('FriendshipOffered', function(data) {
				Ext.Msg.confirm("",_("Friends.FriendshipOffered",{name: data.AgentName}), function(btn) {
					if(btn == 'yes')
					{
						AjaxLife.Network.Send('AcceptFriendship',{IMSessionID: data.IMSessionID});
						AjaxLife.Widgets.Ext.msg("",_("Friends.YouAccept", {name: data.AgentName}));
						AjaxLife.SpatialChat.systemmessage(_("Friends.YouAccept", {name: data.AgentName}));
					}
					else
					{
						AjaxLife.Network.Send('DeclineFriendship',{IMSessionID: data.IMSessionID});
						AjaxLife.Widgets.Ext.msg("",_("Friends.YouDecline", {name: data.AgentName}));
						AjaxLife.SpatialChat.systemmessage(_("Friends.YouDecline", {name: data.AgentName}));
					}
				});
			});
			
			// Loads and displays the friendlist.
			loadlist();
		},
		// Used to force a status change
		StatusChange: function(agentid, online)	{
			if(friends[agentid])
			{
				var friend = AjaxLife.Utils.Clone(friends[agentid]);
				friend.Online = online;
				statuschange(friend);
			}
			else
			{
				AjaxLife.Debug("Failed AjaxLife.Friends.StatusChange operation while setting "+agentid+" to "+(online?"online":"offline"));
			}
		},
		// Get friend list
		GetFriends: function() {
			return friends;
		},
		// Returns true if someone is your friend
		IsFriend: function(agent) {
			return !!friends[agent];
		},
		// Register for logon/logoff callback
		AddStatusCallback: function(callback) {
			AjaxLife.Debug("Friends: Registered status callback.");
			onchangecallbacks[onchangecallbacks.length] = callback;
		},
		// Register for friend added callback.
		AddNewFriendCallback: function(callback) {
			AjaxLife.Debug("Friends: Registered new friend callback.");
			onnewcallbacks[onnewcallbacks.length] = callback;
		},
		ReloadFriendList: function() {
			loadlist();
		},
		OfferFriendship: function(agentid) {
			AjaxLife.Network.Send("OfferFriendship", {Target: agentid});
		},
		TerminateFriendship: function(agentid) {
			AjaxLife.Network.Send("TerminateFriendship", {Target: agentid});
		},
		GrantRights: function(agentid, rights) {
			AjaxLife.Network.Send("ChangeRights", {Friend: agentid, Rights: rights});
		}
	};
}();