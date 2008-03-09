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

function handlekeyboard(key, e)
{
	if(!AjaxLife.Initialised || !AjaxLife.Network.Connected) return;
	AjaxLife.Debug("Keyboard: Got keycode "+key);
	e.preventDefault();
	switch(key)
	{
	case 72:
		AjaxLife.SpatialChat.toggle();
		break;
	case 73:
		AjaxLife.Inventory.toggle();
		break;
	case 84:
		AjaxLife.InstantMessage.toggle();
		break;
	case 70:
		AjaxLife.Search.toggle();
		break;
	case 77:
		AjaxLife.Map.toggle();
		break;
	case 81:
		AjaxLife.Widgets.Confirm(_("Toolbar.LogoutTitle"),_("Toolbar.LogoutPrompt"), function(btn) {
			if(btn == 'yes')
			{
				AjaxLife.Network.logout();
			}
		});
		break;
	case 49:
		if(!Prototype.Browser.IE) AjaxLife.Stats.toggle();
	}
}

// Handle keyboard shortcuts.
AjaxLife.Keyboard = function() {
	return {
		init: function() {
			Ext.get(document.body).addKeyListener({
				//   [h , i , t , f , m , q ]
				key: [72, 73, 84, 70, 77, 81],
				ctrl: true,
				shift: false,
				alt: false
				}, handlekeyboard
			);
			Ext.get(document.body).addKeyListener({
					//   1
					key: 49,
					ctrl: true,
					shift: true,
					alt: false
				}, handlekeyboard
			);
		}
	}	
}();