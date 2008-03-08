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
	var keys = new Object();
	var pending = new Array();
	
	// Adds a key to the cache. Calls any callbacks that were waiting for it.
	function add (id, name)
	{
		if(!keys[id])
		{
			keys[id] = name;
			if(pending[id])
			{
				pending[id].each(function(item) {
					item(name);
				});
			}
			pending[id] = false;
		}
	};
	
	return {
		// Look up a key. Calls callbackf immediately if we already know it,
		// otherwise stores it away until we find it, then sends a NameLookup request.
		Find: function(id, callbackf) {
			if(keys[id])
			{
				callbackf(keys[id]);
			}
			else
			{
				AjaxLife.Debug("NameCache: Looking up "+id);
				if(!pending[id])
				{
					pending[id] = new Array();
				}
				pending[id][pending[id].length] = callbackf;
				AjaxLife.Network.Send("NameLookup", {
					ID: id
				});
			}
		},
		// Manually add a new keypair.
		Add: function(id, name) {
			add(id, name);
		},
		// Intialisation - sets up listener for keypair lookup responses.
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('AvatarNames', function(data) {
				for(var key in data.Names)
				{
					AjaxLife.Debug("NameCache: Received key/name pair "+key+" => "+data.Names[key]);
					// Add it to the dictionary and run any required callbacks.
					add(key,data.Names[key]);
				}
			});
		}
	};
}();