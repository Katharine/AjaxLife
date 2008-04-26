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

// Key2name
AjaxLife.NameCache = function () {
	var namekeys = {};
	var groupkeys = {};
	var pending_names = [];
	var pending_groups = [];
	
	// Adds a key to the cache. Calls any callbacks that were waiting for it.
	function addname(id, name)
	{
		if(!namekeys[id])
		{
			namekeys[id] = name;
			if(pending_names[id])
			{
				pending_names[id].each(function(item) {
					item(name);
				});
			}
			pending_names[id] = false;
		}
	};
	
	
	function addgroup(id, name)
	{
		if(!groupkeys[id])
		{
			groupkeys[id] = name;
			if(pending_groups[id])
			{
				pending_groups[id].each(function(item) {
					item(name);
				});
			}
		}
	}
	
	function dolookup(needle, haystack, pending, callback, message)
	{
		if(haystack[needle])
		{
			callback(haystack[needle]);
		}
		else
		{
			AjaxLife.Debug("NameCache: Performing "+message+" lookup for "+needle);
			if(!pending[needle])
			{
				pending[needle] = [];
			}
			pending[needle][pending[needle].length] = callback;
			AjaxLife.Network.Send(message, {
				ID: needle
			});
		}
	}
	
	return {
		// Look up a key. Calls callbackf immediately if we already know it,
		// otherwise stores it away until we find it, then sends a NameLookup request.
		Find: function(id, callbackf) {
			dolookup(id, namekeys, pending_names, callbackf, "NameLookup");
		},
		FindGroup: function(id, callbackf) {
			dolookup(id, groupkeys, pending_groups, callbackf, "RequestGroupName");
		},
		// Manually add a new keypair.
		Add: function(id, name) {
			addname(id, name);
		},
		AddGroup: function(id, name) {
			addgroup(id, name);
		},
		// Intialisation - sets up listener for keypair lookup responses.
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('AvatarNames', function(data) {
				for(var key in data.Names)
				{
					AjaxLife.Debug("NameCache: Received key/name pair "+key+" => "+data.Names[key]);
					// Add it to the dictionary and run any required callbacks.
					addname(key,data.Names[key]);
				}
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('GroupNames', function(data) {
				for(var key in data.Names)
				{
					AjaxLife.Debug("NameCache: Received key/group name pair "+key+" => "+data.Names[key]);
					addgroup(key,data.Names[key]);
				}
			});
		}
	};
}();