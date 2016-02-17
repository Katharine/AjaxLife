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

AjaxLife.Inventory = function() {
  // Private:
  var Tree = Ext.tree;
  var inventory = {};
  var offers = {};
  var tree = false;
  var win = false;
  var list = false;
  var trashnode = false;
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

  function getfoldericon(type, name)
  {
    // We don't have any nice constants for this one.
    switch(type)
    {
      case 0:
        // Fixes bug where all folders get the texture icon.
        if(name == 'Textures')
        {
          return 'folder_texture.png';
        }
        else
        {
          return getfoldericon(-1);
        }
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

  function moveitem(node, newparent)
  {
    AjaxLife.Debug("Moving "+node.attributes.UUID+" to folder "+newparent.attributes.UUID);
    if(node.leaf)
    {
      AjaxLife.Network.Send('MoveItem', {
        Item: node.attributes.UUID,
        TargetFolder: newparent.attributes.UUID,
        NewName: node.attributes.Name
      });
    }
    else
    {
      AjaxLife.Network.Send('MoveFolder', {
        Folder: node.attributes.UUID,
        NewParent: newparent.attributes.UUID
      });
    }
  }

  function emptytrash()
  {
    var node = this;
    AjaxLife.Widgets.Modal.confirm("", _("Inventory.ConfirmEmptyTrash"), function(btn) {
      if(btn == 'yes')
      {
        AjaxLife.Debug("Inventory: Emptying trash...");
        AjaxLife.Network.Send("EmptyTrash", {foo: 'bar', callback: function(data) {
          alert(data);
        }});
        while(trashnode.childNodes.length)
        {
          try
          {
            trashnode.eachChild(function(thenode) {
              if(!thenode || !thenode.attributes) return;
              removeinventoryfromcache(thenode);
              if(thenode != trashnode) trashnode.removeChild(thenode);
            });
          }
          catch(e)
          {
            AjaxLife.Debug("Exception while deleting. Going again.");
          }
        }
        AjaxLife.Debug("Inventory: Trash emptied.");
      }
    });
  }

  function removeinventoryfromcache(node)
  {
    if(inventory[node.attributes.UUID])
    {
      delete inventory[node.attributes.UUID];
    }
    if(!node.leaf)
    {
      node.eachChild(removeinventoryfromcache);
    }
  }

  function inventorydelete(n)
  {
    var node = (n && n.attributes) ? n : this;
    if(node.isAncestor(trashnode))
    {
      AjaxLife.Widgets.Modal.confirm("", _("Inventory.ConfirmItemPurge", {item: node.attributes.Name}), function(btn) {
        if(btn == 'yes')
        {
          if(node.leaf)
          {
            AjaxLife.Debug("Inventory: Sending DeleteItem("+node.attributes.UUID+")");
            AjaxLife.Network.Send("DeleteItem", {Item: node.attributes.UUID});
          }
          else
          {
            AjaxLife.Debug("Inventory: Sending DeleteFolder("+node.attributes.UUID+")");
            AjaxLife.Network.Send("DeleteFolder", {Folder: node.attributes.UUID});
          }
          removeinventoryfromcache(node);
          node.parentNode.removeChild(node);
          AjaxLife.Debug("Inventory: Deleted "+node.attributes.UUID+" from trash.");
        }
      });
    }
    else
    {
      moveitem(node, trashnode);
      trashnode.appendChild(node);
      AjaxLife.Debug("Inventory: Moved "+node.attributes.UUID+" to trash.");
    }
  }

  function inventoryproperties()
  {
    new AjaxLife.InventoryDialogs.Properties(this.attributes);
  }

  var uuidcopycount = 0;

  function copyuuid()
  {
    var uuid = (this.attributes.AssetUUID == AjaxLife.Utils.UUID.Zero) ? this.attributes.UUID : this.attributes.AssetUUID;
    // In IE we just copy it.
    if(window.clipboardData && window.clipboardData.setData)
    {
      window.clipboardData.setData('Text',uuid);
    }
    // For everything else we show a dialog.
    else
    {
      ++uuidcopycount;
      AjaxLife.Widgets.Modal.alert("", "UUID: <span id='uuid-copy-"+uuidcopycount+"'>"+uuid+"</span>");
      // And, if possible, we select the UUID.
      // Don't have to support IE because we already got it out the way.
      if(document.createRange && window.getSelection)
      {
        var range = document.createRange();
        range.selectNode($('uuid-copy-'+uuidcopycount));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }
  }

  function renameitem()
  {
    var node = this;
    AjaxLife.Widgets.Modal.show({
      buttons: Ext.Msg.OKCANCEL,
      closable: false,
      msg: _("Inventory.RenameItem"),
      prompt: true,
      value: node.attributes.Name,
      fn: function(btn, text) {
        if(btn != 'ok' || text == '') return;
        node.attributes.Name = text;
        node.setText(text);
        AjaxLife.Network.Send('UpdateItem', {
          ItemID: node.attributes.UUID,
          OwnerID: node.attributes.OwnerID,
          Name: text
        });
      }
    });
  }

  function createfolder()
  {
    var node = this;
    AjaxLife.Widgets.Modal.prompt("", _("Inventory.NewFolderName"), function(btn, text) {
      if(btn != 'ok' || text.blank()) return;
      AjaxLife.Network.Send("CreateFolder", {
        Parent: node.attributes.UUID,
        Name: text,
        callback: function(data) {
          if(data.FolderID != "" && data.FolderID != AjaxLife.Utils.UUID.Zero)
          {
            var newnode = new Tree.TreeNode({
              text: text,
              leaf: false,
              draggable: true,
              icon: AjaxLife.STATIC_ROOT+'images/inventory/'+getfoldericon(-1, text)
            });
            newnode.attributes.PreferredType = -1;
            newnode.attributes.OwnerID = gAgentID;
            newnode.attributes.UUID = data.FolderID;
            newnode.attributes.Name = text;
            newnode.attributes.loaded = true;
            newnode.attributes.loading = false;
            inventory[data.FolderID] = newnode;
            node.appendChild(newnode);
            newnode.ensureVisible();
            newnode.select();
            AjaxLife.Debug("Inventory: Newly created folder "+data.FolderID+" added to inventory.");
          }
          else
          {
            AjaxLife.Widgets.Ext.msg("",_("Inventory.FolderCreationFailed", {folder: text}));
          }
        }
      });
    });
    AjaxLife.Debug("Inventory: Created folder beneath "+this.attributes.UUID);
  }

  function createnote()
  {
    var node = this;
    AjaxLife.Widgets.Modal.prompt("", _("Inventory.NewNoteName"), function(btn, text) {
      if(btn != 'ok' || text.blank()) return;
      AjaxLife.Network.Send("CreateInventory", {
        Folder: node.attributes.UUID,
        Name: text,
        Description: "(no description)",
        AssetType: AjaxLife.Constants.Inventory.AssetType.Notecard,
        InventoryType: AjaxLife.Constants.Inventory.InventoryType.Notecard
      });
    });
  }

  function perm2string(permissions)
  {
    var perms = '';
    var P = AjaxLife.Constants.Permissions;
    if(permissions & P.Copy)
    {
      perms += _('AssetPermissions.Copy');
    }
    else
    {
      perms += _('AssetPermissions.NoCopy');
    }
    perms += ', ';
    if(permissions & P.Modify)
    {
      perms += _('AssetPermissions.Modify');
    }
    else
    {
      perms += _('AssetPermissions.NoModify');
    }
    perms += ', ';
    if(permissions & P.Transfer)
    {
      perms += _('AssetPermissions.Transfer');
    }
    else
    {
      perms += _('AssetPermissions.NoTransfer');
    }
    return perms;
  }

  function noperm2string(permissions)
  {
    var perms = [];
    var P = AjaxLife.Constants.Permissions;
    if(~permissions & P.Copy)
    {
      perms[perms.length] = _('AssetPermissions.NoCopy');
    }
    if(~permissions & P.Modify)
    {
      perms[perms.length] = _('AssetPermissions.NoModify');
    }
    if(~permissions & P.Transfer)
    {
      perms[perms.length] = _('AssetPermissions.NoTransfer');
    }
    perms = perms.join(', ');
    return perms;
  }

  function makeitem(item)
  {
    var newnode = new Tree.TreeNode({
      text: item.Name,
      leaf: true,
      draggable: true,
      icon: AjaxLife.STATIC_ROOT+'images/inventory/'+getitemicon(item.InventoryType),
      qtip: perm2string(item.Permissions.OwnerMask)
    });
    newnode.attributes.InventoryUUID = item.UUID; // Deprecated - use UUID instead of InventoryUUID.
    newnode.attributes.UUID = item.UUID;
    newnode.attributes.AssetType = item.AssetType;
    newnode.attributes.AssetUUID = item.AssetUUID;
    newnode.attributes.CreatorID = item.CreatorID;
    newnode.attributes.OwnerID = item.OwnerID;
    newnode.attributes.CreationDate = item.CreationDate;
    newnode.attributes.Description = item.Description;
    newnode.attributes.Flags = item.Flags;
    newnode.attributes.InventoryType = item.InventoryType;
    newnode.attributes.Name = item.Name;
    newnode.attributes.Permissions = item.Permissions;
    return newnode;
  }

  return {
    // Public:
    init: function() {
      // Create a new window and tree for the inventory.
      win = new Ext.BasicDialog('dlg_inventory',{
        autoCreate: true,
        resizable: true,
        proxyDrag: !AjaxLife.Fancy,
        width: 350,
        height: 400,
        modal: false,
        //autoScroll: true, // This causes strange problems with scrolling.
        shadow: true,
        title: _("Inventory.WindowTitle")
      });

      var root = new Tree.TreeNode({
        text: _("Inventory.MyInventory"),
        draggable: false,
        icon: AjaxLife.STATIC_ROOT+'images/inventory/folder_plain_closed.png'
      });

      // Create a root node. The tree is set up to be analogous to the inventory tree
      root.attributes.UUID = gInventoryRoot;
      root.attributes.loaded = false;
      root.attributes.folder = true;
      root.appendChild(new Tree.TreeNode({
        text: _("Inventory.Loading"),
        draggable: false,
        leaf: true,
        icon: AjaxLife.STATIC_ROOT+'images/s.gif'
      }));
      root.firstChild.attributes.UUID = AjaxLife.Utils.UUID.Zero; // So we can tell it's the "loading" thing.
      inventory[gInventoryRoot] = root;
      // Render the tree, now that we have a root node.
      tree = new Tree.TreePanel(win.body, {
        animate: AjaxLife.Fancy,
        enableDD: true,
        ddGroup: 'InventoryDD',
        containerScroll: true,
        fitToFrame: true,
        //selModel: new Tree.MultiSelectionModel(), // This doesn't work yet.
        'lines': false
      });
      tree.setRootNode(root);

      // Handle double clicking of inventory items by opening the appriopriate type of window.
      tree.on('dblclick', function(node) {
        if(!node.attributes.InventoryType && node.attributes.InventoryType !== 0) return;
        var type = node.attributes.InventoryType;
        switch(node.attributes.InventoryType)
        {
          case T.Texture:
          case T.Snapshot:
            new AjaxLife.InventoryDialogs.Texture(node.attributes.AssetUUID, node.attributes.Name);
            break;
          case T.Notecard:
            new AjaxLife.InventoryDialogs.Notecard(node.attributes.AssetUUID, node.attributes.InventoryUUID, node.text);
            break;
          case T.LSL:
            if((node.attributes.Permissions.OwnerMask & AjaxLife.Constants.Permissions.Copy) &&
              (node.attributes.Permissions.OwnerMask & AjaxLife.Constants.Permissions.Modify))
            {
              new AjaxLife.InventoryDialogs.Script(node.attributes.InventoryUUID, node.attributes.Name);
            }
            else
            {
              AjaxLife.Widgets.Ext.msg("", _("Inventory.ScriptRestricted"));
            }
            break;
          case T.Landmark:
            new AjaxLife.InventoryDialogs.Landmark(node.attributes.AssetUUID, node.attributes.Name);
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
        moveitem(node, newparent);
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
                icon: AjaxLife.STATIC_ROOT+'images/inventory/'+getfoldericon(item.PreferredType, item.Name)
              });
              // 14 is the trash.
              if(item.PreferredType == 14)
              {
                trashnode = newnode;
              }
              newnode.attributes.PreferredType = item.PreferredType;
              newnode.attributes.OwnerID = item.OwnerID;
              newnode.attributes.UUID = item.UUID;
              newnode.attributes.Name = item.Name;
              var loadingnode = new Tree.TreeNode({
                text: _("Inventory.Loading"),
                draggable: false,
                leaf: true,
                icon: AjaxLife.STATIC_ROOT+'images/s.gif'
              });
              loadingnode.attributes.UUID = AjaxLife.Utils.UUID.Zero;
              newnode.appendChild(loadingnode);
              inventory[item.UUID] = newnode;
              folders.push(newnode);
            }
            else if(item.Type == "InventoryItem")
            {
              var newnode = makeitem(item);
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
          var tokill = node.firstChild;
          while(tokill && tokill.attributes.UUID != AjaxLife.Utils.UUID.Zero) tokill = tokill.nextSibling; // Keep looping until we find the loading node.
          if(tokill) node.removeChild(tokill);
        }
      });

      AjaxLife.Network.MessageQueue.RegisterCallback('InventoryCreated', function(item) {
        if(!item.Success)
        {
          AjaxLife.Widgets.Modal.alert(_("Inventory.CreationFailed"));
          return;
        }
        AjaxLife.Debug("Inventory: Got new inventory item "+item.UUID+" to go in folder "+item.FolderID);
        if(!inventory[item.FolderID]) return;
        var folder = inventory[item.FolderID];
        if(!folder.firstChild || folder.leaf) return;
        var newnode = makeitem(item);
        inventory[item.UUID] = newnode;
        folder.insertBefore(newnode, folder.firstChild);
        newnode.ensureVisible();
        newnode.select();
      });

      tree.on('contextmenu', function(node, ev) {
        ev.stopEvent();
        if(node.attributes.UUID == AjaxLife.Utils.UUID.Zero) return;
        tree.getSelectionModel().select(node);
        var menu = new Ext.menu.Menu({});
        // Can't delete special things.
        if(node.getDepth() > 0 && (node.leaf || node.attributes.PreferredType <= 0))
        {
          // Delete button.
          var delbtn = new Ext.menu.Item({text: _('Inventory.Delete')});
          delbtn.on('click', inventorydelete, node);
          menu.add(delbtn);
        }
        if(node.leaf)
        {
          var P = AjaxLife.Constants.Permissions;
          var perms = node.attributes.Permissions.OwnerMask;

          var props = new Ext.menu.Item({text: _('Inventory.Properties')});
          props.on('click', inventoryproperties, node);
          menu.add(props);

          // Rename button
          var rename = new Ext.menu.Item({text: _('Inventory.Rename')});
          rename.on('click', renameitem, node);
          // Disable this if we don't have modify permissions. It won't work anyway.
          if(~perms & P.Modify)
          {
            rename.disable();
          }
          menu.add(rename);

          // Copy UUID button
          var uuid = new Ext.menu.Item({text: _('Inventory.CopyUUID')});
          uuid.on('click', copyuuid, node);

          // Only enable this if we have full permissions.
          // This is JavaScript-enforced DRM. Yeah, right.
          // Still. Best to keep the content creators happy.
          if((~perms & P.Copy) || (~perms & P.Modify) || (~perms & P.Transfer))
          {
            uuid.disable();
          }
          menu.add(uuid);
        }
        else
        {
          // Create Folder button
          var newfolder = new Ext.menu.Item({text: _('Inventory.CreateFolder')});
          newfolder.on('click', createfolder, node);
          menu.add(newfolder);

          // Create Notecard button
          var newnote = new Ext.menu.Item({text: _('Inventory.CreateNote')});
          newnote.on('click', createnote, node);
          menu.add(newnote);

          if(node == trashnode)
          {
            // Empty Trash button (trash only)
            var trash = new Ext.menu.Item({text: _('Inventory.EmptyTrash')});
            trash.on('click', emptytrash, node);
            menu.add(trash);
          }
        }
        menu.showAt(ev.getXY());
      });

      tree.getEl().addKeyListener(46, function(key, e) {
        var node = tree.getSelectionModel().getSelectedNode();
        if(node)
        {
          e.stopEvent();
          inventorydelete(node);
        }
      });

      // Handle incoming inventory.
      AjaxLife.Network.MessageQueue.RegisterCallback('ObjectOffered', function(data) {
        if(inventory[data.ObjectID]) return;
        if(data.ObjectID != AjaxLife.Utils.UUID.Zero)
        {
          offers[data.ObjectID] = data;
          AjaxLife.Network.Send('FetchItem', {
            Item: data.ObjectID,
            Owner: gAgentID
          });
        }
      });

      AjaxLife.Network.MessageQueue.RegisterCallback('TaskItemReceived', function(data) {
        if(inventory[data.ItemID]) return;
        offers[data.ItemID] = {FromAgentName: 'An object'};
        AjaxLife.Network.Send('FetchItem', {
          Item: data.ItemID,
          Owner: gAgentID
        });
      });

      AjaxLife.Network.MessageQueue.RegisterCallback('ItemReceived', function(item) {
        if(inventory[item.UUID]) return;
        if(offers[item.UUID])
        {
          AjaxLife.Widgets.Modal.alert(_("Inventory.InventoryReceivedTitle"), _("Inventory.InventoryReceived", {
            from: offers[item.UUID].FromAgentName,
            name: item.Name,
            type: AjaxLife.Constants.Inventory.TypeNames[item.InventoryType]
          }));
          delete offers[item.UUID];
        }
        if(inventory[item.FolderID])
        {
          var folder = inventory[item.FolderID];
          if(folder.leaf || !folder.firstChild) return;
          var newnode = makeitem(item);
          inventory[item.UUID] = newnode;
          folder.insertBefore(newnode, folder.firstChild);
          newnode.ensureVisible();
          newnode.select();
        }
      });

      // Handle failed asset transfers. This seems like the best place for this to go.
      AjaxLife.Network.MessageQueue.RegisterCallback('NullTransfer', function(data) {
        AjaxLife.Widgets.Ext.msg("", _("Inventory.NullAssetTransfer"));
      });

      // Handle accepted/declined inventory offers.
      AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage',function(data) {
        if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.InventoryAccepted)
        {
          AjaxLife.Widgets.Ext.msg("", _("Inventory.OfferAccepted", {name: data.FromAgentName}));
        }
        else if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.InventoryDeclined)
        {
          AjaxLife.Widgets.Ext.msg("", _("Inventory.OfferDeclined", {name: data.FromAgentName}));
        }
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
    },
    removenode: function(node) {
      if(node && node.parentNode)
      {
        node.parentNode.removeChild(node);
      }
      if(node && node.attributes && inventory[node.attributes.UUID])
      {
        delete inventory[node.attributes.UUID];
      }
    },
    GetNode: function(inventoryid) {
      if(inventory[inventoryid])
      {
        return inventory[inventoryid];
      }
    }
  };
}();
