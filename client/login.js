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

var submitexpected = false;
var SUPPORTED_LANGUAGES = {
	en: 'English',
	es: "Español",
	de: "Deutsch",
	fr: 'Français',
	pt_br: 'Portuguese (Brazil)',
	ja: '日本語',
	he: 'עברית'
};

// Restores the login screen to its standard state.
function revertscreen()
{
	$(document.body).setStyle({backgroundColor: 'black', color: 'white'});
	try
	{
		window.parent.document.getElementById('frameset').rows = '*,60';
		var node = window.parent.document.getElementById('loginpage');
		if(node && node.parentNode)
		{
			node.parentNode.insertBefore(node,window.parent.document.getElementById('loginform'));
		}
	}
	catch(e)
	{
		// Ignore it. We were probably missing a frameset.
		// IE likes choking here.
	}
}

function dolanguage()
{
	$('label_first').innerHTML = _("Login.First");
	$('label_last').innerHTML = _("Login.Last");
	$('label_pass').innerHTML = _("Login.Password");
	$('label_grid').innerHTML = _("Login.Grid");
	$('label_lang').innerHTML = _("Login.Language");
	$('btn_login').value  = _("Login.LogIn");
	Ext.MessageBox.buttonText = {
		yes: _("Widgets.Yes"),
		no: _("Widgets.No"),
		ok: _("Widgets.OK"),
		cancel: _("Widgets.Cancel")
	};
	if(_("Language.Direction") == "rtl" && !Prototype.Browser.IE) // IE can't do right-to-left properly.
	{
		$(document.getElementsByTagName('body')[0]).removeClassName("ltr");
		$(document.getElementsByTagName('body')[0]).addClassName("rtl");
	}
	else
	{
		$(document.getElementsByTagName('body')[0]).removeClassName("rtl");
		$(document.getElementsByTagName('body')[0]).addClassName("ltr");
	}
}

// If not in a frameset, go to the index page, unless we're expecting to be standalone.
if(!window.parent.document.getElementsByTagName('frameset').length && location.search != '?noframes=1')
{
	location.replace('index.html');
}

function initui()
{
	AjaxLife.Debug("login: Switching visible screen.");
	$('loginscreen').hide();
	$('uiscreen').show();
	var wait = Ext.Msg.wait(_("Login.LoadingSession"));
	var link = new Ext.data.Connection({timeout: 30000});
	link.request({
		url: "details.kat",
		method: "POST",
		params: {
			sid: gSessionID
		},
		callback: function(options, success, response) {
			response = response.responseText;
			AjaxLife.Debug("login: sessiondata: "+response);
			wait.hide();
			wait = false;
			if(!success)
			{
				Ext.Msg.alert(_("Login.SessionLoadFailed"));
				return;
			}
			var data = Ext.util.JSON.decode(response);
			gRegionCoords = data.RegionCoords;
			gRegion = data.Region;
			gPosition = data.Position;
			gMOTD = data.MOTD;
			gUserName = data.UserName;
			gAgentID = data.AgentID;
			gInventoryRoot = data.InventoryRoot;
			AjaxLife.Debug("login: Extracted session data.");
			gLanguageCode = $('lang').getValue();
			AjaxLife.Debug("login: Checking for login screen frame...");
			if(window.parent && window.parent.document && window.parent.document.getElementById)
			{
				var node = window.parent.document.getElementById('loginpage');
				if(node && node.parentNode)
				{
					AjaxLife.Debug('login: Removing login screen...');
					node.parentNode.removeChild(node);
				}
			}
			$(document.body).addClassName("loggedin");
			AjaxLife.Debug("login: Running AjaxLife init...");
			AjaxLife.Startup();
		}
	});
}

