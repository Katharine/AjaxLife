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

AjaxLife.Profile = function(agentid) {
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
	win = new Ext.BasicDialog("dlg_profile_"+agentid, {
		width: '350px',
		height: '500px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("Profile.WindowTitle",{name: _("Profile.Loading")}),
		resizable: false
	});
	win.on('hide', function() {
		active = false;
		win.destroy(true);
	});
	// 2nd Life
	tab_sl = win.getTabs().addTab("profile_tab_"+agentid+"_2ndlife",_("Profile.SecondLife"));
	var div_name = Ext.get($(document.createElement('div')));
	div_name.setStyle({
		position: 'absolute',
		top: '5px',
		left: '5px'
	});
	div_name.dom.update(_("Profile.Name",{name: _("Profile.Loading")}));
	img_sl = Ext.get($(document.createElement('img')));
	img_sl.dom.setAttribute('src',AjaxLife.STATIC_ROOT+'images/noimage.png');
	img_sl.setStyle({
		width: '181px',
		height: '136px',
		position: 'absolute',
		top: '25px',
		left: '5px',
		border: 'thin solid black'
	});
	div_online = Ext.get($(document.createElement('div')));
	div_online.setStyle({
		position: 'absolute',
		top: '5px',
		left: '200px'
	});
	div_born = Ext.get($(document.createElement('div')));
	div_born.setStyle({
		position: 'absolute',
		top: '30px',
		left: '200px',
		border: 'thin solid black'
	});
	div_born.dom.update(_("Profile.JoinDate"));
	div_account = Ext.get($(document.createElement('div')));
	div_account.setStyle({
		position: 'absolute',
		top: '60px',
		left: '200px',
		border: 'thin solid black'
	});
	div_account.dom.update(_("Profile.Account"));
	div_partner = Ext.get($(document.createElement('div')));
	div_partner.setStyle({
		position: 'absolute',
		top: '100px',
		left: '200px',
		border: 'thin solid black'
	});
	div_partner.dom.update(_("Profile.Partner"));
	div_sl_about_label = Ext.get($(document.createElement('div')));
	div_sl_about_label.setStyle({
		position: 'absolute',
		top: '170px',
		left: '5px',
	});
	div_sl_about_label.update(_("Profile.About"));
	div_sl_about= Ext.get($(document.createElement('div')));
	div_sl_about.setStyle({
		position: 'absolute',
		top: '185px',
		left: '5px',
		height: '70px',
		width: '320px',
		border: 'thin solid black',
		overflow: 'auto'
	});
	div_groups_label = Ext.get($(document.createElement('div')));
	div_groups_label.setStyle({
		position: 'absolute',
		top: '260px',
		left: '5px',
	});
	div_groups_label.update(_("Profile.Groups"));
	div_groups= Ext.get($(document.createElement('div')));
	div_groups.setStyle({
		position: 'absolute',
		top: '285px',
		left: '5px'
	});
	list_groups = new AjaxLife.Widgets.SelectList('profile_'+agentid+'_groups',div_groups.dom, {
		width: '320px',
		height: '68px'
	});
	btn_im = new Ext.Button(tab_sl.bodyEl.dom, {
		handler: function() {
			AjaxLife.InstantMessage.start(agentid);
			AjaxLife.InstantMessage.open(btn_im.getEl());
		},
		text: _("Profile.IMButton")
	});
	btn_im.getEl().setStyle({
		position: 'absolute',
		top: '380px',
		left: '10px'
	});
	// Append...
	tab_sl.bodyEl.addClass("profile-2ndlife");
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
	tab_sl.activate();
	
	// 1st Life
	tab_fl = win.getTabs().addTab("profile_tab_"+agentid+"_1stlife",_("Profile.FirstLife"));
	
	
	// Interests
	tab_interests = win.getTabs().addTab("profile_tab_"+agentid+"_skills",_("Profile.Interests"));
	
	
	
	win.show();
	
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarProperties", function(data) {
		if(!active || data.AvatarID != agentid) return;
		if(data.ProfileImage != AjaxLife.Utils.UUID.Zero)
		{
			img_sl.dom.setAttribute('src','textures/'+data.ProfileImage+'.png?sid='+gSessionID);
		}
		div_born.dom.update(_("Profile.JoinDate", {date: data.BornOn}));
		div_online.dom.update(_(data.Online?"Profile.Online":"Profile.Offline"));
		var payment = "";
		if(data.Identified && data.Transacted)
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
	});
	
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarInterests", function(data) {
		if(!active || data.AvatarID != agentid) return;
		
	});
	
	AjaxLife.Network.MessageQueue.RegisterCallback("AvatarGroups", function(data) {
		if(!active || data.AvatarID != agentid) return;
		data.Groups.each(function(group) {
			list_groups.add(group.GroupID,group.GroupName);
		});
		
	});
	
	// Start up.
	AjaxLife.NameCache.Find(agentid,function(name) {
		win.setTitle(_("Profile.WindowTitle",{name: name}));
		div_name.dom.update(_("Profile.Name",{name: name}));
		name = name.split(' ');
		firstname = name[0];
		lastname = name[1];
		AjaxLife.Network.Send('GetAgentData', {AgentID: agentid});
	});
	return {
		// Public
	};
};