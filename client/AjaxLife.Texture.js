/* Copyright (c) 2007, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *	   * Redistributions of source code must retain the above copyright
 *		 notice, this list of conditions and the following disclaimer.
 *	   * Redistributions in binary form must reproduce the above copyright
 *		 notice, this list of conditions and the following disclaimer in the
 *		 documentation and/or other materials provided with the distribution.
 *	   * Neither the name of Katharine Berry nor the names of any contributors
 *		 may be used to endorse or promote products derived from this software
 *		 without specific prior written permission.
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
 
AjaxLife.Texture = function(parent, width, height, texture) {
	var callbackid = 0;
	var elem;
	var loaded = false;
	
	function replaceimage(src)
	{
		var img = new Image();
		img.onload = function() {
			elem.setStyle({
				paddingLeft: '0px',
				paddingRight: '0px',
				paddingTop: '0px',
				paddingBottom: '0px',
				width: width+'px',
				height: height+'px'
			}).setAttribute('src',src);
			loaded = true;
			img.onload = function(){};
		}
		img.src = src;
	}
	
	// Add the spinny image.
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
	if(texture == AjaxLife.Utils.UUID.Zero)
	{
		replaceimage(AjaxLife.STATIC_ROOT+'images/noimage.png');
		return;
	}
	callbackid = AjaxLife.Network.MessageQueue.RegisterCallback('ImageDownloaded', function(data) {
		if(data.UUID == texture)
		{
			AjaxLife.Network.MessageQueue.UnregisterCallback('ImageDownloaded', callbackid);
			if(data.Success)
			{
				replaceimage(data.URL);
			}
			else
			{
				replaceimage(AjaxLife.STATIC_ROOT+'images/noimage.png');
				AjaxLife.Widgets.Ext.msg("",_("Texture.DownloadFailed"));
			}
		}
	});
	AjaxLife.Network.Send("RequestTexture", {
		ID: texture,
		callback: function(data) {
			if(data.Ready)
			{
				replaceimage(data.URL);
				AjaxLife.Network.MessageQueue.UnregisterCallback('ImageDownloaded', callbackid);
			}
		}
	});
	
	return {
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