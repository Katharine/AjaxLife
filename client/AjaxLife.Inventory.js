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
 
 AjaxLife.Inventory = function() {
 	// Private:
 	var Tree = Ext.tree;
 	var inventory = {};
 	var tree = false;
 	var win = false;
 	var list = false;
 	var T = AjaxLife.Constants.Inventory.InventoryType;	
 	
 	function getitemicon(type)
 	{
 		switch(type)
 		{
		case T.Texture:
			return 'item_texture.gif';
		case T.Sound:
			return 'item_sound.gif';
		case T.Animation:
			return 'item_animation.gif';
		case T.CallingCard:
			return 'item_callingcard_offline.gif';
		case T.Landmark:
			return 'item_landmark.gif';
		case T.LSL:
			return 'item_script.gif';
		case T.Wearable:
			return 'item_clothing.gif';
		case T.Object:
			return 'item_object.gif';
		case T.Notecard:
			return 'item_notecard.gif';
		case T.Category:
		case T.Folder:
		case T.RootCategory:
			return 'folder_plain_closed.gif';
		case T.Snapshot:
			return 'item_snapshot.gif';
		case T.Attachment:
			return 'item_attach.gif';
		case T.Animation:
			return 'item_animation.gif';
		case T.Gesture:
			return 'item_gesture.gif';
		default:
			return '../s.gif';
		}
 	}
 	
 	return {
 		// Public:
 		init: function() { 		
 			win = new Ext.BasicDialog("dlg_inventory", {
				width: '300px',
				height: '400px',
				modal: false,
				shadow: true,
				autoCreate: true,
				title: _("Inventory.WindowTitle")
			});
			var treeholder = document.createElement('div');
			tree = new Tree.TreePanel(win.body.dom, {
				animate: true,
				enableDD: false, // Change this when we have inventory writing working.
				//containerScroll: true,
				lines: false,
				//dropConfig: {appendOnly: true}
			});
			//new Tree.TreeSorter(tree, {folderSort: true}); // Sorting = boom.
			var root = new Tree.TreeNode({
				text: 'My Inventory',
				draggable: false,
				icon: AjaxLife.STATIC_ROOT+'/images/inventory/folder_plain_closed.gif'
			});
			root.attributes.UUID = gInventoryRoot;
			root.attributes.loaded = false;
			root.attributes.folder = true;
			root.appendChild(new Tree.TreeNode({
				text: 'Loading contents...',
				draggable: false,
				leaf: true,
				icon: AjaxLife.STATIC_ROOT+'/images/s.gif'
			}));
			inventory[gInventoryRoot] = root;
			tree.setRootNode(root);
			tree.on('dblclick', function(node) {
				if(!node.attributes.InventoryType && node.attributes.InventoryType !== 0) return;
				var type = node.attributes.InventoryType;
				switch(node.attributes.InventoryType)
				{
				case T.Texture:
				case T.Snapshot:
					new AjaxLife.InventoryDialogs.Texture(node.attributes.AssetUUID, node.text);
					break;
				case T.Notecard:
					new AjaxLife.InventoryDialogs.Notecard(node.attributes.AssetUUID, node.attributes.InventoryUUID, node.text);
					break;
				case T.LSL:
					new AjaxLife.InventoryDialogs.Script(node.attributes.InventoryUUID, node.text);
					break;
				case T.Landmark:
					new AjaxLife.InventoryDialogs.Landmark(node.attributes.AssetUUID, node.text);
					break;
				default:
					AjaxLife.Widgets.Ext.msg("Error","Don't know what to do with #"+node.attributes.InventoryType+"s!");
					break;
				}
			});
			tree.on('expand',function(node) {
				if(!node.attributes.loaded && !node.attributes.loading)
				{
					node.attributes.loading = true;
					AjaxLife.Network.Send('LoadInventoryFolder', {
						UUID: node.attributes.UUID
					});
				}
			});
			tree.render();
 			win.body.dom.appendChild(treeholder);
 			
 			AjaxLife.Network.MessageQueue.RegisterCallback('FolderUpdated', function(data) {
 				if(!inventory[data.FolderID])
 				{
 					return;
 				}
 				var node = inventory[data.FolderID];
 				var firstload = node.attributes.loading;
 				node.attributes.loaded = true;
				node.attributes.loading = false;
				data = data.Contents;
				if(data.length > 0)
				{
					var folders = [];
					var items = [];
					data.each(function(item) {
						if(inventory[item.UUID]) return; // continue;
						if(item.Type == "InventoryFolder")
						{
							var newnode = new Tree.TreeNode({
								text: item.Name,
								leaf: false,
								icon: AjaxLife.STATIC_ROOT+'/images/inventory/folder_plain_closed.gif'
							});
							newnode.attributes.PreferredType = item.PreferredType;
							newnode.attributes.OwnerID = item.OwnerID;
							newnode.attributes.UUID = item.UUID;
							newnode.appendChild(new Tree.TreeNode({
								text: 'Loading contents...',
								draggable: false,
								leaf: true,
								icon: AjaxLife.STATIC_ROOT+'/images/s.gif'
							}));
							inventory[item.UUID] = newnode;
							folders.push(newnode);
						}
						else if(item.Type == "InventoryItem")
						{
							var newnode = new Tree.TreeNode({
								text: item.Name,
								leaf: true,
								icon: AjaxLife.STATIC_ROOT+'/images/inventory/'+getitemicon(item.InventoryType)
							});
							newnode.attributes.InventoryUUID = item.UUID;
							newnode.attributes.AssetType = item.AssetType;
							newnode.attributes.AssetUUID = item.AssetUUID;
							newnode.attributes.CreatorID = item.CreatorID;
							newnode.attributes.CreationDate = item.CreationDate;
							newnode.attributes.Description = item.Description;
							newnode.attributes.Flags = item.Flags;
							newnode.attributes.InventoryType = item.InventoryType;
							newnode.attributes.Permissions = item.Permissions;
							inventory[item.UUID] = newnode;
							items.push(newnode);
						}
					});
					folders.sortBy(function(item) {
						return item.text;
					}).each(function(item) {
						node.appendChild(item);
					});
					items.each(function(item) {
						node.appendChild(item);
					});
				}
				if(firstload)
				{
					node.removeChild(node.firstChild);
				}
 			});
 			
 			// Handle incoming inventory.
 			AjaxLife.Network.MessageQueue.RegisterCallback('ObjectOffered', function(data) {
 				// Great. Now what?
 				// The LibSL callback doesn't provide enough information to make this really useful.
 				// This callback is just here to supress the unhandled message errors.
 				//FIXME: Write our own inventory handler.
 			});
 			
 		},
		open: function(opener) {
			if(opener)
			{
				win.show(opener);
			}
			else
			{
				win.show();
			}
		},
		close: function() {
			win.hide();
		},
		toggle: function(opener) {
			if(!win.isVisible())
			{
				this.open(opener);
			}
			else
			{
				this.close();
			}
		}
 	};
 }();