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

var submitexpected = false;

function revertscreen()
{
	$(document.body).setStyle({backgroundColor: 'black', color: 'white'});
	if(window.parent && window.parent.document)
	{
		window.parent.document.getElementById('frameset').rows = '*,60';
		var node = window.parent.document.getElementById('loginpage');
		if(node && node.parentNode)
		{
			node.parentNode.insertBefore(node,window.parent.document.getElementById('loginform'));
		}
	}
}

if(!window.parent.document.getElementsByTagName('frameset').length)
{
	location.replace('index.html');
}

function handlelogin()
{
	if(window.parent && window.parent.document && window.parent.document.getElementById)
	{
		var node = window.parent.document.getElementById('loginpage');
		if(node && node.parentNode)
		{
			node.parentNode.appendChild(node);
			window.parent.document.getElementById('frameset').rows = '*,0';
		}
	}
	$(document.body).setStyle({backgroundColor: 'white', color: 'black'});
	setTimeout(function() {
		var hanging = Ext.Msg.wait("Connecting to Second Life...");
		var link = new Ext.data.Connection({timeout: 120000});
		link.request({
			url: "connect.kat",
			method: "POST",
			params: {
				first: Ext.get('first').dom.value,
				last: Ext.get('last').dom.value,
				password: Ext.get('password').dom.value,
				grid: $('grid').getValue(),
				session: gSessionID
			},
			callback: function(options, success, response) {
				hanging.hide();
				hanging = false;
				if(success)
				{
					try
					{
						var response = Ext.util.JSON.decode(response.responseText);
						if(response.success)
						{
							submitexpected = true;
							$('continue').submit();
							submitexpected = false;
						}
						else
						{
							Ext.Msg.alert("Error",response.message.escapeHTML(),revertscreen);
						}
					}
					catch(e)
					{
						Ext.Msg.alert("Server Error","A C# Exception was caught:<pre>"+response.responseText.escapeHTML()+"</pre>",revertscreen);
					}
				}
				else
				{
					Ext.Msg.alert("Error","Despite our best efforts, something has gone wrong.<br /><br />Blah blah blah. Please try again later.",revertscreen);
				}
			}
		});
	}, 100);
}

Ext.onReady(function() {
	Ext.get('btn_login').on('click',handlelogin);
	$('continue').onsubmit = function(e) {
		if(!submitexpected)
		{
			if (e && e.preventDefault) e.preventDefault();
			else if (window.event && window.event.returnValue)
			window.eventReturnValue = false;
			handlelogin();
			return false;
		}
		return true;
	};
	$('first').activate();
});