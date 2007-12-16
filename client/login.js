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

// Restores the login screen to its standard state.
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

// If not in a frameset, go to the index page
if(!window.parent.document.getElementsByTagName('frameset').length)
{
	location.replace('index.html');
}

// This function deals with logging in.
function handlelogin()
{
	// If we have a parent (we should), set this frame to be the whole screen.
	if(window.parent && window.parent.document && window.parent.document.getElementById)
	{
		var node = window.parent.document.getElementById('loginpage');
		if(node && node.parentNode)
		{
			node.parentNode.appendChild(node);
			window.parent.document.getElementById('frameset').rows = '*,0';
		}
	}
	// Change the background, in order to make the progress look right.
	$(document.body).setStyle({backgroundColor: 'white', color: 'black'});
	// We do this to avoid an odd bug. Eh.
	setTimeout(function() {
		// Make a fuss if this isn't an LL grid
		if(!$('grid').getValue().endsWith('(Linden Lab)'))
		{
			if(!confirm("You are about to send data to a login server that is NOT owned by Linden Lab.\n"+
				"The login info will be passed on UNENCRYPTED.\n\n"+
				"DO NOT USE your Second Life account to log into this grid.\n"+
				"If you are using an account specifically for "+$('grid').getValue()+", it is safe to proceed.\n"+
				"Do you wish to continue?"))
			{
				revertscreen();
				return false;
			}
			
		}
		// Put up a nice waiting dialog.
		var hanging = Ext.Msg.wait("Connecting to Second Life...");
		// Send the request and wait up to two minutes for a response.
		// Pass on all data, and wait for the response.
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
			// If the request was successful, submit the form containing the sessionid to the UI page.
			// Otherwise show the error.
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

// When we're ready, set up the login handler and disable the default login action.
// Place the cursor in the First Name box.
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