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
 
// Container object for the dialogs.
AjaxLife.InventoryDialogs = {};

// Used to note dialogs already open - used to avoid opening things twice.
// This is bad because the ids are unique per object, not per window.
AjaxLife.ActiveInventoryDialogs = {};

// Texture display
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
		AjaxLife.ActiveInventoryDialogs.Texture[textureid] = false;
		win.destroy(true);
	});
	
	// Create new texture object at 256x256.
	texture = new AjaxLife.Texture(win.body.dom, 256, 256, textureid);
	// Resize the texture when the window is resized, ensuring it always fills the window.
	win.on('resize', function(thewin, width, height) {
		texture.resize(width - 16, height - 36);
	});
	
	win.show();
};

// Used to display notecards.
//TODO: Consider splitting this out into two classes - one for handling notecard
//decoding, annother for actually displaying it, a'la the Texture dialog.
AjaxLife.ActiveInventoryDialogs.Notecard = {};
AjaxLife.InventoryDialogs.Notecard = function(notecardid, inventoryid, name) {
	// If this window already exists, focus it and quit.
	if(AjaxLife.ActiveInventoryDialogs.Notecard[notecardid])
	{
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid].focus();
		return;
	}
	var notecard = false;
	var win = false;
	var callback = false;
	// Create the window.
	win = new Ext.BasicDialog("dlg_notecard_"+notecardid, {
		width: '500px',
		height: '520px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Notecard.WindowTitle",{name: name}),
		resizable: true,
		proxyDrag: !AjaxLife.Fancy
	});
	var style = {};
	// For reasons I don't understand, this breaks IE.
	// As such. we omit it if you're using IE. Sorry.
	// I doubt you'll mind the lack of an artfully shaded box.
	//TODO: Try and find a workaround.
	if(!Prototype.Browser.IE)
	{
		style.backgroundColor = 'grey';
	}
	// Set up the window with initial data and note its existence.
	$(win.body.dom).setStyle(style).addClassName('notecard').update('Loading notecard, please wait...');
	AjaxLife.ActiveInventoryDialogs.Notecard[notecardid] = win;
	// When the window is closed, destroy it and unregister the event handlers.
	win.on('hide', function() {
		AjaxLife.ActiveInventoryDialogs.Notecard[notecardid] = false;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.destroy(true);
	});
	
	// Register a callback for the AssetReceived callback.
	callback = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function(data) {
		// Bail out if this isn't what we were waiting for.
		if(data.AssetID != notecardid) return;
		// Unregister it - we aren't going to receive more than one, so leaving it registered
		// is a waste of CPU time.
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		// This parses the Linden notecard format.
		var text = data.AssetData;
		// This is the number of items we're expecting.
		// We don't actually use this for anything, yet.
		var count = text.match(/count ([0-9]+?)/)[0];
		var stack = -1;
		// loop through until we reach the the end of the embedded blocks.
		// This isn't particularly efficient, but these headers are always fairly short,
		// so it doesn't really matter.
		var i;
		for(i = 0; i < text.length; ++i)
		{
			var char = text.substr(i,1);
			if(char == '{')
			{
				++stack;
			}
			else if(char == '}')
			{
				--stack;
				if(stack <= 0)
				{
					break;
				}
			}
		}
		// Cut off everything past that point.
		text = text.substr(i+1);
		// Work out how many characters we expect.
		// Note that this number seems to be somewhat off, so we ignore it and proceed to
		// just take the whole thing minus the last character.
		var length = text.match(/Text length ([0-9]+)/)[0].strip();
		text = text.replace(/Text length ([0-9]+)\w/,'').strip();
		text = text.substr(0,text.length - 1);
		// Put the text into the window, replacing the placeholder.
		// Oddly, IE doesn't mind the backgroundColor here.
		//TODO: Figure out why IE likes this and not the previous attempt.
		win.body.dom.update(AjaxLife.Utils.FixText(text)).setStyle({backgroundColor: 'white'});
	});
	
	// Actually download the texture.

	AjaxLife.Network.Send('RequestAsset', {
		AssetID: notecardid,
		InventoryID: inventoryid,
		OwnerID: gAgentID,
		AssetType: AjaxLife.Constants.Inventory.InventoryType.Notecard
	});
	// Display the thing.
	win.show();
};

