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

AjaxLife.Notecard = function(notecardid, inventoryid, ownerid, onnoteload, uploadcallback) {
	var rawtext = '';
	var parsedtext = '';
	var length = 0;
	var attachments = 0;
	var loaded = false;
	var success = false;
	var callbackid = false;
	
	function parsenote(text)
	{
		rawtext = text;
		attachments = text.match(/count ([0-9]+?)/)[1];
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
		length = text.match(/Text length ([0-9]+)/)[0].strip();
		text = text.replace(/Text length ([0-9]+)\w/,'').strip();
		text = text.substr(0,text.length - 1);
		parsedtext = text;
		return text;
	}
	
	function loadnote() {
		AjaxLife.Debug("Notecard: Requesting notecard asset "+notecardid);
		AjaxLife.Network.Send('RequestAsset', {
			AssetID: notecardid,
			InventoryID: inventoryid,
			OwnerID: ownerid,
			AssetType: AjaxLife.Constants.Inventory.InventoryType.Notecard
		});
	}
	
	function handleincomingnote(data) {
		if(data.AssetID != notecardid) return;
		AjaxLife.Debug("Notecard: Received notecard asset "+data.AssetID);
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived',callbackid);
		if(data.Success)
		{
			success = true;
			parsenote(data.AssetData);
		}
		try
		{
			if(onnoteload && typeof onnoteload == 'function')
			{
				onnoteload(this, success ? parsedtext : data.Error);
			}
		}
		catch(e) { };
	}
	
	function generatenote(text)
	{
		var code = 	'Linden text version 2\n' + 
					'{\n' +
					'LLEmbeddedItems version 1\n' +
					'{\n'+
					'	count 0\n'+
					'}\n';
		code += 'Text length '+text.length+'\n';
		code += text;
		code += '\n}';
		return code;
	}
	
	function upload()
	{
		if(attachments > 0) return false;
		
		AjaxLife.Debug("Notecard: Starting upload of notecard "+inventoryid);
		
		var xid = AjaxLife.Utils.UUID.Zero;
		var cid = AjaxLife.Network.MessageQueue.RegisterCallback('AssetUploaded', function(data) {
			if(data.TransferID != xid) return;
			AjaxLife.Debug("Notecard: Upload "+xid+" completed. Success: "+data.Success);
			AjaxLife.Network.MessageQueue.UnregisterCallback('AssetUploaded', cid);
			if(data.Success)
			{
				AjaxLife.Debug("Notecard: Inventory item "+inventoryid+" changed AssetID from "+notecardid+" to "+data.AssetID);
				// Update the notecardid
				notecardid = data.AssetID;
				// Update our inventory too, if possible.
				var node = AjaxLife.Inventory.GetNode(inventoryid);
				if(node && node.attributes)
				{
					node.attributes.AssetID = notecardid;
				}
			}
			if(uploadcallback && typeof uploadcallback == 'function')
			{
				uploadcallback(data);
			}
		});
		
		AjaxLife.Network.Send('SaveTextAsset', {
			AssetType: AjaxLife.Constants.Inventory.InventoryType.Notecard,
			AssetData: rawtext,
			callback: function(data) {
				xid = data.TranferID; // This should be TransferID, but there's a typo on the server side.
				AjaxLife.Debug("Notecard: Upload of "+inventoryid+" in progress. XferID = "+xid);
			}
		});
	}
	
	// Code to run on object instantiation
	callbackid = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', handleincomingnote);
	if(notecardid && inventoryid && ownerid)
	{
		loadnote();
	}
	
	return {
		SetLoadHandler: function(handler) {
			onnoteload = handler;
		},
		SetUploadHandler: function(handler) {
			uploadcallback = handler;
		},
		GetText: function() {
			if(loaded)
			{
				return parsedtext;
			}
			else
			{
				return false;
			}
		},
		SetText: function(text) {
			parsedtext = text;
			rawtext = generatenote(text);
		},
		Save: function() {
			upload();
		},
		GetRawText: function() {
			return rawtext;
		},
		GetAttachmentCount: function() {
			return attachments;
		},
		GetNotecardID: function() {
			return notecardid;
		},
		IsLoaded: function() {
			return loaded;
		},
		UnsetLoadHandler: function() {
			onnoteload = false;
		},
		Load: function(note, inv, owner) {
			if(loaded) return false;
			notecardid = note;
			inventoryid = inv;
			ownerid = owner;
			loadnote();
		}
	};
}

AjaxLife.ActiveInventoryDialogs.Notecard = {};
AjaxLife.InventoryDialogs.Notecard = function(notecardid, inventoryid, name) {
	// If this window already exists, focus it and quit.
	if(AjaxLife.ActiveInventoryDialogs.Notecard[notecardid])
	{
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid].focus();
		return;
	}
	var note = false;
	var win = false;
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
	// When the window is closed, destroy it.
	win.on('hide', function() {
			delete AjaxLife.ActiveInventoryDialogs.Notecard[notecardid];
			win.destroy(true);
	});
	
	new AjaxLife.Notecard(notecardid, inventoryid, gAgentID, function(data, text) {
			win.body.dom.setStyle({backgroundColor: 'white'}).update(AjaxLife.Utils.FixText(text));
	});
	
	// Display the thing.
	win.show();
};