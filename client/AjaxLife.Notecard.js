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

AjaxLife.ActiveInventoryDialogs.Notecard = {};
AjaxLife.InventoryDialogs.Notecard = function(notecardid, inventoryid, name) {
	// If this window already exists, focus it and quit.
	if(AjaxLife.ActiveInventoryDialogs.Notecard[notecardid])
	{
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid].focus();
		return;
	}
	var notecard = false;
	var win = false;
	var callback = false;
	// Create the window.
	win = new Ext.BasicDialog("dlg_notecard_"+notecardid, {
		width: '500px',
		height: '520px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Notecard.WindowTitle",{name: name}),
		resizable: true,
		proxyDrag: !AjaxLife.Fancy
	});
	var style = {};
	// For reasons I don't understand, this breaks IE.
	// As such. we omit it if you're using IE. Sorry.
	// I doubt you'll mind the lack of an artfully shaded box.
	//TODO: Try and find a workaround.
	if(!Prototype.Browser.IE)
	{
		style.backgroundColor = 'grey';
	}
	// Set up the window with initial data and note its existence.
	$(win.body.dom).setStyle(style).addClassName('notecard').update('Loading notecard, please wait...');
	AjaxLife.ActiveInventoryDialogs.Notecard[notecardid] = win;
	// When the window is closed, destroy it and unregister the event handlers.
	win.on('hide', function() {
		delete AjaxLife.ActiveInventoryDialogs.Notecard[notecardid];
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.destroy(true);
	});
	
	// Register a callback for the AssetReceived callback.
	callback = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function(data) {
		// Bail out if this isn't what we were waiting for.
		if(data.AssetID != notecardid) return;
		
		AjaxLife.Debug("InventoryDialogs: Received notecard asset "+data.AssetID);
		// Unregister it - we aren't going to receive more than one, so leaving it registered
		// is a waste of CPU time.
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		var text = '';
		if(data.Success)
		{
			// This parses the Linden notecard format.
			text = data.AssetData;
			// This is the number of items we're expecting.
			// We don't actually use this for anything, yet.
			var count = text.match(/count ([0-9]+?)/)[0];
			var stack = -1;
			// loop through until we reach the the end of the embedded blocks.
			// This isn't particularly efficient, but these headers are always fairly short,
			// so it doesn't really matter.
			var i;
			for(i = 0; i < text.length; ++i)
			{
				var chr = text.substr(i,1);
				if(chr == '{')
				{
					++stack;
				}
				else if(chr == '}')
				{
					--stack;
					if(stack <= 0)
					{
						break;
					}
				}
			}
			// Cut off everything past that point.
			text = text.substr(i+1);
			// Work out how many characters we expect.
			// Note that this number seems to be somewhat off, so we ignore it and proceed to
			// just take the whole thing minus the last character.
			var length = text.match(/Text length ([0-9]+)/)[0].strip();
			text = text.replace(/Text length ([0-9]+)\w/,'').strip();
			text = text.substr(0,text.length - 1);
			win.body.dom.setStyle({backgroundColor: 'white'});
		}
		else
		{
			text = "Failed to download asset: "+data.Error.escapeHTML();
		}
		// Put the text into the window, replacing the placeholder.
		// Oddly, IE doesn't mind the backgroundColor here.
		//TODO: Figure out why IE likes this and not the previous attempt.
		win.body.dom.update(AjaxLife.Utils.FixText(text));
	});
	
	// Actually download the texture.
	AjaxLife.Debug("InventoryDialogs: Requesting notecard asset "+notecardid);
	AjaxLife.Network.Send('RequestAsset', {
		AssetID: notecardid,
		InventoryID: inventoryid,
		OwnerID: gAgentID,
		AssetType: AjaxLife.Constants.Inventory.InventoryType.Notecard
	});
	// Display the thing.
	win.show();
};