// This is used for scripts. It's only slightly different from the notecards
// in general principle, but includes a syntax highligher. Additionally, we
// don't need to decode scripts - we already get the text without any decoding.
AjaxLife.ActiveInventoryDialogs.Script = {};
AjaxLife.InventoryDialogs.Script = function(inventoryid, name) {
	// Check if this is already open; focus it and bail out if so.
	if(AjaxLife.ActiveInventoryDialogs.Script[inventoryid])
	{
		AjaxLife.ActiveInventoryDialogs.Script[inventoryid].focus();
		return;
	}
	var win = false;
	var callback = false;
	var transferid = AjaxLife.Utils.UUID.Zero;
	
	// Create the window.
	win = new Ext.BasicDialog("dlg_script_"+inventoryid, {
		width: '500px',
		height: '520px',
		modal: false,
		shadow: true,
		autoCreate: true,
		title: _("InventoryDialogs.Script.WindowTitle",{name: name}),
		resizable: true,
		proxyDrag: !AjaxLife.Fancy
	});
	var style = {};
	// Disabled in IE. See Notecard object for reasons.
	if(!Prototype.Browser.IE)
	{
		style.backgroundColor = 'grey';
	}
	// Set the thing up.
	$(win.body.dom).setStyle(style).addClassName('script').update('Loading script, please wait...');
	AjaxLife.ActiveInventoryDialogs.Script[inventoryid] = win;
	// Destroy and unregister on closing the window.
	win.on('hide', function() {
	
		AjaxLife.ActiveInventoryDialogs.Script[inventoryid] = false;
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		win.destroy(true);
	});
	// Set up callback for receiving the script.
	callback = AjaxLife.Network.MessageQueue.RegisterCallback('AssetReceived', function(data) {
		// Ignore it if it's not ours.
		if(data.TransferID != transferid) return;
		// Unregister the callback, since we don't need it any more.
		AjaxLife.Network.MessageQueue.UnregisterCallback('AssetReceived', callback);
		// Highlight and display the script. (Highlight function is further down in this file)
		win.body.dom.update(AjaxLife.HighlightLSL(data.AssetData)).setStyle({backgroundColor: 'white'});
	});
	
	// Request the aset download.
	AjaxLife.Network.Send('RequestAsset', {
		AssetID: AjaxLife.Utils.UUID.Zero,
		InventoryID: inventoryid,
		OwnerID: gAgentID,
		AssetType: AjaxLife.Constants.Inventory.InventoryType.LSL,
		callback: function(data) {
			transferid = data.TransferID;
		}
	});
	
	win.show();
};

// Landmark display
AjaxLife.InventoryDialogs.Landmark = function(landmark, name) {
	// This is easy - we just prompt for confirmation and initiate the teleport on an affirmative response.
	Ext.Msg.confirm(_("InventoryDialogs.Landmark.Title"), _("InventoryDialogs.Landmark.Message", {name: name}), function(btn) {
		if(btn == 'yes')
		{
			AjaxLife.Map.TPDialog();
			AjaxLife.Network.Send('Teleport', {Landmark: landmark});
		}
	});
};

//TODO: Consider moving to another file. It's not used anywhere else, so I'm undecided.

