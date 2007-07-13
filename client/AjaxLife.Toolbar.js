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

// Toolbar handler
AjaxLife.Toolbar = function() {
	// Private
	var im_btn = false;
	var log_btn = false;
	var map_btn = false;
	var chat_btn = false;
	
	function im_btn_clicked()
	{
		AjaxLife.InstantMessage.toggle(im_btn.getEl());
	}
	
	function log_btn_clicked()
	{
		AjaxLife.Widgets.Confirm(_("Toolbar.LogoutTitle"),_("Toolbar.LogoutPrompt"), function(btn) {
			if(btn == 'yes')
			{
				AjaxLife.Network.logout();
			}
		});
	}
	
	function map_btn_clicked()
	{
		AjaxLife.Map.toggle(map_btn.getEl());
	}
	
	function chat_btn_clicked()
	{
		AjaxLife.SpatialChat.toggle(chat_btn.getEl());
	}
	
	// Public
	return {
		init: function(div) {
			chat_btn = new Ext.Button(div, {
				handler: chat_btn_clicked,
				text: _("Toolbar.ChatButton"),
				tooltip: _("Toolbar.ChatTooltip")
			});
			im_btn = new Ext.Button(div, {
				handler: im_btn_clicked,
				text: _("Toolbar.IMButton"),
				tooltip: _("Toolbar.IMTooltip")
			});
			map_btn = new Ext.Button(div, {
				handler: map_btn_clicked,
				text: _("Toolbar.MapButton"),
				tooltip: _("Toolbar.MapTooltip")
			});
			log_btn = new Ext.Button(div, {
				handler: log_btn_clicked,
				text: _("Toolbar.LogoutButton"),
				tooltip: _("Toolbar.LogoutTooltip")
			});
		}
	};
}();