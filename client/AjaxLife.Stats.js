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
 
 AjaxLife.Stats = function() {
 	// Private:
 	var win = false;
 	var fpsfield = false;
 	var tdfield = false;
 	var ipsfield = false;
 	var objectfield = false;
 	var scriptfield = false;
 	var agentfield = false;
 	var childagentfield = false;
 	var physmemusefield = false;
 	var pagememusefield = false;
 	var alsessionsfield = false;
 	var texturecountfield = false;
 	var texturesizefield = false;
 	var timer = false;
 	
 	// Polls the stats data.
 	//TODO: put this in the UsefulData message, but only when this window is open.
 	function fetchdata()
 	{
 		AjaxLife.Network.Send('GetStats', {callback: update});
 	}
 	
 	// Updates the information in the window using the provided data,
 	// then requests another set in five seconds, if the window's still open.
 	function update(data)
 	{
		fpsfield.update(Math.round(data.FPS));
		tdfield.update(Math.round(data.TimeDilation*100)/100);
		ipsfield.update(data.LSLIPS);
		objectfield.update(data.Objects);
		scriptfield.update(data.ActiveScripts);
		agentfield.update(data.Agents);
		childagentfield.update(data.ChildAgents);
		physmemusefield.update((Math.round(data.PhysicalMemoryUsage/1024/1024*10)/10)+"MB");
		pagememusefield.update((Math.round(data.PagedMemoryUsage/1024/1024*10)/10)+"MB");
		alsessionsfield.update(data.AjaxLifeSessions);
		texturecountfield.update(data.TextureCacheCount);
		texturesizefield.update((Math.round(data.TextureCacheSize/1024/1024*10)/10)+"MB");
		if(win.isVisible())
		{
			timer = setTimeout(function() {
				fetchdata();
			},5000);
		}
	}
 	return {
 		// Public:
 		init: function() { 	
 			// Builds a window containing a table with stats in it.	
 			win = new Ext.BasicDialog("dlg_stats", {
				width: '250px',
				height: '280px',
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("Stats.WindowTitle"),
				proxyDrag: !AjaxLife.Fancy
			});
			// Create table
			var table = $(document.createElement('table'));
			// "Region" section title.
			var row = $(document.createElement('tr'));
			row.addClassName('titlerow');
			table.appendChild(row);
			var el = document.createElement('th');
			el.setAttribute('colspan',2);
			el.appendChild(document.createTextNode(_("Stats.Region")));
			row.appendChild(el);
			// FPS
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.FPS")));
			row.appendChild(el);
			fpsfield = $(document.createElement('td'));
			fpsfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(fpsfield);
			// Time Dilation
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.TD")));
			row.appendChild(el);
			tdfield = $(document.createElement('td'));
			tdfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(tdfield);
			// Script IPS
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.ScriptIPS")));
			row.appendChild(el);
			ipsfield = $(document.createElement('td'));
			ipsfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(ipsfield);
			// Objects
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.Objects")));
			row.appendChild(el);
			objectfield = $(document.createElement('td'));
			objectfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(objectfield);
			// Active Scripts
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.Scripts")));
			row.appendChild(el);
			scriptfield = $(document.createElement('td'));
			scriptfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(scriptfield);
			// Agents
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.Agents")));
			row.appendChild(el);
			agentfield = $(document.createElement('td'));
			agentfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(agentfield);
			// Child Agents
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.ChildAgents")));
			row.appendChild(el);
			childagentfield = $(document.createElement('td'));
			childagentfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(childagentfield);
			// "AjaxLife Server" section title
			row = $(document.createElement('tr'));
			row.addClassName('titlerow');
			table.appendChild(row);
			el = document.createElement('th');
			el.setAttribute('colspan',2);
			el.appendChild(document.createTextNode(_("Stats.ALServer")));
			row.appendChild(el);
			// Memory Usage
			row = $(document.createElement('tr'));
			//table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode('Memory Usage'));
			row.appendChild(el);
			physmemusefield = $(document.createElement('td'));
			physmemusefield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(physmemusefield); // Broken.
			// Pagefile Usage
			row = $(document.createElement('tr'));
			//table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode('Pagefile Usage'));
			row.appendChild(el);
			pagememusefield = $(document.createElement('td'));
			pagememusefield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(pagememusefield); // Broken.
			// Sessions
			row = $(document.createElement('tr'));
			table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode(_("Stats.Sessions")));
			row.appendChild(el);
			alsessionsfield = $(document.createElement('td'));
			alsessionsfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(alsessionsfield);
			// Cached Textures
			row = $(document.createElement('tr'));
			//table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode('Cached Textures'));
			row.appendChild(el);
			texturecountfield = $(document.createElement('td'));
			texturecountfield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(texturecountfield);
			// Texture Cache Size
			row = $(document.createElement('tr'));
			//table.appendChild(row);
			el = document.createElement('th');
			el.appendChild(document.createTextNode('Texture Cache Size'));
			row.appendChild(el);
			texturesizefield = $(document.createElement('td'));
			texturesizefield.appendChild(document.createTextNode('Loading...'));
			row.appendChild(texturesizefield);
			win.body.dom.appendChild(table);
			win.on('show', function() {
				clearTimeout(timer);
				fetchdata();
			});
			
			fetchdata();
 		},
		open: function(opener) {
			if(opener)
			{
				win.show(opener);
			}
			else
			{
				win.show();
			}
		},
		close: function() {
			win.hide();
		},
		toggle: function(opener) {
			if(!win.isVisible())
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