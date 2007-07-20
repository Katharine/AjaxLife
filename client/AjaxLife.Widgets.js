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

AjaxLife.Widgets.Slider = function(parent, id, opts) {
	if(!opts.width)
	{
		opts.width = 50;
	}
	var onChange = false;
	var slider = false;
	var div = $(document.createElement('div'));
	div.setAttribute('id',id);
	div.setStyle({
		height: '9px',
		width: opts.width+'px',
		backgroundColor: '#ccc'
	});
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
	slider = new Control.Slider(id+'-handle', id, opts);
	
	return {
		setvalue: function(value) {
			slider.setValue(value);
		}
	};
};

AjaxLife.Widgets.Ext = function(){
    var msgCt;
    
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', title, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('')}, true);
            m.slideIn('t').pause(3).ghost("t", {remove:true});
        }
    };
}();

AjaxLife.Widgets.Confirm = function(title, message, callback) {
	return Ext.Msg.show({
		title: title,
		closable: false,
		modal: true,
		msg: message,
		buttons: {
			yes: _("Widgets.Yes"),
			no: _("Widgets.No")
		},
		fn: callback
	});
};

AjaxLife.Widgets.SelectList = function(id,parent,settings) {

	var changeCallback = false;
	var sorted = false;
	if(settings)
	{
		if(settings.sort)
		{
			sorted = true;
		}
		if(settings.callback)
		{
			changeCallback = settings.callback;
		}
	}
	var div = Ext.get(document.createElement('div'));
	div.addClass('al-selectlist');
	div.setStyle({
		width: (settings.width?settings.width:'250px'),
		background: settings.background?settings.background:'#fff'
	});
	if(settings.height)
	{
		div.setStyle({
			'overflow-y': 'auto',
			'overflow-x': 'hidden',
			height: settings.height
		});
	}
	var list = Ext.get(document.createElement('ul'));
	var elems = {};
	list.dom.setAttribute('id',id);
	list.addClass('al-selectlist');
	div.dom.appendChild(list.dom);
	parent.appendChild(div.dom);
	
	function sortlist()
	{
		$(list.dom).getElementsBySelector('li').sortBy(function(n) {
			return n.innerHTML.toLowerCase();
		}).each(function(e) {
			list.dom.appendChild(e);
		});
	}
	
	return {
		// Public
		add: function(key, text) {
			if(elems[key]) return;
			var elem = Ext.get(document.createElement('li'));
			elem.on('mouseover',function() {
				elem.addClass('al-selectlist-selected');
			});
			elem.on('mouseout',function() {
				elem.removeClass('al-selectlist-selected');
			});
			elem.on('click', function() {
				if(changeCallback)
				{
					changeCallback(key);
				}
			});
			elem.dom.appendChild(document.createTextNode(text));
			list.dom.appendChild(elem.dom);
			elems[key] = elem;
		},
		remove: function(key) {
			if(elems[key])
			{
				if(elems[key].dom.parentNode)
				{
					elems[key].dom.parentNode.removeChild(elems[key].dom);
				}
				elems[key] = false;
			}
		},
		clear: function() {
			for(var i in elems)
			{
				this.remove(i);
			}
		},
		sort: function() {
			sortlist();
		},
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