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
 
AjaxLife.Media = function() {
	var videodialog = false;
	var audiodialog = false;
	var videodiv = false;
	var audiodiv = false;
	var enabled = false;
	var currentaudio = "";
	var currentvideo = "";
	
	
	// Returns TRUE if QuickTime is available, FALSE otherwise.
	function qtinstalled()
	{
		return QTObject.prototype.isQTInstalled();
	}
	
	function makevideourl(url)
	{
		var newurl = url;
		var parts = url.split('//',2);
		var protocol = parts[0];
		parts = parts[1].split('/',2);
		var server = parts[0];
		var path = parts[1] ? parts[1] : '';
		if(url.substr(0,4) == "rstp" || url.substr(0,3) == "rtp")
		{
			newurl = "makefile.kat?type=video/quicktime&content="+escape("RTSPtextRTSP://"+server+"/"+path);
		}
		return newurl;
	}
	
	function makeaudiourl(url)
	{
		return "makefile.kat?type=audio/x-mpegurl&content="+escape(url);
	}
	
	function clearaudio()
	{
		audiodialog.hide();
		if(audiodiv.firstChild) audiodiv.removeChild(audiodiv.firstChild);
		AjaxLife.Toolbar.HideAudio(true);
	}
	
	function clearvideo()
	{
		videodialog.hide();
		if(videodiv.firstChild) videodiv.removeChild(videodiv.firstChild);
		AjaxLife.Toolbar.HideVideo(true);
	}
	
	function checkmedia(details)
	{
		AjaxLife.Debug("Parcel: checkmedia called. MusicURL: "+details.MusicURL+", MediaURL: "+details.MediaURL);
		if(details.MusicURL != currentaudio)
		{
			currentaudio = details.MusicURL;
			if(details.MusicURL == '')
			{
				AjaxLife.Debug("Media: Clearing audio.");
				clearaudio();
			}
			else
			{
				var url = makeaudiourl(details.MusicURL);
				AjaxLife.Debug("Media: Audio: Using QT. URL: "+url);
				AjaxLife.Toolbar.HideAudio(false);
				if(audiodiv.firstchild) audiodiv.removeChild(audiodiv.firstChild);
				var qt = new QTObject(url, "100%", "100%");
				qt.addParam("controller","true");
				qt.addParam("autoplay","false");
				qt.write(audiodiv);
			}
		}
		else
		{
			AjaxLife.Debug("Media: Audio unchanged.");
		}
		
		if(details.MediaURL != currentvideo)
		{
			currentvideo = details.MediaURL;
			if(details.MediaURL == '')
			{
				AjaxLife.Debug("Media: Clearing video.");
				clearvideo();
			}
			else
			{
				AjaxLife.Toolbar.HideVideo(false);
				if(videodiv.firstChild) videodiv.removeChild(videodiv.firstChild);
				var mime = details.MediaType.split('/',2);
				var url = details.MediaURL;
				var qt = false;
				if(mime[0] == "video")
				{
					url = makevideourl(url);
					qt = true;
				}
				else if(mime[0] == "audio")
				{
					url = makeaudiourl(url);
					qt = true;
				}
				else if(mime[0] == "image")
				{
					var img = $(document.createElement('img'));
					img.setAttribute('src',url);
					img.setStyle({height: '100%', width: '100%'});
					videodiv.appendChild(img);
					AjaxLife.Debug("Media: Video: Using img. URL: "+url);
				}
				else
				{
					AjaxLife.Debug("Media: Video: Ignoring unknown mimetype "+details.MediaType);
					clearvideo(); // Undecided on what to do about HTML links,  so meh to them.
				}
				if(qt)
				{
					AjaxLife.Debug("Media: Video: Using QT. URL: "+url);
					qt = new QTObject(url, "100%", "100%");
					qt.addParam("controller","true");
					qt.addParam("autoplay","false");
					qt.addParam("scale","aspect");
					qt.write(videodiv);
				}
			}
		}
		else
		{
			AjaxLife.Debug("Media: Video unchanged.");
		}
	}
	
	return {
		init: function() {
			enabled = qtinstalled();
			if(enabled)
			{
				AjaxLife.Debug("Media: QT found, enabling.");
				// Window for videos.
				videodialog = new Ext.BasicDialog("dlg_media_video", {
					width: '416px',
					height: '356px',
					modal: false,
					shadow: true,
					autoCreate: true,
					title: _("Media.VideoTitle"),
					proxyDrag: !AjaxLife.Fancy
				});
				videodiv = document.createElement('div');
				$(videodiv).setStyle({'height': '100%', 'width': '100%', overflow: 'hidden'});
				$(videodialog.body.dom).setStyle({overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden'}).appendChild(videodiv);
				
				// Window for audio
				audiodialog = new Ext.BasicDialog("dlg_media_audio", {
					width: '216px',
					height: '56px',
					modal: false,
					shadow: true,
					autoCreate: true,
					resizable: false,
					title: _("Media.AudioTitle"),
					proxyDrag: !AjaxLife.Fancy
				});
				audiodiv = document.createElement('div');
				$(audiodiv).setStyle({'height': '100%', 'width': '100%', overflow: 'hidden'});
				$(audiodialog.body.dom).setStyle({overflow: 'hidden', overflowX: 'hidden', overflowY: 'hidden'}).appendChild(audiodiv);
				
				// Listen for changes to the parcel details.
				AjaxLife.Parcel.OnParcelChange(checkmedia);
			}
			else
			{
				AjaxLife.Debug("Media: QT missing, disabling.");
			}
		},
		VideoToggle: function(elem) {
			if(videodiv.firstChild)
			{
				if(videodialog.isVisible())
				{
					videodialog.hide();
				}
				else
				{
					videodialog.show(elem);
				}
			}
		},
		AudioToggle: function(elem) {
			if(audiodiv.firstChild)
			{
				if(audiodialog.isVisible())
				{
					audiodialog.hide();
				}
				else
				{
					audiodialog.show(elem);
				}
			}
		}
	};
}();
