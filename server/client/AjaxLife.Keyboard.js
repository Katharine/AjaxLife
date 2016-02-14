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

// Handle keyboard shortcuts.
AjaxLife.Keyboard = function() {

  var enabled = false;

  function handlekeyboard(key, e)
  {
    if(!AjaxLife.Initialised || !AjaxLife.Network.Connected || !enabled) return;
    AjaxLife.Debug("Keyboard: Got keycode "+key);
    e.preventDefault();
    switch(key)
    {
      case 72: // h
        if(e.shiftKey)
        {
          if(e.altKey)
          {
            AjaxLife.SpatialChat.systemmessage("hippos!");
          }
          else
          {
            AjaxLife.Map.GoHome();
          }
        }
        else
        {
          AjaxLife.SpatialChat.toggle();
        }
        break;
      case 73: // i
        AjaxLife.Inventory.toggle();
        break;
      case 70: // f
        AjaxLife.Search.toggle();
        break;
      case 77: // m
        AjaxLife.Map.toggle();
        break;
      case 81: // q
        // This is duplicated in AjaxLife.Toolbar.js. Should move these both somewhere nice - but where?
        // If this is no longer duplicated in AjaxLife.Toolbar.js, it's either wrong, broken or both.
        AjaxLife.Widgets.Confirm(_("Toolbar.LogoutTitle"),_("Toolbar.LogoutPrompt"), function(btn) {
          if(btn == 'yes')
          {
            AjaxLife.Network.logout();
          }
        });
        break;
      case 49: // 1
        if(!Prototype.Browser.IE) AjaxLife.Stats.toggle(); // Should we stop checking for IE and check for something else?
        break;
      case 83: // s
        AjaxLife.Sound.Toggle();
        break;
    }
  }

  function blocktab(key, e)
  {
    if(enabled) return; // This is not a typo. Keyboard enabled = block disabled.
    e.preventDefault();
  }

  return {
    init: function() {
      var body = Ext.get(document.body);
      body.addKeyListener(
        {
          //   [h , i , f , m , q ]
          key: [72, 73, 70, 77, 81],
          ctrl: true,
          shift: false,
          alt: false
        },
        handlekeyboard
      );
      body.addKeyListener(
        {
          //   [1 , s ]
          key: [49, 83],
          ctrl: true,
          shift: true,
          alt: false
        },
        handlekeyboard
      );
      body.addKeyListener(
        {
          //   tab
          key: 9
        },
        blocktab
      );
      enabled = true;
    },
    disable: function() {
      enabled = false;
    },
    enable: function() {
      enabled = true;
    }
  }
}();
