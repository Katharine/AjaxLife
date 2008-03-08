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

// This class implements a slider with callbacks for being changed.
AjaxLife.Widgets.Slider = function(parent, id, opts) {
	// Default width = 50
	if(!opts.width)
	{
		opts.width = 50;
	}
	var onChange = false;
	var slider = false;
	// Creates the slider
	var div = $(document.createElement('div'));
	div.setAttribute('id',id);
	div.setStyle({
		height: '9px',
		width: opts.width+'px',
		backgroundColor: '#ccc'
	});
	// Creates the handle
	var handlediv = $(document.createElement('div'));
	handlediv.setAttribute('id',id+'-handle');
	//handlediv.setAttribute('style','-moz-border-radius: 5px; -webkit-border-radius: 5px;');
	handlediv.setStyle({
		width: '19px',
		height: '1px',
		borderTop: '7px',
		borderBottom: '7px',
		borderLeft: '5px',
		borderRight: '5px',
		'float': 'left',
		borderWidth: '1px'
	});
	var img = $(document.createElement('img'));
	img.setAttribute('id',id+'-image');
	img.setAttribute('src',AjaxLife.STATIC_ROOT+'resources/script.aculo.us/slider-images-handle.png');
	img.setStyle({'float': 'left'});
	handlediv.appendChild(img);
	div.appendChild(handlediv);
	$(parent).appendChild(div);
	// Creates a script.aculo.us slider object.
	slider = new Control.Slider(id+'-handle', id, opts);
	// Slider control - public functions
	return {
		setvalue: function(value) {
			slider.setValue(value);
		}
	};
};

// Displays a message at the top for three seconds.
// A div is created, inserted, then faded upwards and destoyed three seconds later.
AjaxLife.Widgets.Ext = function(){
    var msgCt;
    // Can we do growling using Fluid (http://fluidapp.com)?
    var cangrowl = !!(window.fluid && fluid.showGrowlNotification);
    AjaxLife.Debug("Widgets: CanGrowl: "+cangrowl);
    return {
        msg: function(title, s, growlid, onlygrowl) {
        	// If we can, and the notification allows us to, do so.
        	if(growlid && cangrowl)
        	{
				var options = {
					message: s,
					priority: 1,
					sticky: false,
					identifier: growlid
				};
				if(title != '')
				{
					options.title = title;
				}
				fluid.showGrowlNotification(options);
			}
			// If the notification doesn't want to be shown internally, don't.
        	if(!onlygrowl)
        	{
				if(!msgCt){
					msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
				}
				msgCt.alignTo(document, 't-t');
				var m = Ext.DomHelper.append(msgCt, {html:['<div class="msg">',
					'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
					'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', title, '</h3>', s, '</div></div></div>',
					'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
					'</div>'].join('')}, true);
				m.slideIn('t').pause(3).ghost("t", {remove:true});
			}
        }
    };
}();

// Shows a localised confirm dialog.
// DEPRECATED in favour of Ext.Msg.confirm (which takes the same arguments)
AjaxLife.Widgets.Confirm = function(title, message, callback) {
	return Ext.Msg.confirm(title, message, callback);
};

// This implements a select list with single-click, double-click callbacks,
// highlighting of elements with the mouse over, etc.
AjaxLife.Widgets.SelectList = function(id,parent,settings) {
	var clickCallback = false;
	var changeCallback = false;
	var sorted = false;
	var doubleclick = false;
	// Set some settings.
	if(settings)
	{
		if(settings.sort)
		{
			sorted = true;
		}
		if(settings.callback)
		{
			clickCallback = settings.callback;
		}
		if(settings.onchange)
		{
			changeCallback = settings.onchange;
		}
		if(settings.selectable || settings.doubleclick)
		{
			doubleclick = true;
		}
	}
	// Create a div with list.
	var div = Ext.get(document.createElement('div'));
	div.addClass('al-selectlist');
	var style = {
		width: (settings.width?settings.width:'250px')
	};
	if(settings.background)
	{
		style.background = settings.background;
	}
	if(settings.height)
	{
		style['overflow-y'] = 'auto';
		style['overflow-x'] = 'hidden';
		style.height = settings.height;
	}
	div.setStyle(style);
	var list = Ext.get(document.createElement('ul'));
	var elems = {};
	var highlighted = false;
	list.dom.setAttribute('id',id);
	list.addClass('al-selectlist');
	div.dom.appendChild(list.dom);
	parent.appendChild(div.dom);
	
	// Sorts the list by displayed value in a case-insensitive manner
	function sortlist()
	{
		$(list.dom).getElementsBySelector('li').sortBy(function(n) {
			return n.innerHTML.toLowerCase();
		}).each(function(e) {
			list.dom.appendChild(e);
		});
	}
	
	// Highlights the specified list item, unhighlighting the previous one (if any)
	function highlight(key)
	{
		if(!elems[key]) return;
		if(highlighted && elems[highlighted] && typeof elems[highlighted].removeClass == 'function')
		{
			elems[highlighted].removeClass('al-selectlist-highlighted');
		}
		highlighted = key;
		elems[key].addClass('al-selectlist-highlighted');
		if(changeCallback)
		{
			changeCallback(key);
		}
	}
	
	return {
		// Public
		// Adds a new item and sets up the standard callbacks.
		add: function(key, text) {
			// Cancel if we already have this key.
			if(elems[key]) return;
			// Creates the list entry
			var elem = Ext.get(document.createElement('li'));
			// Adds the selected class on hover
			elem.on('mouseover',function() {
				elem.addClass('al-selectlist-selected');
			});
			// Removes the class on mouseout.
			elem.on('mouseout',function() {
				elem.removeClass('al-selectlist-selected');
			});
			// Highlights the element if double click is enabled.
			// If it's not, or it's already highlighted, calls the callback.
			elem.on('click', function() {
				if(!doubleclick ||  highlighted == key)
				{
					if(clickCallback)
					{
						clickCallback(key);
					}
				}
				else
				{
					highlight(key);
				}
			});
			// Adds the element to the list.
			elem.dom.appendChild(document.createTextNode(text));
			list.dom.appendChild(elem.dom);
			elems[key] = elem;
		},
		// Removes an element from the list, if it exists.
		remove: function(key) {
			if(elems[key])
			{
				if(highlighted == key)
				{
					highlighted = false;
				}
				if(elems[key].dom.parentNode)
				{
					elems[key].dom.parentNode.removeChild(elems[key].dom);
				}
				elems[key] = false;
			}
		},
		// Wipes the list by looping through it and removing items.
		clear: function() {
			highlighted = false;
			for(var i in elems)
			{
				this.remove(i);
			}
		},
		// Sort the list.
		sort: function() {
			sortlist();
		},
		// Gets the keys in the list.
		getkeys: function() {
			var keys = [];
			for(var i in elems)
			{
				keys[keys.length] = i;
			}
			return keys;
		}
	};
};