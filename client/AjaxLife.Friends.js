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
	
	function statuschange(agentid, online)	{
		if(friends[agentid] !== online)
		{
			AjaxLife.NameCache.Find(agentid,function(name) {
				AjaxLife.Widgets.Ext.msg("",_("Friends.OnlineNotification",{name: name, status: (online?_("Friends.Online"):_("Friends.Offline"))}));
				onchangecallbacks.each(function(callback) {
					callback(agentid, name, online);
				});
			});
			friends[agentid] = online;
		}
	}
	
	return {
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('FriendNotification', function(data) {
				statuschange(data.AgentID, data.Online);
			});
		},
		StatusChange: function(agentid, online)	{
			statuschange(agentid,online);
		},
		GetFriends: function() {
			return friends;
		},
		AddCallback: function(callback) {
			onchangecallbacks[onchangecallbacks.length] = callback;
		}
	};
}();