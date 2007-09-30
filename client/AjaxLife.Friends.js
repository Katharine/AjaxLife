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

AjaxLife.Friends = function() {
	var friends = {};
	var onchangecallbacks = [];
	var onnewcallbacks = [];
	
	function statuschange(friend)	{
		if(!friends[friend.ID] || friends[friend.ID].Online !== friend.Online)
		{
			if(friends[friend.ID])
			{
				AjaxLife.Widgets.Ext.msg("",_("Friends.OnlineNotification",{name: friend.Name, status: (friend.Online?_("Friends.Online"):_("Friends.Offline"))}));
				onchangecallbacks.each(function(callback) {
					callback(friend);
				});
			}
			else
			{
				added(friend);
			}
			friends[friend.ID] = friend;
		}
	}
	
	function added(friend)
	{
		onnewcallbacks.each(function (callback) {
			callback(friend);
		});
	}
	
	return {
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('FriendOnOffline', function(data) {
				statuschange(data);
			});
			
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
	
			AjaxLife.Network.Send("GetFriendList",{
				callback: function(data) {
					if(data.each)
					{
						data.each(function(friend) {
							if(typeof friend.Name != 'string' || friend.Name == '' || friend.Name == 'null')
							{
								if(friend.ID != AjaxLife.Utils.UUID.Zero)
								{
									AjaxLife.NameCache.Find(friend.ID, function(name) {
										friend.Name = name;
										if(!friends[friend.ID])
										{
											added(friend);
										}
										friends[friend.ID] = friend;
									});
								}
							}
							else
							{
								if(!friends[friend.ID])
								{
									added(friend);
								}
								friends[friend.ID] = friend;
								AjaxLife.NameCache.Add(friend.ID, friend.Name);
							}
						});
					}
					else
					{
						alert(data);
					}
				}
			});
		},
		StatusChange: function(agentid, online)	{
			if(friends[agentid])
			{
				var friend = AjaxLife.Utils.Clone(friends[agentid]);
				friend.Online = online;
				statuschange(friend);
			}
			else
			{
				alert("Failed AjaxLife.Friends.StatusChange operation while setting "+agentid+" to "+(online?"online":"offline"));
			}
		},
		GetFriends: function() {
			return friends;
		},
		IsFriend: function(agent) {
			return !!friends[agent];
		},
		AddStatusCallback: function(callback) {
			onchangecallbacks[onchangecallbacks.length] = callback;
		},
		AddNewFriendCallback: function(callback) {
			onnewcallbacks[onnewcallbacks.length] = callback;
		}
	};
}();