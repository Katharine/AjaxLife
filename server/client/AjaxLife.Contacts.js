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

AjaxLife.Contacts = function() {
  var win = false;
  var list_online = false;
  var list_offline = false;
  var list_groups = false;
  var tab_online = false;
  var tab_offline = false;
  var tab_groups = false;

  function build_ui()
  {
    // Build UI.
    win = new Ext.BasicDialog('dlg_contacts',{
      autoCreate: true,
      resizable: true,
      proxyDrag: !AjaxLife.Fancy,
      width: 250,
      height: 400,
      modal: false,
      shadow: true,
      title: _("Contacts.WindowTitle")
    });

    tab_online = win.getTabs().addTab("contacts-online-tab", _("Contacts.OnlineFriends"), "", false);
    tab_online.activate();
    list_online = new AjaxLife.Widgets.SelectList("contacts-online-list", tab_online.bodyEl.dom, {
      width: '99%',
      callback: function(key) {
        AjaxLife.InstantMessage.Start(key, false, true);
      }
    });

    tab_offline = win.getTabs().addTab("contacts-offline-tab", _("Contacts.OfflineFriends"), "", false);
    list_offline = new AjaxLife.Widgets.SelectList("contacts-offline-list", tab_offline.bodyEl.dom, {
      width: '99%',
      callback: function(key) {
        AjaxLife.InstantMessage.Start(key, false, true);
      }
    });

    tab_groups = win.getTabs().addTab("contacts-groups-tab", _("Contacts.Groups"), "", false);
    list_groups = new AjaxLife.Widgets.SelectList("contacts-groups-list", tab_groups.bodyEl.dom, {
      width: '99%',
      callback: function(key) {
        AjaxLife.InstantMessage.Start(key, true, true);
      }
    });
  }

  function set_callbacks()
  {
    // Callback when we have group data.
    AjaxLife.Groups.RegisterCallback(function(groups) {
      for(key in groups)
      {
        list_groups.add(key, groups[key].Name);
      }
      list_groups.sort();
    });

    // Deal with friend updates.
    var sortdelay = new Ext.util.DelayedTask(function() {
      list_online.sort();
      list_offline.sort();
    });
    // Deal with adding and removing friends to/from the friend list.
    var addname = function (friend) {
      if(friend.Online)
      {
        list_offline.remove(friend.ID);
        list_online.add(friend.ID, friend.Name);
      }
      else
      {
        list_online.remove(friend.ID);
        list_offline.add(friend.ID, friend.Name);
      }
      sortdelay.delay(200);
    };
    AjaxLife.Friends.AddStatusCallback(addname);
    AjaxLife.Friends.AddNewFriendCallback(addname);
  }

  return {
    init: function() {
      build_ui();
      set_callbacks();
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
