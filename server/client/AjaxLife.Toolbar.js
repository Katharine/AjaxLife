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

// Toolbar handler
AjaxLife.Toolbar = function() {
  // Private
  var contacts_btn = false;
  var log_btn = false;
  var map_btn = false;
  var chat_btn = false;
  var search_btn = false;
  var nearby_btn = false;
  var inventory_btn = false;
  var stats_btn = false;
  var audio_btn = false;
  var video_btn = false;

  // Toggle the IM window when its button is clicked.
  // AjaxLife.Fancy is checked to see whether we should animate this.
  function contacts_btn_clicked()
  {
    AjaxLife.Contacts.toggle(AjaxLife.Fancy?contacts_btn.getEl():null);
  }

  // Logout after prompting for confirmation.
  function log_btn_clicked()
  {
    AjaxLife.Widgets.Confirm(_("Toolbar.LogoutTitle"),_("Toolbar.LogoutPrompt"), function(btn) {
      if(btn == 'yes')
      {
        AjaxLife.Network.logout();
      }
    });
  }

  // Toggle the map window.
  function map_btn_clicked()
  {
    AjaxLife.Map.toggle(AjaxLife.Fancy?map_btn.getEl():null);
  }

  // Toggle the chat window
  function chat_btn_clicked()
  {
    AjaxLife.SpatialChat.toggle(AjaxLife.Fancy?chat_btn.getEl():null);
  }

  // Toggle the search window
  function search_btn_clicked()
  {
    AjaxLife.Search.toggle(AjaxLife.Fancy?search_btn.getEl():null);
  }
  // Toggle the nearby window
  function nearby_btn_clicked()
  {
    AjaxLife.AvatarsNear.toggle(AjaxLife.Fancy?nearby_btn.getEl():null);
  }
  // Toggle the inventory window
  function inventory_btn_clicked()
  {
    AjaxLife.Inventory.toggle(AjaxLife.Fancy?inventory_btn.getEl():null);
  }
  // Toggle the stats window
  function stats_btn_clicked()
  {
    AjaxLife.Stats.toggle(AjaxLife.Fancy?stats_btn.getEl():null);
  }
  // Toggle the Audio controls
  function audio_btn_clicked()
  {
    AjaxLife.Media.AudioToggle(AjaxLife.Fancy?audio_btn.getEl():null);
  }

  function video_btn_clicked()
  {
    AjaxLife.Media.VideoToggle(AjaxLife.Fancy?video_btn.getEl():null);
  }

  // Public
  return {
    init: function(div) {
      // Build lots of buttons.
      chat_btn = new Ext.Button(div, {
        handler: chat_btn_clicked,
        text: _("Toolbar.ChatButton")
      });
      contacts_btn = new Ext.Button(div, {
        handler: contacts_btn_clicked,
        text: _("Toolbar.ContactsButton")
      });
      map_btn = new Ext.Button(div, {
        handler: map_btn_clicked,
        text: _("Toolbar.MapButton")
      });
      search_btn = new Ext.Button(div, {
        handler: search_btn_clicked,
        text: _("Toolbar.SearchButton")
      });
      nearby_btn = new Ext.Button(div, {
        handler: nearby_btn_clicked,
        text: _("Toolbar.NearbyButton")
      });
      inventory_btn = new Ext.Button(div, {
        handler: inventory_btn_clicked,
        text: _("Toolbar.InventoryButton")
      });
      // This is disabled in IE because it doesn't work.
      stats_btn = new Ext.Button(div, {
        handler: stats_btn_clicked,
        text: _("Toolbar.StatsButton"),
        disabled: Prototype.Browser.IE
      });
      audio_btn = new Ext.Button(div, {
        handler: audio_btn_clicked,
        text: _("Toolbar.AudioButton"),
        hidden: true
      });
      video_btn = new Ext.Button(div, {
        handler: video_btn_clicked,
        text: _("Toolbar.VideoButton"),
        hidden: true
      });
      log_btn = new Ext.Button(div, {
        handler: log_btn_clicked,
        text: _("Toolbar.LogoutButton")
      });
    },
    HideVideo: function(hidden) {
      video_btn.setVisible(!hidden);
    },
    HideAudio: function(hidden) {
      audio_btn.setVisible(!hidden);
    }
  };
}();
