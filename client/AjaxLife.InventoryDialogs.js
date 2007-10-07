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
 
AjaxLife.InventoryDialogs = {};
AjaxLife.ActiveInventoryDialogs = {};

AjaxLife.ActiveInventoryDialogs.Texture = {};
AjaxLife.InventoryDialogs.Texture = function(textureid, name) {
	if(AjaxLife.ActiveInventoryDialogs.Texture[textureid])
	{
		AjaxLife.ActiveInventoryDialogs.Texture[texture].focus();
		return;
	}
	// Private
	var texture = false;
	var win = false;
	
	win = new Ext.BasicDialog("dlg_texture_"+textureid, {
		width: '272px',
		height: '292px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Texture.WindowTitle",{name: name}),
		resizable: true
	});
	win.body.setStyle({
		padding: '0px',
		margin: '0px',
		overflow: 'hidden'
	});
	AjaxLife.ActiveInventoryDialogs.Texture[textureid] = win;
	win.on('hide', function() {
		AjaxLife.ActiveInventoryDialogs.Texture[textureid] = false;
		win.destroy(true);
	});
	
	texture = new AjaxLife.Texture(win.body.dom, 256, 256, textureid);
	win.on('resize', function(thewin, width, height) {
		texture.resize(width - 16, height - 36);
	});
	
	win.show();
};

AjaxLife.ActiveInventoryDialogs.Notecard = {};
AjaxLife.InventoryDialogs.Notecard = function(notecardid, inventoryid, name) {
	if(AjaxLife.ActiveInventoryDialogs.Notecard[notecardid])
	{
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid].focus();
		return;
	}
	var notecard = false;
	var win = false;
	var callback = false;
	win = new Ext.BasicDialog("dlg_notecard_"+notecardid, {
		width: '500px',
		height: '520px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Notecard.WindowTitle",{name: name}),
		resizable: true
	});
	win.body.dom.setStyle({
		backgroundColor: 'grey',
	}).addClassName('notecard').update('Loading notecard, please wait...');
	AjaxLife.ActiveInventoryDialogs.Notecard[notecardid] = win;
	win.on('hide', function() {
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid] = false;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.destroy(true);
	});
	
	callback = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function(data) {
		if(data.AssetID != notecardid) return;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		var text = data.AssetData;
		var count = text.match(/count ([0-9]+?)/)[0];
		var stack = -1;
		var i;
		for(i = 0; i < text.length; ++i)
		{
			var char = text.substr(i,1);
			if(char == '{')
			{
				++stack;
			}
			else if(char == '}')
			{
				--stack;
				if(stack <= 0)
				{
					break;
				}
			}
		}
		text = text.substr(i+1);
		var length = text.match(/Text length ([0-9]+)/)[0].strip();
		text = text.replace(/Text length ([0-9]+)\w/,'').strip();
		text = text.substr(0,text.length - 1);
		win.body.dom.update(AjaxLife.Utils.FixText(text)).setStyle({backgroundColor: 'white'});
	});
	
	AjaxLife.Network.Send('RequestAsset', {
		AssetID: notecardid,
		InventoryID: inventoryid,
		OwnerID: gAgentID,
		AssetType: AjaxLife.Constants.Inventory.InventoryType.Notecard
	});
	
	win.show();
};

AjaxLife.ActiveInventoryDialogs.Script = {};
AjaxLife.InventoryDialogs.Script = function(inventoryid, name) {
	if(AjaxLife.ActiveInventoryDialogs.Script[inventoryid])
	{
		AjaxLife.ActiveInventoryDialogs.Script[inventoryid].focus();
		return;
	}
	var win = false;
	var callback = false;
	var transferid = AjaxLife.Utils.UUID.Zero;
	
	win = new Ext.BasicDialog("dlg_script_"+inventoryid, {
		width: '500px',
		height: '520px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Script.WindowTitle",{name: name}),
		resizable: true
	});
	win.body.dom.setStyle({
		backgroundColor: 'grey',
	}).addClassName('script').update('Loading script, please wait...');
	AjaxLife.ActiveInventoryDialogs.Script[inventoryid] = win;
	win.on('hide', function() {
		AjaxLife.ActiveInventoryDialogs.Script[inventoryid] = false;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.destroy(true);
	});
	
	callback = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function(data) {
		if(data.TransferID != transferid) return;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.body.dom.update('<pre>'+data.AssetData.escapeHTML()+'</pre>').setStyle({backgroundColor: 'white'});
	});
	
	AjaxLife.Network.Send('RequestAsset', {
		AssetID: AjaxLife.Utils.UUID.Zero,
		InventoryID: inventoryid,
		OwnerID: gAgentID,
		AssetType: AjaxLife.Constants.Inventory.InventoryType.LSL,
		callback: function(data) {
			transferid = data.TransferID;
		}
	});
	
	win.show();
};

AjaxLife.InventoryDialogs.Landmark = function(landmark, name) {
	Ext.Msg.confirm(_("InventoryDialogs.Landmark.Title"), _("InventoryDialogs.Landmark.Message", {name: name}), function(btn) {
		if(btn == 'yes')
		{
			AjaxLife.Map.TPDialog();
			AjaxLife.Network.Send('Teleport', {Landmark: landmark});
		}
	});
};