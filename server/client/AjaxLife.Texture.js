/* Copyright (c) 2007, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *     may be used to endorse or promote products derived from this software
 *     without specific prior written permission.
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

AjaxLife.Texture = function(parent, width, height, texture, slsearch, forceslsearch, onloadcallback) {
  var callbackid = 0;
  var elem;
  var loaded = false;

  // This function resets the borders and sets the real image at the requested
  // size.
  function replaceimage(src)
  {
    elem.onload = function() {
      elem.setStyle({
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
        width: width+'px',
        height: height+'px'
      });
      loaded = true;
      if(typeof(onloadcallback) == 'function')
      {
        try
        {
          onloadcallback();
        }
        catch(e)
        {
          //
        }
      }
    }
    elem.setAttribute('src',src);
  }

  // This creates a spinner to indicate that something's happening.
  // It's a 32x32 image, but we pad it to ensure it ends up in the center of the
  // area specified, and also to ensure that we used this space.
  elem = $(document.createElement('img'));
  elem.setStyle({
    width: '32px',
    height: '32px',
    paddingLeft: (width/2-16)+'px',
    paddingRight: (width/2-16)+'px',
    paddingTop: (height/2-16)+'px',
    paddingBottom: (height/2-16)+'px'
  }).setAttribute('src',AjaxLife.STATIC_ROOT+'images/loader.gif');
  $(parent).appendChild(elem);
  // If the UUID is null, we just stick the no-image image up.
  if(texture == AjaxLife.Utils.UUID.Zero)
  {
    AjaxLife.Debug("Texture: Replacing null image with default texture");
    replaceimage(AjaxLife.STATIC_ROOT+'images/noimage.png');
  }
  else
  {
    if(slsearch && (forceslsearch || (width <= 320 && height <= 240)))
    {
      AjaxLife.Debug("Texture: Using SL Search image for "+texture);
      replaceimage("http://secondlife.com/app/image/"+texture+"/2");
    }
    else
    {
      // Callback so we know when the image is downloaded, and what its URL is.
      callbackid = AjaxLife.Network.MessageQueue.RegisterCallback('ImageDownloaded', function(data) {
        if(data.UUID == texture)
        {
          AjaxLife.Network.MessageQueue.UnregisterCallback('ImageDownloaded', callbackid);
          if(data.Success)
          {
            AjaxLife.Debug("Texture: Successfully downloaded "+data.UUID);
            replaceimage(data.URL);
          }
          else
          {
            AjaxLife.Debug("Texture: Downloading "+data.UUID+" failed");
            replaceimage(AjaxLife.STATIC_ROOT+'images/noimage.png');
            AjaxLife.Widgets.Ext.msg("",_("Texture.DownloadFailed"));
          }
        }
      });

      AjaxLife.Debug("Texture: Requesting "+texture);
      AjaxLife.Network.Send("RequestTexture", {
        ID: texture,
        callback: function(data) {
          if(data.Ready)
          {
            AjaxLife.Debug("Texture: "+texture+" was pre-cached; using cached image.");
            replaceimage(data.URL);
            AjaxLife.Network.MessageQueue.UnregisterCallback('ImageDownloaded', callbackid);
          }
        }
      });
    }
  }

  return {
    // Just resizes the image. This is used by the texture dialog.
    // If it's loaded we just alter the width and height, otherwise the
    // padding.
    resize: function(x, y) {
      width = x;
      height = y;
      if(loaded)
      {
        elem.setStyle({width: width+'px', height: height+'px'});
      }
      else
      {
        elem.setStyle({
          paddingLeft: (width/2-16)+'px',
          paddingRight: (width/2-16)+'px',
          paddingTop: (height/2-16)+'px',
          paddingBottom: (height/2-16)+'px'
        });
      }
    }
  };
};

// Texture display.

AjaxLife.ActiveInventoryDialogs.Texture = {};
AjaxLife.InventoryDialogs.Texture = function(textureid, name) {
  // If the requested texture is already being displayed, just focus the window.
  if(AjaxLife.ActiveInventoryDialogs.Texture[textureid])
  {
    AjaxLife.ActiveInventoryDialogs.Texture[texture].focus();
    return;
  }
  // Private
  var texture = false;
  var win = false;

  // Create window - internal dimensions are 256x256
  win = new Ext.BasicDialog("dlg_texture_"+textureid, {
    width: '272px',
    height: '292px',
    modal: false,
    shadow: true,
    autoCreate: true,
    title: _("InventoryDialogs.Texture.WindowTitle",{name: name}),
    resizable: true,
    proxyDrag: !AjaxLife.Fancy
  });
  win.body.setStyle({
    padding: '0px',
    margin: '0px',
    overflow: 'hidden'
  });
  // Log the existence of this window
  AjaxLife.ActiveInventoryDialogs.Texture[textureid] = win;
  // Remove this window when it's closed.
  win.on('hide', function() {
    delete AjaxLife.ActiveInventoryDialogs.Texture[textureid];
    win.destroy(true);
  });

  // Create new texture object at 256x256.
  texture = new AjaxLife.Texture(win.body.dom, 256, 256, textureid, false, false, function() {
    win.body.setStyle({
      backgroundImage: 'url('+AjaxLife.STATIC_ROOT+'images/transparency.gif)'
    });
  });
  // Resize the texture when the window is resized, ensuring it always fills the window.
  win.on('resize', function(thewin, width, height) {
    texture.resize(width - 16, height - 36);
  });

  win.show();
};