// This function deals with logging in.
function handlelogin()
{
	$('first').disable();
	$('last').disable();
	$('password').disable();
	$('btn_login').disable();
	// If we have a parent, set this frame to be the whole screen.
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
		var hanging = Ext.Msg.wait(_("Login.Encrypting"));
		var logindetails = Encrypt();
		AjaxLife.Debug("login: Encrypted login: "+logindetails);
		hanging.updateText(_("Login.LoggingIn"));
		// Send the request and wait up to two minutes for a response.
		// Pass on all data, and wait for the response.
		var link = new Ext.data.Connection({timeout: 120000});
		link.request({
			url: "connect.kat",
			method: "POST",
			params: {
				logindata: logindetails,
				grid: $('grid').getValue(),
				session: gSessionID
			},
			// If the request was successful, submit the form containing the sessionid to the UI page.
			// Otherwise show the error.
			callback: function(options, success, response) {
				AjaxLife.Debug("login: Received login response: "+response.responseText);
				hanging.hide();
				hanging = false;
				if(success)
				{
					try
					{
						var response = Ext.util.JSON.decode(response.responseText);
						if(response.success)
						{
							initui();
						}
						else
						{
							AjaxLife.Debug("login: Login failure: "+response.message);
							Ext.Msg.alert(_("Login.Error"),response.message.escapeHTML(),revertscreen);
						}
					}
					catch(e)
					{
						Ext.Msg.alert("Server Error","A C# Exception was caught:<pre>"+response.responseText.escapeHTML()+"</pre>",revertscreen);
					}
				}
				else
				{
					Ext.Msg.alert(_("Login.Error"),_("Login.SomethingWrong"),revertscreen);
				}
				$('first').enable();
				$('last').enable();
				$('password').enable();
				$('btn_login').enable();
			}
		});
		AjaxLife.Debug("login: Made login request.");
	}, 100);
}

function base64encode(str) {

	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	var out, i, len;
	var c1, c2, c3;

	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
	c1 = str.charCodeAt(i++) & 0xff;
	if(i == len)
	{
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt((c1 & 0x3) << 4);
		out += "==";
		break;
	}
	c2 = str.charCodeAt(i++);
	if(i == len)
	{
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt((c2 & 0xF) << 2);
		out += "=";
		break;
	}
	c3 = str.charCodeAt(i++);
	out += base64EncodeChars.charAt(c1 >> 2);
	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
	out += base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}

function Encrypt()
{
	setMaxDigits(131);
	key = new RSAKeyPair(RSA_EXPONENT, "", RSA_MODULUS);
	encrypted = encryptedString(key, CHALLENGE + "\\" 
				+ base64encode(Ext.get('first').dom.value) + "\\" 
				+ base64encode(Ext.get('last').dom.value) + "\\"
				+ base64encode('$1$'+md5(Ext.get('password').dom.value)));
	return encrypted;
}

// When we're ready, set up the login handler and disable the default login action.
// Place the cursor in the First Name box.
Ext.onReady(function() {
	// Login button handler
	Ext.get('btn_login').on('click',handlelogin);
	
	var ret = function(event) {
		if(event.keyCode == 13 || event.which == 13)
		{
			handlelogin();
		}
	};
	
	// Handle hitting return.
	Ext.get('first').addListener('keyup', ret);
	Ext.get('last').addListener('keyup', ret);
	Ext.get('password').addListener('keyup', ret);

	// Handle form submission.
	$('form_login').onsubmit = function(e) {
		if (e && e.preventDefault) e.preventDefault();
		else if (window.event && window.event.returnValue)
		window.eventReturnValue = false;
		handlelogin();
		return false;
	};
	
	if($('lang')) // Don't do any of this if #lang doesn't exist.
	{
		var options = [];
		var lang = navigator.language?navigator.language:navigator.browserLanguage;
		try
		{
			if(!lang || !lang.gsub)
			{
				lang = 'en';
			}
			else
			{
				lang = lang.gsub('-','_');
			}
			if(!SUPPORTED_LANGUAGES[lang])
			{
				if(!SUPPORTED_LANGUAGES[lang.substr(0,2)])
				{
					lang = 'en';
				}
				else
				{
					lang = lang.substr(0,2);
				}
			}
		}
		catch(e)
		{
			lang = 'en';
		}
		$('lang').childElements().invoke('remove'); // Remove anything currently in it.
		for(var i in SUPPORTED_LANGUAGES)
		{
			var opt = document.createElement('option');
			opt.appendChild(document.createTextNode(SUPPORTED_LANGUAGES[i]));
			opt.value = i;
			if(i == lang)
			{
				opt.selected = 'selected'; // Select it if it's our language.
			}
			$('lang').appendChild(opt);
		}
		gLanguageCode = $('lang').getValue();
		$('lang').onchange = function() {
			gLanguageCode = $('lang').getValue();
			dolanguage();
		}
		dolanguage();
	}
	$('first').activate();
});