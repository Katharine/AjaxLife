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
 	var editor = false;
 	var win = false;
 	var list = false;
 	var T = AjaxLife.Constants.Inventory.InventoryType;	
 	
 	// Return the appropriate icon based on inventory type.
 	function getitemicon(type)
 	{
 		switch(type)
 		{
		case T.Texture:
			return 'item_texture.png';
		case T.Sound:
			return 'item_sound.png';
		case T.Animation:
			return 'item_animation.png';
		case T.CallingCard:
			return 'item_callingcard.png';
		case T.Landmark:
			return 'item_landmark.png';
		case T.LSL:
			return 'item_script.png';
		case T.Wearable:
			return 'item_clothing.png';
		case T.Object:
			return 'item_object.png';
		case T.Notecard:
			return 'item_notecard.png';
		case T.Category:
		case T.Folder:
		case T.RootCategory:
			return 'folder_plain_closed.png';
		case T.Snapshot:
			return 'item_snapshot.png';
		case T.Attachment:
			return 'item_attach.png';
		case T.Animation:
			return 'item_animation.png';
		case T.Gesture:
			return 'item_gesture.png';
		default:
			return '../s.gif';
		}
 	}
 	
 	function getfoldericon(type)
 	{
 		// We don't have any nice constants for this one.
 		switch(type)
 		{
 			case 0:
 				return 'folder_texture.png';
 			case 3:
 				return 'folder_landmark.png';
 			case 6:
 				return 'folder_object.png';
 			case 13:
 				return 'folder_bodypart.png';
 			case 5:
 				return 'folder_clothing.png';
 			case 2:
 				return 'folder_callingcard.png';
 			case 15:
 				return 'folder_snapshot.png';
 			case 7:
 				return 'folder_notecard.png';
 			case 10:
 				return 'folder_script.png';
 			case 16:
 				return 'folder_lostandfound.png';
 			case 21:
 				return 'folder_gesture.png';
 			case 14:
 				return 'folder_trash.png';
 			case 20:
 				return 'folder_animation.png';
 			case 1:
 				return 'folder_sound.png';
 			default:
 				return 'folder_plain_closed.png';
 		}
 	}
 	
 	function textchanged(node, text, oldtext)
 	{
		if(node.leaf)
		{
			AjaxLife.Debug("Inventory: Renaming item "+node.attributes.UUID+" to "+text);
			AjaxLife.Network.Send('RenameItem', {
				Item: node.attributes.UUID,
				TargetFolder: node.parentNode.attributes.UUID,
				NewName: text
			});
		}
		else
		{
			AjaxLife.Debug("Inventory: Reverting folder rename.");
			node.setText(oldtext);
			
			// Have to do this to avoid "Too much recursion"-type errors.
			setTimeout(function() {
				AjaxLife.Widgets.Ext.msg("Error","Can't rename folders.");
			}, 100);
		}
	}
 	
 	return {
 		// Public:
 		init: function() { 	
 			// Create a new window and tree for the inventory.
 			win = new Ext.BasicDialog('dlg_inventory',{
 				autoCreate: true,
				resizable: true,
				proxyDrag: !AjaxLife.Fancy,
				width: 300,
				height: 400,
				modal: false,
				shadow: true,
				title: _("Inventory.WindowTitle")
			});
 			
			var root = new Tree.TreeNode({
				text: 'My Inventory',
				draggable: false,
				icon: AjaxLife.STATIC_ROOT+'images/inventory/folder_plain_closed.png'
			});
			
			// Create a root node. The tree is set up to be analogous to the inventory tree
			root.attributes.UUID = gInventoryRoot;
			root.attributes.loaded = false;
			root.attributes.folder = true;
			root.appendChild(new Tree.TreeNode({
				text: 'Loading contents...',
				draggable: false,
				leaf: true,
				icon: AjaxLife.STATIC_ROOT+'images/s.gif'
			}));
			inventory[gInventoryRoot] = root;
			// Render the tree, now that we have a root node.
			tree = new Tree.TreePanel(win.body, {
				animate: AjaxLife.Fancy,
				enableDD: true,
				ddGroup: 'InventoryDD',
				//selModel: new Tree.MultiSelectionModel(), // This doesn't work yet.
				'lines': false
			});
			tree.setRootNode(root);
			editor = new Tree.TreeEditor(tree, {
				allowBlank: false,
				blankText: _("Inventory.NoBlankText"),
				selectOnFocus: true,
				cancelOnEsc: true,
				completeOnEnter: true,
				ignoreNoChange: true
			});		
			
			// Handle double clicking of inventory items by opening the appriopriate type of window.
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
				case T.CallingCard:
					new AjaxLife.Profile(node.attributes.CreatorID);
					break;
				default:
					AjaxLife.Widgets.Ext.msg("Error","Don't know what to do with #"+node.attributes.InventoryType+"s!");
					break;
				}
			});
			
			// Handle expanding folders by loading their contents.
			tree.on('expand',function(node) {
				if(!node.attributes.loaded && !node.attributes.loading)
				{
					node.attributes.loading = true;
					AjaxLife.Debug("Inventory: Loading folder "+node.attributes.UUID);
					AjaxLife.Network.Send('LoadInventoryFolder', {
						UUID: node.attributes.UUID
					});
				}
			});
			
			// Handle reorganisation
			tree.on('nodedrop',function(event) { // That's "node drop", not "no de-drop" (I keep reading it as the latter).
				var node = event.dropNode;
				var newparent = (event.point == 'append') ? event.target : event.target.parentNode;
				if(node.leaf)
				{
					AjaxLife.Debug("Moving "+node.attributes.UUID+" to folder "+newparent.attributes.UUID);
					AjaxLife.Network.Send('MoveItem', {
						Item: node.attributes.UUID,
						TargetFolder: newparent.attributes.UUID,
						NewName: node.attributes.Name
					});
				}
				else
				{
					AjaxLife.Debug("Moving "+node.attributes.UUID+" to folder "+newparent.attributes.UUID);
					AjaxLife.Network.Send('MoveFolder', {
						Folder: node.attributes.UUID,
						NewParent: newparent.attributes.UUID
					});
				}
			});
			
			// Disable reordering - it won't do anything anyway.
			tree.on('nodedragover', function(event) {
				if(event.point == 'append')
				{
					if(event.target == event.dropNode.parentNode)
					{
						return false;
					}
					else
					{
						return true;
					}
				}
				else if(event.dropNode.parentNode == event.target.parentNode)
				{
					return false;
				}
				else
				{
					return true;
				}
			});
			// Show the tree.
			tree.render();
 			
 			// Handle incoming inventory data.
 			AjaxLife.Network.MessageQueue.RegisterCallback('FolderUpdated', function(data) {
 				// Ignore it if we didn't expect it.
 				if(!inventory[data.FolderID])
 				{
 					return;
 				}
 				// Find the inventory node in the hashtable
 				var node = inventory[data.FolderID];
 				var firstload = node.attributes.loading;
 				// Mark it as loaded.
 				node.attributes.loaded = true;
				node.attributes.loading = false;
				data = data.Contents;
				// If there were actually any folders
				if(data.length > 0)
				{
					// Go through each item, create a node for it, set attributes,
					// sort it and add it.
					var folders = [];
					var items = [];
					data.each(function(item) {
						if(inventory[item.UUID]) return; // equivilent to "continue;"
						var newnode = false;
						if(item.Type == "InventoryFolder")
						{
							var newnode = new Tree.TreeNode({
								text: item.Name,
								leaf: false,
								draggable: true,
								icon: AjaxLife.STATIC_ROOT+'images/inventory/'+getfoldericon(item.PreferredType)
							});
							newnode.attributes.PreferredType = item.PreferredType;
							newnode.attributes.OwnerID = item.OwnerID;
							newnode.attributes.UUID = item.UUID;
							newnode.attributes.Name = item.Name;
							newnode.appendChild(new Tree.TreeNode({
								text: 'Loading contents...',
								draggable: false,
								leaf: true,
								icon: AjaxLife.STATIC_ROOT+'images/s.gif'
							}));
							inventory[item.UUID] = newnode;
							folders.push(newnode);
						}
						else if(item.Type == "InventoryItem")
						{
							var newnode = new Tree.TreeNode({
								text: item.Name,
								leaf: true,
								draggable: true,
								icon: AjaxLife.STATIC_ROOT+'images/inventory/'+getitemicon(item.InventoryType)
							});
							newnode.attributes.InventoryUUID = item.UUID; // Deprecated - use UUID instead of InventoryUUID.
							newnode.attributes.UUID = item.UUID;
							newnode.attributes.AssetType = item.AssetType;
							newnode.attributes.AssetUUID = item.AssetUUID;
							newnode.attributes.CreatorID = item.CreatorID;
							newnode.attributes.CreationDate = item.CreationDate;
							newnode.attributes.Description = item.Description;
							newnode.attributes.Flags = item.Flags;
							newnode.attributes.InventoryType = item.InventoryType;
							newnode.attributes.Name = item.Name;
							newnode.attributes.Permissions = item.Permissions;
							inventory[item.UUID] = newnode;
							items.push(newnode);
						}
						newnode.on('textchange', textchanged);
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
 			
 			// Handle failed asset transfers. This seems like the best place for this to go.
 			AjaxLife.Network.MessageQueue.RegisterCallback('NullTransfer', function(data) {
 				AjaxLife.Widgets.Ext.msg("", _("Inventory.NullAssetTransfer"));
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