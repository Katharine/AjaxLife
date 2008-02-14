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

// This is in here to ensure we can use it immediately.
AjaxLife.Debug = function(message)
{
	if(window.console && window.console.log)
	{
		console.log(message);
	}
}

AjaxLife.Debug("AjaxLife.js init running.");

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

// Called as soon as the page loads - meaning all the scripts are ready.
AjaxLife.init = function()
{
	AjaxLife.Debug("Init starting");
	// Fix the blank images.
	Ext.BLANK_IMAGE_URL = AjaxLife.STATIC_ROOT+"images/s.gif";
	// Set the button labels - this is important for the localisation.
	Ext.MessageBox.buttonText = {
		yes: _("Widgets.Yes"),
		no: _("Widgets.No"),
		ok: _("Widgets.OK"),
		cancel: _("Widgets.Cancel")
	};
	// We're connected. Actually, we aren't, but this is close enough and things break if we leave it too long.
	AjaxLife.Network.Connected = true;
	// Start everything up.
	AjaxLife.Debug("InstantMessage init...");
	AjaxLife.InstantMessage.init();
	AjaxLife.Debug("SpatialChat init...");
	AjaxLife.SpatialChat.init();
	AjaxLife.Debug("Toolbar init....");
	AjaxLife.Toolbar.init('toolbar');
	AjaxLife.Debug("StatusBar init....");
	AjaxLife.StatusBar.init();
	AjaxLife.Debug("NameCache init...");
	AjaxLife.NameCache.init();
	AjaxLife.Debug("Friends init...");
	AjaxLife.Friends.init();
	AjaxLife.Debug("Search init...");
	AjaxLife.Search.init();
	AjaxLife.Debug("AvatarsNear init...");
	AjaxLife.AvatarsNear.init();
	AjaxLife.Debug("Inventory init...");
	AjaxLife.Inventory.init();
	AjaxLife.Debug("Stats init...");
	AjaxLife.Stats.init();
	AjaxLife.Debug("ScriptDialogs init...");
	AjaxLife.ScriptDialogs.init();
	// Dummy to suppress messages from de-ruthing.
	// These messages also apparently count as a "received asset"
	//TODO: Investigate the feasibility of a system for using this information to throw together a rendering of your avatar.
	// This is fairly low down on the todo list.
	AjaxLife.Debug("Registering dummy AssetReceived handler...");
	AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', Prototype.emptyFunction);
	AjaxLife.PageWait.updateText(_("AjaxLife.Precaching"));
	AjaxLife.Debug("Precaching...");
	setTimeout(function () {
		AjaxLife.Debug("Map init...");
		AjaxLife.Map.init();
		AjaxLife.Debug("Minimap init...");
		AjaxLife.MiniMap.init('minimap','minimap-landscape');;
		AjaxLife.PageWait.hide();
		AjaxLife.PageWait = false;
		AjaxLife.Debug("Network init...");
		AjaxLife.Network.init();
		Ext.Msg.alert(_("AjaxLife.MOTD"),gMOTD);
		AjaxLife.Debug("Grabbing offline IMs");
		AjaxLife.Network.Send("GetOfflineMessages",{});
		AjaxLife.Debug("Startup complete.");
	}, 3000);
}
// Init stuff.
Event.observe(window,'load',AjaxLife.init);

// If someone leaves the page, and we're still connected, give them the chance to cancel and log out properly.
// It's worth noting that reloading is actually harmless, but since we can't differentiate, we'll have to always do this.
// Plus, reloading is advanced use only. :p
window.onbeforeunload = function() {
	if(AjaxLife.Network.Connected)
	{
		return "Leaving this page now is not recommended.\nIf you're sure you want to leave, you should first use the Logout button below.";
	}
};

AjaxLife.Debug("AjaxLife.js ready.");