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

// The application lives in this object. It is the only global variable.
// Well, mostly. There is also the _ function, and some globals set by the server.
if(!window.AjaxLife)
{
	window.AjaxLife = {};
}
// Stick up a loading notice.
AjaxLife.PageWait = Ext.Msg.wait("Loading subsystems. Please wait...","AjaxLife");

// Sigh. IE is too slow for a lot of this stuff.
// Opera is fast, but Wii is slow. Opera on Wii is therefore slow,
// so we disable it there too by checking for the wiiremote API.
// Should consider making this more thorough.
AjaxLife.Fancy = !Prototype.Browser.IE && !(window.opera && window.opera.wiiremote);

// A couple of namespaces.
AjaxLife.Widgets = {};
AjaxLife.Network = {};
AjaxLife.Utils = {};
AjaxLife.Strings = {};

AjaxLife.init = function()
{
	Ext.BLANK_IMAGE_URL = AjaxLife.STATIC_ROOT+"images/s.gif";
	Ext.MessageBox.buttonText = {
		yes: _("Widgets.Yes"),
		no: _("Widgets.No"),
		ok: _("Widgets.OK"),
		cancel: _("Widgets.Cancel")
	};
	AjaxLife.InstantMessage.init();
	AjaxLife.SpatialChat.init();
	AjaxLife.Toolbar.init('toolbar');
	AjaxLife.StatusBar.init();
	AjaxLife.NameCache.init();
	AjaxLife.Friends.init();
	AjaxLife.Search.init();
	AjaxLife.AvatarsNear.init();
	AjaxLife.Inventory.init();
	AjaxLife.Stats.init();
	AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function() {}); // Dummy to suppress messages from de-ruthing.
	AjaxLife.PageWait.updateText(_("AjaxLife.Precaching"));
	setTimeout(function () {
		AjaxLife.Map.init();
		AjaxLife.PageWait.hide();
		AjaxLife.PageWait = false;
		AjaxLife.Network.init();
		Ext.Msg.alert(_("AjaxLife.MOTD"),gMOTD);
		AjaxLife.Network.Send("GetOfflineMessages",{});
	}, 3000);
}

// Init stuff.
Event.observe(window,'load',AjaxLife.init);
window.onbeforeunload = function() {
	if(AjaxLife.Network.Connected)
	{
		return "Leaving this page now is not recommended.\nIf you're sure you want to leave, you should first use the Logout button below.";
	}
};