AjaxLife.HighlightLSL = function(text) {
	// These lists come from my old GeSHi-based PHP highlighter.
	// They are probably slightly outdated.
	
	// All LSL keywords.
	var LSLkeywords = [
		'default', 'if', 'else', 'while', 'do', 'for', 'jump', 'return', 'state'
	];
	
	// LSL types.
	var LSLtypes = [
		'integer', 'float', 'vector', 'rotation', 'quaternion', 'key', 'string', 'list'
	];
	
	// Non-mathematical or type-related constants.
	var LSLconstants = [
		'STATUS_PHYSICS', 'STATUS_ROTATE_X', 'STATUS_ROTATE_Y',
		'STATUS_ROTATE_Z', 'STATUS_PHANTOM', 'STATUS_SANDBOX',
		'STATUS_BLOCK_GRAB', 'STATUS_DIE_AT_EDGE', 'STATUS_RETURN_AT_EDGE',
		'AGENT', 'ACTIVE', 'PASSIVE', 'SCRIPTED', 'CONTROL_FWD', 'CONTROL_BACK',
		'CONTROL_LEFT', 'CONTROL_RIGHT', 'CONTROL_UP', 'CONTROL_DOWN',
		'CONTROL_ROT_LEFT', 'CONTROL_ROT_RIGHT', 'CONTROL_LBUTTON',
		'CONTROL_ML_LBUTTON', 'PERMISSION_DEBIT', 'PERMISSION_TAKE_CONTROLS',
		'PERMISSION_TRIGGER_ANIMATION', 'PERMISSION_CHANGE_LINKS', 'PERMISSION_TRACK_CAMERA',
		'AGENT_FLYING', 'AGENT_ATTACHMENTS', 'AGENT_SCRIPTED',
		'AGENT_MOUSELOOK', 'AGENT_SITTING',
		'AGENT_ON_OBJECT', 'AGENT_AWAY', 'AGENT_WALKING',
		'AGENT_IN_AIR', 'AGENT_TYPING', 'AGENT_CROUCHING',
		'AGENT_BUSY', 'AGENT_ALWAYS_RUN', 'PSYS_PART_INTERP_COLOR_MASK',
		'PSYS_PART_INTERP_SCALE_MASK', 'PSYS_PART_BOUNCE_MASK',
		'PSYS_PART_WIND_MASK', 'PSYS_PART_FOLLOW_SRC_MASK',
		'PSYS_PART_FOLLOW_VELOCITY_MASK', 'PSYS_PART_TARGET_POS_MASK',
		'PSYS_PART_TARGET_LINEAR_MASK', 'PSYS_PART_EMISSIVE_MASK',
		'PSYS_PART_FLAGS', 'PSYS_PART_START_COLOR',
		'PSYS_PART_START_ALPHA', 'PSYS_PART_END_COLOR',
		'PSYS_PART_END_ALPHA', 'PSYS_PART_START_SCALE',
		'PSYS_PART_END_SCALE', 'PSYS_PART_MAX_AGE',
		'PSYS_SRC_ACCEL', 'PSYS_SRC_PATTERN', 'PSYS_SRC_INNERANGLE',
		'PSYS_SRC_OUTERANGLE', 'PSYS_SRC_TEXTURE', 'PSYS_SRC_BURST_RATE',
		'PSYS_SRC_BURST_PART_COUNT', 'PSYS_SRC_BURST_RADIUS',
		'PSYS_SRC_BURST_SPEED_MAX', 'PSYS_SRC_BURST_SPEED_MIN',
		'PSYS_SRC_MAX_AGE', 'PSYS_SRC_TARGET_KEY',
		'PSYS_SRC_OMEGA', 'PSYS_SRC_ANGLE_BEGIN', 'PSYS_SRC_ANGLE_END',
		'PSYS_SRC_PATTERN_DROP', 'PSYS_SRC_PATTERN_EXPLODE', 'PSYS_SRC_PATTERN_ANGLE',
		'PSYS_SRC_PATTERN_ANGLE_CONE_EMPTY', 'VEHICLE_TYPE_NONE',
		'VEHICLE_TYPE_SLED', 'VEHICLE_TYPE_CAR', 'VEHICLE_TYPE_BOAT',
		'VEHICLE_TYPE_AIRPLANE', 'VEHICLE_TYPE_BALLOON',
		'VEHICLE_LINEAR_FRICTION_TIMESCALE', 'VEHICLE_ANGULAR_FRICTION_TIMESCALE',
		'VEHICLE_LINEAR_MOTOR_DIRECTION', 'VEHICLE_LINEAR_MOTOR_OFFSET',
		'VEHICLE_ANGULAR_MOTOR_DIRECTION', 'VEHICLE_HOVER_HEIGHT',
		'VEHICLE_HOVER_EFFICIENCY', 'VEHICLE_HOVER_TIMESCALE',
		'VEHICLE_BUOYANCY', 'VEHICLE_LINEAR_DEFLECTION_EFFICIENCY',
		'VEHICLE_LINEAR_DEFLECTION_TIMESCALE', 'VEHICLE_LINEAR_MOTOR_TIMESCALE',
		'VEHICLE_LINEAR_MOTOR_DECAY_TIMESCALE', 'VEHICLE_ANGULAR_DEFLECTION_EFFICIENCY',
		'VEHICLE_ANGULAR_DEFLECTION_TIMESCALE', 'VEHICLE_ANGULAR_MOTOR_TIMESCALE',
		'VEHICLE_ANGULAR_MOTOR_DECAY_TIMESCALE',
		'VEHICLE_VERTICAL_ATTRACTION_EFFICIENCY',
		'VEHICLE_VERTICAL_ATTRACTION_TIMESCALE', 'VEHICLE_BANKING_EFFICIENCY',
		'VEHICLE_BANKING_MIX', 'VEHICLE_BANKING_TIMESCALE',
		'VEHICLE_REFERENCE_FRAME', 'VEHICLE_FLAG_NO_DEFLECTION_UP',
		'VEHICLE_FLAG_LIMIT_ROLL_ONLY', 'VEHICLE_FLAG_HOVER_WATER_ONLY',
		'VEHICLE_FLAG_HOVER_TERRAIN_ONLY', 'VEHICLE_FLAG_HOVER_GLOBAL_HEIGHT',
		'VEHICLE_FLAG_HOVER_UP_ONLY', 'VEHICLE_FLAG_LIMIT_MOTOR_UP',
		'VEHICLE_FLAG_MOUSELOOK_STEER', 'VEHICLE_FLAG_MOUSELOOK_BANK',
		'VEHICLE_FLAG_CAMERA_DECOUPLED', 'INVENTORY_ALL', 'INVENTORY_NONE',
		'INVENTORY_TEXTURE', 'INVENTORY_SOUND', 'INVENTORY_LANDMARK',
		'INVENTORY_OBJECT', 'INVENTORY_NOTECARD', 'INVENTORY_SCRIPT',
		'INVENTORY_BODYPART', 'INVENTORY_ANIMATION', 'INVENTORY_GESTURE',
		'ATTACH_CHEST', 'ATTACH_HEAD', 'ATTACH_LSHOULDER', 'ATTACH_RSHOULDER',
		'ATTACH_LHAND', 'ATTACH_RHAND', 'ATTACH_LFOOT', 'ATTACH_RFOOT',
		'ATTACH_BACK', 'ATTACH_PELVIS', 'ATTACH_MOUTH', 'ATTACH_CHIN',
		'ATTACH_LEAR', 'ATTACH_REAR', 'ATTACH_LEYE', 'ATTACH_REYE',
		'ATTACH_NOSE', 'ATTACH_RUARM', 'ATTACH_RLARM', 'ATTACH_LUARM',
		'ATTACH_LLARM', 'ATTACH_RHIP', 'ATTACH_RULEG', 'ATTACH_RLLEG',
		'ATTACH_LHIP', 'ATTACH_LULEG', 'ATTACH_LLLEG', 'ATTACH_BELLY',
		'ATTACH_RPEC', 'ATTACH_LPEC', 'LAND_LEVEL', 'LAND_RAISE',
		'LAND_LOWER', 'LAND_SMOOTH', 'LAND_NOISE', 'LAND_REVERT',
		'LAND_SMALL_BRUSH', 'LAND_MEDIUM_BRUSH', 'LAND_LARGE_BRUSH',
		'DATA_ONLINE', 'DATA_NAME', 'DATA_BORN', 'DATA_RATING',
		'DATA_SIM_POS', 'DATA_SIM_STATUS', 'DATA_SIM_RATING', 'DATA_PAYINFO',
		'ANIM_ON', 'LOOP', 'REVERSE', 'PING_PONG', 'SMOOTH',
		'ROTATE', 'SCALE', 'ALL_SIDES', 'LINK_SET', 'LINK_ROOT',
		'LINK_ALL_OTHERS', 'LINK_ALL_CHILDREN', 'LINK_THIS',
		'CHANGED_INVENTORY', 'CHANGED_COLOR', 'CHANGED_SHAPE',
		'CHANGED_SCALE', 'CHANGED_TEXTURE', 'CHANGED_LINK',
		'CHANGED_ALLOWED_DROP', 'CHANGED_OWNER', 'TYPE_INVALID',
		'TYPE_INTEGER', 'TYPE_FLOAT', 'TYPE_STRING', 'TYPE_KEY',
		'TYPE_VECTOR', 'TYPE_ROTATION', 'REMOTE_DATA_CHANNEL',
		'REMOTE_DATA_REQUEST', 'REMOTE_DATA_REPLY', 'PRIM_TYPE',
		'PRIM_MATERIAL', 'PRIM_PHYSICS', 'PRIM_TEMP_ON_REZ',
		'PRIM_PHANTOM', 'PRIM_POSITION', 'PRIM_SIZE', 'PRIM_ROTATION',
		'PRIM_TYPE', 'PRIM_TEXTURE', 'PRIM_COLOR', 'PRIM_BUMP_SHINY',
		'PRIM_FULLBRIGHT', 'PRIM_FLEXIBLE', 'PRIM_TEXGEN',
		'PRIM_TEXGEN_DEFAULT', 'PRIM_TEXGEN_PLANAR', 'PRIM_TYPE_BOX',
		'PRIM_TYPE_CYLINDER', 'PRIM_TYPE_PRISM', 'PRIM_TYPE_SPHERE',
		'PRIM_TYPE_TORUS', 'PRIM_TYPE_TUBE', 'PRIM_TYPE_RING',
		'PRIM_HOLE_DEFAULT', 'PRIM_HOLE_CIRCLE', 'PRIM_HOLE_SQUARE',
		'PRIM_HOLE_TRIANGLE', 'PRIM_MATERIAL_STONE', 'PRIM_MATERIAL_METAL',
		'PRIM_MATERIAL_GLASS', 'PRIM_MATERIAL_WOOD', 'PRIM_MATERIAL_FLESH',
		'PRIM_MATERIAL_PLASTIC', 'PRIM_MATERIAL_RUBBER', 'PRIM_MATERIAL_LIGHT',
		'PRIM_SHINY_NONE', 'PRIM_SHINY_LOW', 'PRIM_SHINY_MEDIUM',
		'PRIM_SHINY_HIGH', 'PRIM_BUMP_NONE', 'PRIM_BUMP_BRIGHT',
		'PRIM_BUMP_DARK', 'PRIM_BUMP_WOOD', 'PRIM_BUMP_BARK',
		'PRIM_BUMP_BRICKS', 'PRIM_BUMP_CHECKER', 'PRIM_BUMP_CONCRETE',
		'PRIM_BUMP_TILE', 'PRIM_BUMP_STONE', 'PRIM_BUMP_DISKS',
		'PRIM_BUMP_GRAVEL', 'PRIM_BUMP_BLOBS', 'PRIM_BUMP_SIDING',
		'PRIM_BUMP_LARGETILE', 'PRIM_BUMP_STUCCO', 'PRIM_BUMP_SUCTION',
		'PRIM_BUMP_WEAVE', 'MASK_BASE', 'MASK_OWNER', 'MASK_GROUP',
		'MASK_EVERYONE', 'PERM_TRANSFER', 'PERM_MODIFY', 'PERM_COPY',
		'PERM_MOVE', 'PERM_ALL', 'PARCEL_MEDIA_COMMAND_STOP',
		'PARCEL_MEDIA_COMMAND_PAUSE', 'PARCEL_MEDIA_COMMAND_PLAY',
		'PARCEL_MEDIA_COMMAND_LOOP', 'PARCEL_MEDIA_COMMAND_TEXTURE',
		'PARCEL_MEDIA_COMMAND_URL', 'PARCEL_MEDIA_COMMAND_TIME',
		'PARCEL_MEDIA_COMMAND_AGENT', 'PARCEL_MEDIA_COMMAND_UNLOAD',
		'PARCEL_MEDIA_COMMAND_AUTO_ALIGN','PAY_HIDE','PAY_DEFAULT',
		'TRUE', 'FALSE',
		'HTTP_METHOD', 'HTTP_MIMETYPE', 'HTTP_VERIFY_CERT',
		'HTTP_BODY_MAXLENGTH', 'HTTP_BODY_TRUNCATED'
	];
	
	// String constants.
	var LSLconstants2 = [
		'NULL_KEY', 'EOF'
	];
	
	// 3D-space constants.
	var LSLconstants3 = [
		'ZERO_VECTOR', 'ZERO_ROTATION'
	];
	// Various useful numbers.
	var LSLmathconstants = [
		'PI', 'TWO_PI', 'PI_BY_TWO', 'DEG_TO_RAD', 'RAD_TO_DEG', 'SQRT2'
	];
	// An obscenely long list of functions.
	var LSLfunctions = [
		'llAbs', 'llAcos', 'llAddToLandBanList', 'llAddToLandPassList', 'llAdjustSoundVolume',
		'llAllowInventoryDrop', 'llAngleBetween', 'llApplyImpulse', 'llApplyRotationalImpulse',
		'llAsin', 'llAtan2', 'llAttachToAvatar', 'llAvatarOnSitTarget', 'llAxes2Rot',
		'llAxisAngle2Rot', 'llBase64ToInteger', 'llBase64ToString', 'llBreakAllLinks',
		'llBreakLink', 'llCeil', 'llClearCameraParams', 'llCloseRemoteDataChannel',
		'llCloud', 'llCollisionFilter', 'llCollisionSound', 'llCollisionSprite',
		'llCos', 'llCreateLink', 'llCSV2List', 'llDeleteSubList', 'llDeleteSubString',
		'llDetachFromAvatar', 'llDetectedGrab', 'llDetectedGroup', 'llDetectedKey',
		'llDetectedLinkNumber', 'llDetectedName', 'llDetectedOwner', 'llDetectedPos',
		'llDetectedRot', 'llDetectedType', 'llDetectedVel', 'llDialog', 'llDie',
		'llDumpList2String', 'llEdgeOfWorld', 'llEjectFromLand', 'llEmail', 'llEscapeURL',
		'llEuler2Rot', 'llFabs', 'llFloor', 'llForceMouselook', 'llFrand', 'llGetAccel',
		'llGetAgentInfo', 'llGetAgentSize', 'llGetAlpha', 'llGetAndResetTime',
		'llGetAnimation', 'llGetAnimationList', 'llGetAttached', 'llGetBoundingBox',
		'llGetCameraPos', 'llGetCameraRot', 'llGetCenterOfMass', 'llGetCreator',
		'llGetColor', 'llGetDate', 'llGetEnergy', 'llGetForce', 'llGetFreeMemory',
		'llGetGeometricCenter', 'llGetGMTclock', 'llGetInventoryCreator', 'llGetInventoryKey',
		'llGetInventoryName', 'llGetInventoryNumber', 'llGetInventoryPermMask', 'llGetInventoryType',
		'llGetKey', 'llGetLandOwnerAt', 'llGetLinkKey', 'llGetLinkName', 'llGetLinkNumber',
		'llGetListEntryType', 'llGetListLength', 'llGetLocalPos', 'llGetLocalRot', 'llGetMass',
		'llGetNextEmail', 'llGetNotecardLine', 'llGetNumberOfNotecardLines', 'llGetNumberOfPrims',
		'llGetNumberOfSides', 'llGetObjectDesc', 'llGetObjectMass', 'llGetObjectName',
		'llGetObjectPermMask', 'llGetOmega', 'llGetOwner', 'llGetOwnerKey', 'llGetParcelFlags',
		'llGetPermissions', 'llGetPermissionsKey', 'llGetPos', 'llGetPrimitiveParams',
		'llGetRegionCorner', 'llGetRegionFlags', 'llGetRegionFPS', 'llGetRegionName',
		'llGetRegionTimeDilation', 'llGetRootPosition', 'llGetRootRotation', 'llGetRot',
		'llGetScale', 'llGetScriptName', 'llGetScriptState', 'llGetSimulatorHostname',
		'llGetStartParameter', 'llGetStatus', 'llGetSubString', 'llGetSunDirection',
		'llGetTexture', 'llGetTextureOffset', 'llGetTextureRot', 'llGetTextureScale',
		'llGetTime', 'llGetTimeOfDay', 'llGetTimestamp', 'llGetTorque', 'llGetUnixTime',
		'llGetVel', 'llGetWallclock', 'llGiveInventory', 'llGiveInventoryList', 'llGiveMoney',
		'llGodLikeRezObject', 'llGround', 'llGroundContour', 'llGroundNormal', 'llGroundRepel',
		'llGroundSlope', 'llHTTPRequest', 'llInsertString', 'llInstantMessage', 'llIntegerToBase64',
		'llKey2Name', 'llList2CSV', 'llList2Float', 'llList2Integer', 'llList2Key',
		'llList2List', 'llList2ListStrided', 'llList2Rot', 'llList2String', 'llList2Vector',
		'llListFindList', 'llListInsertList', 'llListRandomize', 'llListReplaceList', 'llListSort',
		'llListStatistics', 'llListen', 'llListenControl', 'llListenRemove', 'llLoadURL',
		'llLog', 'llLog10', 'llLookAt', 'llLoopSound', 'llLoopSoundMaster', 'llLoopSoundSlave',
		'llMakeExplosion', 'llMakeFire', 'llMakeFountain', 'llMakeSmoke', 'llMapDestination',
		'llMD5String', 'llMessageLinked', 'llMinEventDelay', 'llModifyLand', 'llModPow',
		'llMoveToTarget', 'llOffsetTexture', 'llOpenRemoteDataChannel', 'llOverMyLand',
		'llOwnerSay', 'llParcelMediaCommandList', 'llParcelMediaQuery', 'llParseString2List',
		'llParseStringKeepNulls', 'llParticleSystem', 'llPassCollisions', 'llPassTouches',
		'llPlaySound', 'llPlaySoundSlave', 'llPointAt', 'llPow', 'llPreloadSound', 'llPushObject',
		'llRefreshPrimURL', 'llReleaseCamera', 'llReleaseControls', 'llRemoteDataReply',
		'llRemoteDataSetRegion', 'llRemoteLoadScript', 'llRemoteLoadScriptPin',
		'llRemoveFromLandBanList', 'llRemoveFromLandPassList', 'llRemoveInventory',
		'llRemoveVehicleFlags', 'llRequestAgentData', 'llRequestInventoryData',
		'llRequestPermissions', 'llRequestSimulatorData', 'llResetOtherScript', 'llResetScript',
		'llResetTime', 'llRezAtRoot', 'llRezObject', 'llRot2Angle', 'llRot2Axis', 'llRot2Euler',
		'llRot2Fwd', 'llRot2Left', 'llRot2Up', 'llRotBetween', 'llRotLookAt', 'llRotTarget',
		'llRotTargetRemove', 'llRotateTexture', 'llRound', 'llSameGroup', 'llSay', 'llScaleTexture',
		'llScriptDanger', 'llSendRemoteData', 'llSensor', 'llSensorRemove', 'llSensorRepeat',
		'llSetAlpha', 'llSetBuoyancy', 'llSetCameraAtOffset', 'llSetCameraEyeOffset',
		'llSetCameraParams', 'llSetColor', 'llSetDamage', 'llSetForce', 'llSetForceAndTorque',
		'llSetHoverHeight', 'llSetLinkAlpha', 'llSetLinkColor', 'llSetLocalRot', 'llSetObjectDesc',
		'llSetObjectName', 'llSetParcelMusicURL', 'llSetPayPrice', 'llSetPos', 'llSetPrimURL',
		'llSetPrimitiveParams', 'llSetRemoteScriptAccessPin', 'llSetRot', 'llSetScale',
		'llSetScriptState', 'llSetSitText', 'llSetSoundQueueing', 'llSetSoundRadius',
		'llSetStatus', 'llSetText', 'llSetTexture', 'llSetTextureAnim', 'llSetTimerEvent',
		'llSetTorque', 'llSetTouchText', 'llSetVehicleFlags', 'llSetVehicleFloatParam',
		'llSetVehicleRotationParam', 'llSetVehicleType', 'llSetVehicleVectorParam', 'llShout',
		'llSin', 'llSitTarget', 'llSleep', 'llSound', 'llSoundPreload', 'llSqrt',
		'llStartAnimation', 'llStopAnimation', 'llStopHover', 'llStopLookAt',
		'llStopMoveToTarget', 'llStopPointAt', 'llStopSound', 'llStringLength',
		'llStringToBase64', 'llSubStringIndex', 'llTakeCamera', 'llTakeControls', 'llTan',
		'llTarget', 'llTargetOmega', 'llTargetRemove', 'llTeleportAgentHome', 'llToLower',
		'llToUpper', 'llTriggerSound', 'llTriggerSoundLimited', 'llUnescapeURL', 'llUnSit',
		'llVecDist', 'llVecMag', 'llVecNorm', 'llVolumeDetect', 'llWater', 'llWhisper',
		'llWind', 'llXorBase64StringsCorrect', 'llXorBase64Strings', 'llSetLinkTexture',
		'llSetLinkPrimitiveParams', 'llGetObjectDetails'
	];
	var LSLevents = [
		'at_rot_target', 'at_target', 'attach', 'changed', 'collision',
		'collision_end', 'collision_start', 'control', 'dataserver', 'email',
		'http_response', 'land_collision', 'land_collision_end', 'land_collision_start',
		'link_message', 'listen', 'money', 'moving_end', 'moving_start', 'no_sensor',
		'not_at_rot_target', 'not_at_target', 'object_rez', 'on_rez', 'remote_data',
		'run_time_permissions', 'sensor', 'state_entry', 'state_exit', 'timer',
		'touch', 'touch_start', 'touch_end'
	];
    
    // This function is called by the regex match for each atom matched.
	var matcher = function(match) {
		// If we're dealing with a string.
		if(match.substr(-1) == '"')
		{
			// This fixes a bug whereby some stuff would be inadvertantly highlighted as a string.
			// Wait until we actually reach a quote to colour things in.
			var prematch = '';
			while(match.substr(0,1) != '"')
			{
				prematch += match.substr(0,1);
				match = match.substr(1);
			}
			return prematch+'<span style="color: #00A000;">'+match+'</span>';
		}
		// A comment
		else if(match.substr(0,2) == "//")
		{
			return '<span style="color: #f70;">'+match+'</span>';
		}
		// < or >
		else if(match == "&lt;" || match == "&gt;")
		{
			return '<span style="color: #f0f;">'+match+'</span>';
		}
		// List start or end.
		else if(match == "[" || match == "]")
		{
			return '<span style="color: #f00;">'+match+'</span>';
		}
		// Keyword or nothing.
		else
		{
			if(LSLkeywords.indexOf(match) !== -1) return '<a href="http://wiki.secondlife.com/wiki/'+match.capitalize()+'" target="_blank"><span style="color: #00f;">'+match+'</span></a>';
			else if(LSLtypes.indexOf(match) !== -1) return '<a href="http://wiki.secondlife.com/wiki/'+match.capitalize()+'" target="_blank"><span style="color: #070;">'+match+'</span></a>';
			else if(LSLevents.indexOf(match) !== -1) return '<a href="http://wiki.secondlife.com/wiki/'+match.capitalize()+'" target="_blank"><span style="color: #00A0A0;">'+match+'</span></a>';
			else if(LSLconstants.indexOf(match) !== -1) return '<span style="color: #0000A0;">'+match+'</span>';
			else if(LSLconstants2.indexOf(match) !== -1) return '<span style="color: #87CEFA;">'+match+'</span>';
			else if(LSLconstants3.indexOf(match) !== -1) return '<span style="color: #BC8F8F;">'+match+'</span>';
			else if(LSLmathconstants.indexOf(match) !== -1) return '<span style="color: #8A2BE2;">'+match+'</span>';
			else if(LSLfunctions.indexOf(match) !== -1) return '<a href="http://wiki.secondlife.com/wiki/'+match.substr(0,1).toUpperCase()+match.substr(1)+'" target="_blank"><span style="color: #A00000;">'+match+'</span></a>';
			else return match;
		}
	};
	
	text = text.escapeHTML();
	// This regular expression came from http://www.lslwiki.net/lslwiki/wakka.php?wakka=EzharFairlight - and was therefore presumably created by Ezhar Fairlight.
	
	//                                 empty string
	//                                      |
	//                     string       |   |   |   comments    |   < and >   | list |        words
	//              --------------------|-------|---------------|-------------|------|---------------------
	var regex = /(?:".*?(?:[^\\]"|\\\\")|[^\\]""|\/\/.*?(?:\n|$)|(?:&lt;|&gt;)|[\[\]]|[a-zA-Z_][a-zA-Z0-9_]*)/g;
	
	// Run the matcher.
	return '<pre>'+text.replace(regex, matcher)+'</pre>';
};
