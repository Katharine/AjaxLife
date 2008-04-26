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

AjaxLife.Search = function() {
	// Private.
	var search_win = false;
	var search_box = false;
	var results_list = false;
	
	// Called after the user stops typing in the search box.
	// We just send a FindPeople message with the search string.
	function performlookup()
	{
		AjaxLife.Debug("Search: Searching for "+search+" in people.");
		results_list.clear();
		var search = search_box.dom.value;
		AjaxLife.Network.Send("FindPeople", {
			Search: search,
			Start: 0
		});
	}
	
	return {
		// Public
		init: function() {
			// Creates the search window.
			search_win = new Ext.BasicDialog("dlg_search", {
				width: '300px',
				height: '400px',
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("Search.WindowTitle"),
				proxyDrag: !AjaxLife.Fancy
			});
			// Build the UI
			people_tab = search_win.getTabs().addTab("search-people-tab",_("Search.People"));
			people_tab.activate();
			var div_people_search = Ext.get(document.createElement('div'));
			div_people_search.dom.setAttribute('id','search_div_people_search');
			search_box = Ext.get(document.createElement('input'));
			search_box.setStyle({width: '98%'});
			search_box.dom.setAttribute('id','search_box_seach');
			search_box.dom.setAttribute('type','text');
			div_people_search.dom.appendChild(search_box.dom);
			people_tab.bodyEl.dom.appendChild(div_people_search.dom);
			var delay = new Ext.util.DelayedTask(performlookup);
			// Set the performlookup task to happen 0.75 seconds after the key is pressed.
			// This is reset every time a key is pressed, thus waiting until the user
			// stops typing to begin.
			search_box.on('keydown', function() {
				delay.delay(750);
			});
			// Create the search box, and set a click callback to just open the profile.
			results_list = new AjaxLife.Widgets.SelectList('search_list_results', people_tab.bodyEl.dom, {
				width: '99%',
				callback: function(key) {
					new AjaxLife.Profile(key);
				}
			});
			// Register for the DirPeopleReply message that carries the information we want.
			// Add their name and key to the list.
			AjaxLife.Network.MessageQueue.RegisterCallback('DirPeopleReply', function(data) {
				AjaxLife.Debug("Search: Received search results.");
				data.Results.each(function(item) {
					AjaxLife.NameCache.Add(item.AgentID,item.FirstName+" "+item.LastName);
					results_list.add(item.AgentID,item.FirstName+" "+item.LastName);
				});
				results_list.sort();
			});
		},
		open: function(opener) {
			if(opener)
			{
				search_win.show(opener);
			}
			else
			{
				search_win.show();
			}
		},
		close: function() {
			search_win.hide();
		},
		toggle: function(opener) {
			if(!search_win.isVisible())
			{
				this.open(opener);
			}
			else
			{
				this.close();
			}
		}
	};
}();