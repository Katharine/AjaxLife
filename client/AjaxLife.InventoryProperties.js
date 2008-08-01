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

AjaxLife.ActiveInventoryDialogs.Properties = {};
AjaxLife.InventoryDialogs.Properties = function(data) {
	if(Prototype.Browser.IE)
	{
		alert("You are using Internet Explorer. IE is crap. Try again with something better.");
		return false;
	}
	var P = AjaxLife.Constants.Permissions;
	function updatepermissions()
	{
		var newperms = 0;
		if(check_nextownermod.checked) newperms |= P.Modify;
		if(check_nextownercopy.checked) newperms |= P.Copy;
		if(check_nextownertrans.checked) newperms |= P.Transfer;
		data.Permissions.NextOwnerMask = newperms;
		AjaxLife.Network.Send("UpdateItem", {
			ItemID: data.UUID,
			OwnerID: data.OwnerID,
			NextOwnerMask: newperms
		});
		AjaxLife.Debug("InventoryProperties: Transmitting new NextOwnerMask for "+data.UUID+" (\""+data.Name+"\"): "+newperms);
	}
	
	function changename()
	{
		var newname = input_name.value.strip();
		if(newname == '') return;
		var node = AjaxLife.Inventory.GetNode(data.UUID);
		if(!node) return;
		node.setText(newname);
		data.Name = newname;
		AjaxLife.Network.Send("UpdateItem", {
			ItemID: data.UUID,
			OwnerID: data.OwnerID,
			Name: newname
		});
		AjaxLife.Debug("InventoryProperties: Renaming "+data.UUID+" to \""+newname+"\"");
	}
	
	function changedesc()
	{
		var newdesc = input_description.value;
		data.Description = newdesc;
		AjaxLife.Network.Send("UpdateItem", {
			ItemID: data.UUID,
			OwnerID: data.OwnerID,
			Description: newdesc
		});
		AjaxLife.Debug("InventoryProperties: Changing description for "+data.UUID+" to \""+newdesc+"\"");
	}


	if(AjaxLife.ActiveInventoryDialogs.Properties[data.UUID])
	{
		AjaxLife.ActiveInventoryDialogs.Properties[data.UUID].focus();
		return;
	}

	var win = new Ext.BasicDialog("dlg_inv_properties_"+data.UUID, {
		width: 350,
		height: 320,
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Properties.Title", {name: data.Name}),
		resizable: false,
		proxyDrag: !AjaxLife.Fancy
	});

	AjaxLife.ActiveInventoryDialogs.Properties[data.UUID] = win;

	win.on('hide', function() {
		win.destroy(true);
		delete AjaxLife.ActiveInventoryDialogs.Properties[data.UUID];
	});

	$(win.body.dom).addClassName("properties");
	var label_name = $(document.createElement('div'));
	label_name.appendChild(document.createTextNode(_("InventoryDialogs.Properties.Name")));
	label_name.setStyle({
		position: 'absolute',
		top: '10px',
		left: '10px'
	});
	var input_name = $(document.createElement('input'));
	input_name.setStyle({
		position: 'absolute',
		top: '10px',
		left: '90px',
		width: '230px'
	});
	win.body.dom.appendChild(label_name);
	win.body.dom.appendChild(input_name);

	input_name.value = data.Name;

	// We can only change the name and description with modify permissions.
	if(data.Permissions.OwnerMask & P.Modify)
	{
		Ext.get(input_name).on('change', changename);
	}
	else
	{
		input_name.disable();
	}

	var label_description = $(document.createElement('div'));

	label_description.appendChild(document.createTextNode(_("InventoryDialogs.Properties.Description")));

	label_description.setStyle({
		position: 'absolute',
		top: '30px',
		left: '10px'
	});

	var input_description = $(document.createElement('input'));

	input_description.setStyle({
		position: 'absolute',
		top: '30px',
		left: '90px',
		width: '230px'
	});
	win.body.dom.appendChild(label_description);
	win.body.dom.appendChild(input_description);

	input_description.value = data.Description;

	if(data.Permissions.OwnerMask & P.Modify)
	{
		Ext.get(input_description).on('change', changedesc);
	}
	else
	{
		input_description.disable();
	}

	var label_owner = $(document.createElement('div'));
	label_owner.appendChild(document.createTextNode(_("InventoryDialogs.Properties.Owner")));
	label_owner.setStyle({
		position: 'absolute',
		top: '50px',
		left: '10px'
	});
	var value_owner = $(document.createElement('div'));
	AjaxLife.NameCache.Find(data.OwnerID, function(name) {
		value_owner.appendChild(document.createTextNode(name));
	});
	value_owner.setStyle({
		position: 'absolute',
		top: '50px',
		left: '90px'
	});
	win.body.dom.appendChild(label_owner);
	win.body.dom.appendChild(value_owner);
	var btn_owner = new Ext.Button(win.body.dom, {
		handler: function() {
			new AjaxLife.Profile(data.OwnerID);
		},
		text: _("InventoryDialogs.Properties.Profile")
	});
	
	btn_owner.getEl().setStyle({
		position: 'absolute',
		top: '48px',
		right: '25px'
	});

	var label_creator = $(document.createElement('div'));
	label_creator.appendChild(document.createTextNode(_("InventoryDialogs.Properties.Creator")));
	label_creator.setStyle({
		position: 'absolute',
		top: '75px',
		left: '10px'
	});
	var value_creator = $(document.createElement('div'));
	if(data.CreatorID == AjaxLife.Utils.UUID.Zero)
	{
		value_creator.appendChild(document.createTextNode(_("InventoryDialogs.Properties.Unknown")));
	}
	else
	{
		AjaxLife.NameCache.Find(data.CreatorID, function(name) {
			value_creator.appendChild(document.createTextNode(name));
		});
	}
	value_creator.setStyle({
		position: 'absolute',
		top: '75px',
		left: '90px'
	});
	win.body.dom.appendChild(label_creator);
	win.body.dom.appendChild(value_creator);
	
	var btn_creator = new Ext.Button(win.body.dom, {
		handler: function() {
			new AjaxLife.Profile(data.CreatorID);
		},
		text: _("InventoryDialogs.Properties.Profile"),
		disabled: (data.CreatorID == AjaxLife.Utils.UUID.Zero)
	});
	
	btn_creator.getEl().setStyle({
		position: 'absolute',
		top: '73px',
		right: '25px'
	});

	var label_ownercan = $(document.createElement('div'));
	label_ownercan.appendChild(document.createTextNode(_("InventoryDialogs.Properties.OwnerCan")));
	label_ownercan.setStyle({
		position: 'absolute',
		top: '95px',
		left: '10px'
	});
	win.body.dom.appendChild(label_ownercan);
	
	var check_ownermod = $(document.createElement('input'));

	win.body.dom.appendChild(check_ownermod);

	check_ownermod.setAttribute('type','checkbox');

	check_ownermod.disable();

	if(data.Permissions.OwnerMask & P.Modify)
	{
		check_ownermod.setAttribute('checked','checked');
	}

	check_ownermod.setStyle({
		position: 'absolute',
		top: '111px',
		left: '10px'
	});

	var label_ownermod = $(document.createElement('div'));
	win.body.dom.appendChild(label_ownermod);
	label_ownermod.appendChild(document.createTextNode(_("AssetPermissions.Modify")));
	label_ownermod.setStyle({
		position: 'absolute',
		top: '110px',
		left: '25px'
	});

	
	var check_ownercopy = $(document.createElement('input'));
	win.body.dom.appendChild(check_ownercopy);
	check_ownercopy.setAttribute('type','checkbox');
	check_ownercopy.disable();
	if(data.Permissions.OwnerMask & P.Copy)
	{
		check_ownercopy.setAttribute('checked','checked');
	}
	check_ownercopy.setStyle({
		position: 'absolute',
		top: '111px',
		left: '100px'
	});
	var label_ownercopy = $(document.createElement('div'));
	win.body.dom.appendChild(label_ownercopy);
	label_ownercopy.appendChild(document.createTextNode(_("AssetPermissions.Copy")));
	label_ownercopy.setStyle({
		position: 'absolute',
		top: '110px',
		left: '115px'
	});
	
	var check_ownertrans = $(document.createElement('input'));
	win.body.dom.appendChild(check_ownertrans);
	check_ownertrans.setAttribute('type','checkbox');
	check_ownertrans.disable();
	if(data.Permissions.OwnerMask & P.Transfer)
	{
		check_ownertrans.setAttribute('checked','checked');
	}
	check_ownertrans.setStyle({
		position: 'absolute',
		top: '111px',
		left: '190px'
	});
	var label_ownertrans = $(document.createElement('div'));
	win.body.dom.appendChild(label_ownertrans);
	label_ownertrans.appendChild(document.createTextNode(_("AssetPermissions.Transfer")));
	label_ownertrans.setStyle({
		position: 'absolute',
		top: '110px',
		left: '205px'
	});
	
	// We want to allow changing of these ones, but only under specific conditions.
	var label_nextownercan = $(document.createElement('div'));
	win.body.dom.appendChild(label_nextownercan);
	label_nextownercan.appendChild(document.createTextNode(_("InventoryDialogs.Properties.NextOwnerCan")));
	label_nextownercan.setStyle({
		position: 'absolute',
		top: '130px',
		left: '10px'
	});
	
	var check_nextownermod = $(document.createElement('input'));
	win.body.dom.appendChild(check_nextownermod);
	check_nextownermod.setAttribute('type','checkbox');
	if(data.Permissions.NextOwnerMask & P.Modify)
	{
		check_nextownermod.setAttribute('checked','checked');
	}
	else if(~data.Permissions.OwnerMask & P.Modify)
	{
		AjaxLife.Debug("IntentoryProperties: Modify disabled.");
		check_nextownermod.disable();
	}
	Ext.get(check_nextownermod).on('change', updatepermissions);
	check_nextownermod.setStyle({
		position: 'absolute',
		top: '146px',
		left: '10px'
	});
	var label_nextownermod = $(document.createElement('div'));
	win.body.dom.appendChild(label_nextownermod);
	label_nextownermod.appendChild(document.createTextNode(_("AssetPermissions.Modify")));
	label_nextownermod.setStyle({
		position: 'absolute',
		top: '145px',
		left: '25px'
	});
	var check_nextownercopy = $(document.createElement('input'));
	win.body.dom.appendChild(check_nextownercopy);
	check_nextownercopy.setAttribute('type','checkbox');
	if(data.Permissions.NextOwnerMask & P.Copy)
	{
		check_nextownercopy.setAttribute('checked','checked');
	}
	if((~data.Permissions.OwnerMask & P.Copy) || (~data.Permissions.NextOwnerMask & P.Transfer))
	{
		AjaxLife.Debug("IntentoryProperties: Copy disabled.");
		check_nextownercopy.disable();
	}
	Ext.get(check_nextownercopy).on('change', function() {
		if(check_nextownercopy.checked)
		{
			if(data.Permissions.OwnerMask & P.Transfer)
			{
				check_nextownertrans.enable();
			}
		}
		else
		{
			check_nextownertrans.checked = true;
			check_nextownertrans.disable();
		}
		updatepermissions();
	});
	check_nextownercopy.setStyle({
		position: 'absolute',
		top: '146px',
		left: '100px'
	});
	var label_nextownercopy = $(document.createElement('div'));
	win.body.dom.appendChild(label_nextownercopy);
	label_nextownercopy.appendChild(document.createTextNode(_("AssetPermissions.Copy")));
	label_nextownercopy.setStyle({
		position: 'absolute',
		top: '145px',
		left: '115px'
	});
	
	var check_nextownertrans = $(document.createElement('input'));
	win.body.dom.appendChild(check_nextownertrans);
	check_nextownertrans.setAttribute('type','checkbox');
	if(data.Permissions.NextOwnerMask & P.Transfer)
	{
		check_nextownertrans.setAttribute('checked','checked');
	}
	if((~data.Permissions.OwnerMask & P.Transfer) || (~data.Permissions.NextOwnerMask & P.Copy))
	{
		AjaxLife.Debug("IntentoryProperties: Transfer disabled.");
		check_nextownertrans.disable();
	}
	Ext.get(check_nextownertrans).on('change', function() {
		if(check_nextownertrans.checked)
		{
			if(data.Permissions.OwnerMask & P.Copy)
			{
				check_nextownercopy.enable();
			}
		}
		else
		{
			check_nextownercopy.checked = true;
			check_nextownercopy.disable();
		}
		updatepermissions();
	});
	check_nextownertrans.setStyle({
		position: 'absolute',
		top: '146px',
		left: '190px'
	});
	var label_nextownertrans = $(document.createElement('div'));
	win.body.dom.appendChild(label_nextownertrans);
	label_nextownertrans.appendChild(document.createTextNode(_("AssetPermissions.Transfer")));
	label_nextownertrans.setStyle({
		position: 'absolute',
		top: '145px',
		left: '205px'
	});

	
	win.show();

}