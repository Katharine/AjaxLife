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
 *     * This software must not be used to control nuclear weapons.
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

// This object stores open profiles. We use it to avoid doing things twice.
AjaxLife.ActiveProfileWindows = {};

AjaxLife.Profile = function(agentid) {
	// If the profile is open in another window, bail out.
	if(AjaxLife.ActiveProfileWindows[agentid])
	{
		AjaxLife.ActiveProfileWindows[agentid].focus();
		return;
	}
	// Private
	var win = false;
	var firstname = "";
	var lastname = "";
	var groups = [];
	var active = true;
	var tab_fl = false;
	var tab_sl = false;
	var tab_interests = false;
	// Init.
	// Create the window.
	win = new Ext.BasicDialog("dlg_profile_"+agentid, {
		width: '350px',
		height: '500px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("Profile.WindowTitle",{name: _("Profile.Loading")}),
		resizable: false,
		proxyDrag: !AjaxLife.Fancy
	});
	$(win.body.dom).addClassName("profile");
	AjaxLife.ActiveProfileWindows[agentid] = win;
	// When the window is closed, destroy it.
	win.on('hide', function() {
		AjaxLife.ActiveProfileWindows[agentid] = null;
		active = false;
		win.destroy(true);
	});
	// Create the tabs, then create lots and lots of elements in said tabs.
	// 2nd Life
	tab_sl = win.getTabs().addTab("profile_tab_"+agentid+"_2ndlife",_("Profile.SecondLife"));
	var div_name = Ext.get($(document.createElement('div')));
	div_name.setStyle({
		position: 'absolute',
		top: '5px',
		left: '5px'
	});
	div_name.dom.update(_("Profile.Name",{name: _("Profile.Loading")}));
	var img_sl = Ext.get($(document.createElement('div')));
	img_sl.setStyle({
		width: '181px',
		height: '136px',
		position: 'absolute',
		top: '25px',
		left: '5px',
		border: 'thin solid black'
	});
	var div_online = Ext.get($(document.createElement('div')));
	div_online.setStyle({
		position: 'absolute',
		top: '5px',
		left: '200px'
	});
	var div_born = Ext.get($(document.createElement('div')));
	div_born.setStyle({
		position: 'absolute',
		top: '30px',
		left: '200px',
		border: 'thin solid black'
	});
	div_born.dom.update(_("Profile.JoinDate"));
	var div_account = Ext.get($(document.createElement('div')));
	div_account.setStyle({
		position: 'absolute',
		top: '60px',
		left: '200px',
		border: 'thin solid black'
	});
	div_account.dom.update(_("Profile.Account"));
	var div_partner = Ext.get($(document.createElement('div')));
	div_partner.setStyle({
		position: 'absolute',
		top: '130px',
		left: '200px',
		border: 'thin solid black'
	});
	div_partner.dom.update(_("Profile.Partner"));
	var div_sl_about_label = Ext.get($(document.createElement('div')));
	div_sl_about_label.setStyle({
		position: 'absolute',
		top: '170px',
		left: '5px'
	});
	div_sl_about_label.update(_("Profile.About"));
	var div_sl_about = Ext.get($(document.createElement('div')));
	div_sl_about.setStyle({
		position: 'absolute',
		top: '185px',
		left: '5px',
		height: '70px',
		width: '320px',
		border: 'thin solid black',
		overflow: 'auto'
	});
	var div_groups_label = Ext.get($(document.createElement('div')));
	div_groups_label.setStyle({
		position: 'absolute',
		top: '260px',
		left: '5px'
	});
	div_groups_label.update(_("Profile.Groups"));
	var div_groups= Ext.get($(document.createElement('div')));
	div_groups.setStyle({
		position: 'absolute',
		top: '285px',
		left: '5px'
	});
	var list_groups = new AjaxLife.Widgets.SelectList('profile_'+agentid+'_groups',div_groups.dom, {
		width: '320px',
		height: '68px'
	});
	var btn_im = new Ext.Button(tab_sl.bodyEl.dom, {
		handler: function() {
			AjaxLife.InstantMessage.start(agentid);
			AjaxLife.InstantMessage.open(btn_im.getEl());
		},
		text: _("Profile.IMButton")
	});
	btn_im.getEl().setStyle({
		position: 'absolute',
		top: '360px',
		left: '10px'
	});
	// When this button is pressed, a dialog is popped up asking how much you wish to pay.
	// When the "OK" button is pressed, the payment is completed, after some sanity checking.
	var btn_pay = new Ext.Button(tab_sl.bodyEl.dom, {
		handler: function() {
			Ext.Msg.prompt(_("Profile.PayDialogTitle",{first: firstname, last: lastname}),_("Profile.PayDialogPrompt",{first: firstname, last: lastname}), function(btn, text) {
				if(btn == 'ok')
				{
					amount = parseInt(text.gsub(/[^0-9]/,''));
					if(amount > 0)
					{
						AjaxLife.Network.Send("SendAgentMoney", {Target: agentid, Amount: amount});
					}
					else
					{
						Ext.msg.alert("",_("Profile.InvalidAmount"));
					}
				}
			});
		},
		text: _("Profile.PayButton")
	});
	btn_pay.getEl().setStyle({
		position: 'absolute',
		top: '360px',
		left: '120px'
	});
	// The "add friend" button is only shown if this person isn't your friend already,
	// and you aren't viewing your own profile.
	if(gAgentID != agentid && !AjaxLife.Friends.IsFriend(agentid))
	{
		var btn_friend = new Ext.Button(tab_sl.bodyEl.dom, {
			handler: function() {
				// When this button is clicked, and the confirmation accepted, an OfferFriendship message
				// is sent, and a confirmation message shown.
				Ext.Msg.confirm("",_("Profile.ConfirmFriendAdd",{first: firstname, last: lastname}), function(btn) {
					if(btn == 'yes')
					{
						AjaxLife.Network.Send("OfferFriendship", {Target: agentid});
						AjaxLife.Widgets.Ext.msg("",_("Profile.FriendshipOffered", {first: firstname, last: lastname}));
					}
				});
			},
			text: _("Profile.FriendButton")
		});
		btn_friend.getEl().setStyle({
			position: 'absolute',
			top: '385px',
			left: '120px'
		});
	}
	// Shows a dialog asking what message they wish to send, then sends a 
	// teleport lure to the target.
	var btn_teleport = new Ext.Button(tab_sl.bodyEl.dom, {
		handler: function() {
			Ext.Msg.show({
				title: _("Profile.TeleportDialogTitle", {first: firstname, last: lastname}),
				msg: _("Profile.TeleportDialogPrompt",{first: firstname, last: lastname}),
				value: _("Profile.TeleportDefaultMessage", {sim: AjaxLife.Map.getpos().sim}),
				buttons: Ext.Msg.OKCANCEL,
				modal: true,
				prompt: true,
				closable: true,
				fn: function(btn, text) {
					if(btn == 'ok')
					{
						AjaxLife.Network.Send('SendTeleportLure', {
							Target: agentid, 
							Message: text
						});
					}
				}
			});
		},
		text: _("Profile.TeleportButton")
	});
	btn_teleport.getEl().setStyle({
		position: 'absolute',
		top: '385px',
		left: '10px'
	});
	var dd_inventory = $(document.createElement('div'));
	dd_inventory.setAttribute('id','dd_profile_'+agentid);
	dd_inventory.setStyle({
		top: '360px',
		left: '220px',
		position: 'absolute',
		height: '44px',
		width: '100px',
		backgroundColor: '#ddd',
		textAlign: 'center',
		paddingTop: 'auto',
		paddingBottom: 'auto',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: '#000',
		cursor: 'pointer'
	});
	dd_inventory.appendChild(document.createTextNode("Drop inventory here"));
	
	var dd_inventory_dd = new Ext.dd.DropTarget(dd_inventory, {
		ddGroup: "InventoryDD",
		copy: true,
		notifyDrop: function(dd, e, data) {
			var node = data.node;
			data = data.node.attributes;
			if(!node.leaf)
			{
				AjaxLife.Widgets.Ext.msg("",_("Inventory.NoFolderTransfer", {item: data.Name}));
				return false;
			}
			if(data.Permissions.OwnerMask & AjaxLife.Constants.Permissions.Transfer)
			{
				var confirmation = _("Inventory.ConfirmNoCopyTransfer", {item: data.Name, first: firstname, last: lastname});
				var cancopy = false;
				if(data.Permissions.OwnerMask & AjaxLife.Constants.Permissions.Copy)
				{
					confirmation = _("Inventory.ConfirmTransfer", {item: data.Name, first: firstname, last: lastname});
					cancopy = true;
				}
				Ext.Msg.confirm(_("Inventory.ConfirmTransferTitle"), confirmation,function(btn) {
					if(btn == 'yes')
					{
						AjaxLife.Network.Send("GiveInventory", {
							ItemID: data.UUID,
							ItemName: data.Name,
							AssetType: data.AssetType,
							Recipient: agentid
						});
						if(!cancopy)
						{
							AjaxLife.Inventory.removenode(node);
						}
					}
				});
				return true;
			}
			else
			{
				AjaxLife.Widgets.Ext.msg("",_("Inventory.NoNoTransferTransfer", {item: data.Name}));
				return false;
			}
		}
	});
	
	// Append...
	tab_sl.bodyEl.addClass("profile 2ndlife");
	tab_sl.bodyEl.dom.appendChild(div_name.dom);
	tab_sl.bodyEl.dom.appendChild(img_sl.dom);
	tab_sl.bodyEl.dom.appendChild(div_born.dom);
	tab_sl.bodyEl.dom.appendChild(div_online.dom);
	tab_sl.bodyEl.dom.appendChild(div_account.dom);
	tab_sl.bodyEl.dom.appendChild(div_partner.dom);
	tab_sl.bodyEl.dom.appendChild(div_sl_about_label.dom);
	tab_sl.bodyEl.dom.appendChild(div_sl_about.dom);
	tab_sl.bodyEl.dom.appendChild(div_groups_label.dom);
	tab_sl.bodyEl.dom.appendChild(div_groups.dom);
	tab_sl.bodyEl.dom.appendChild(dd_inventory);
	tab_sl.activate();
	// 1st Life
	tab_fl = win.getTabs().addTab("profile_tab_"+agentid+"_1stlife",_("Profile.FirstLife"));
	var div_img_fl = Ext.get($(document.createElement('div')));
	div_img_fl.setStyle({
		width: '200px',
		height: '200px',
		position: 'absolute',
		top: '5px',
		left: '5px',
		border: 'thin solid black'
	});
	var div_about_fl = Ext.get($(document.createElement('div')));
	div_about_fl.setStyle({
		position: 'absolute',
		top: '250px',
		left: '5px',
		height: '150px',
		width: '320px',
		border: 'thin solid black',
		overflow: 'auto'
	});
	var div_about_fl_label = Ext.get($(document.createElement('div')));
	div_about_fl_label.setStyle({
		position: 'absolute',
		top: '230px',
		left: '5px'
	});
	div_about_fl_label.dom.update(_("Profile.About"));
	// Append...
	tab_fl.bodyEl.addClass("profile 1stlife");
	tab_fl.bodyEl.dom.appendChild(div_img_fl.dom);
	tab_fl.bodyEl.dom.appendChild(div_about_fl.dom);
	tab_fl.bodyEl.dom.appendChild(div_about_fl_label.dom);
	
	// Interests
	// tab_interests = win.getTabs().addTab("profile_tab_"+agentid+"_skills",_("Profile.Interests")); // Meh.
	
	
	
	win.show();
	// Register our interest in the AvatarProperties message.
	// When it's received, update all the text boxes appropriately.
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarProperties", function(data) {
		if(!active || data.AvatarID != agentid) return;
		
		// 2nd Life
		new AjaxLife.Texture(img_sl.dom,181,136,data.ProfileImage,true);
		div_born.dom.update(_("Profile.JoinDate", {date: data.BornOn}));
		div_online.dom.update(_(data.Online?"Profile.Online":"Profile.Offline"));
		var payment = "";
		if(lastname == "Linden")
		{
			payment = _("Profile.LindenAccount");
		}
		else if(data.Identified && data.Transacted)
		{
			payment = _("Profile.PaymentInfoUsed");
		}
		else if(data.Identified)
		{
			payment = _("Profile.PaymentInfoOnFile");
		}
		else if(!data.Transacted)
		{
			payment = _("Profile.NoPaymentInfo");
		}
		div_account.dom.update(_("Profile.Account", {type: payment}));
		div_sl_about.dom.update(AjaxLife.Utils.FixText(data.AboutText));
		if(data.PartnerID == AjaxLife.Utils.UUID.Zero)
		{
			div_partner.dom.update(_("Profile.Partner", {partner: _("Profile.None")}));
		}
		else
		{
			AjaxLife.NameCache.Find(data.PartnerID, function(name) {
				div_partner.dom.update(_("Profile.Partner", {partner: name}));
			});
		}
		
		// 1st Life
		new AjaxLife.Texture(div_img_fl.dom,200,200,data.FirstLifeImage);
		div_about_fl.dom.update(AjaxLife.Utils.FixText(data.FirstLifeText));
	});
	
	// This isn't implemented yet.
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarInterests", function(data) {
		if(!active || data.AvatarID != agentid) return;
		
	});
	
	// When we receive the list of groups, just go through and add the list of 
	// names to the list. Someday we might implement more of this.
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarGroups", function(data) {
		if(!active || data.AvatarID != agentid) return;
		data.Groups.each(function(group) {
			list_groups.add(group.GroupID,group.GroupName);
		});
		
	});
	
	// Start up.
	// When we're created we need to work out the name of whoever owns the profile.
	// Once we've done so, we can get on with actually displaying it.
	AjaxLife.Debug("Profile: Looking up the name for "+agentid);
	AjaxLife.NameCache.Find(agentid,function(name) {
		win.setTitle(_("Profile.WindowTitle",{name: name}));
		div_name.dom.update(_("Profile.Name",{name: name}));
		name = name.split(' ');
		firstname = name[0];
		lastname = name[1];
		AjaxLife.Debug("Profile: Requesting agent data for "+agentid);
		AjaxLife.Network.Send('GetAgentData', {AgentID: agentid});
	});
	return {
		// Public
	};
};