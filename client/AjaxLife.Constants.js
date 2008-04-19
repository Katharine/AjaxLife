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

AjaxLife.Constants = {
	MainAvatar: {
		AgentFlags: {
			None:		0x00000000,
			HideTitle:	0x00000001
		},
		AgentState: {
			None:		0x00000000,
			Typing:		0x00000004,
			Editing:	0x00000010
		},
		ChatAudibleLevel: {
			Not: -1,
			Barely: 0,
			Fully: 1
		},
		ChatSourceType: {
			System: 0,
			Agent: 1,
			Object: 2
		},
		ChatType: {
			Whisper: 0,
			Normal: 1,
			Shout: 2,
			StartTyping: 4,
			StopTyping: 5,
			Debug: 6,
			OwnerSay: 8
		},
		InstantMessageDialog: {
			MessageFromAgent: 0,
			MessageBox: 1,
			GroupInvitation: 3,
			InventoryOffered: 4,
			InventoryAccepted: 5,
			InventoryDeclined: 6,
			GroupVote: 7,
			TaskInventoryOffered: 9,
			TaskInventoryAccepted: 10,
			TaskInventoryDeclined: 11,
			NewUserDefault: 12,
			SessionAdd: 13,
			SessionOfflineAdd: 14,
			SessionGroupStart: 15,
			SessionCardlessStart: 16,
			SessionSend: 17,
			SessionDrop: 18,
			MessageFromObject: 19,
			BusyAutoResponse: 20,
			ConsoleAndChatHistory: 21,
			RequestTeleport: 22,
			AcceptTeleport: 23,
			DenyTeleport: 24,
			GodLikeRequestTeleport: 25,
			GotoUrl: 28,
			Session911Start: 29,
			Lure911: 30,
			FromTaskAsAlert: 31,
			GroupNotice: 32,
			GroupNoticeInventoryAccepted: 33,
			GroupNoticeInventoryDeclined: 34,
			GroupInvitationAccept: 35,
			GroupInvitationDecline: 36,
			GroupNoticeRequsted: 37,
			FriendshipOffered: 38,
			FriendshipAccepted: 39,
			FriendshipDeclined: 40,
			StartTyping: 41,
			StopTyping: 42
		},
		InstantMessageOnline: {
			Online: 0,
			Offline: 1
		},
		LookAtType: {
			None: 0,
			Idle: 1,
			AutoListen: 2,
			FreeLook: 3,
			Respond: 4,
			Hover: 5,
			Conversation: 6,
			Select: 7,
			Focus: 8,
			Mouselook: 9,
			Clear: 10
		},
		PointAtType: {
			None: 0,
			Select: 1,
			Grab: 2,
			Clear: 3
		},
		ScriptPermission: {
			None:				0x00000000,
			Debit:				0x00000002,
			TakeControls:		0x00000004,
			RemapControls:		0x00000008,
			TriggerAnimation:	0x00000010,
			Attach:				0x00000020,
			ReleaseOwnership:	0x00000040,
			ChangeLinks:		0x00000080,
			ChangeJoints:		0x00000100,
			ChangePermissions:	0x00000200,
			TrackCamera:		0x00000400,
			ControlCamera:		0x00000800
		},
		TeleportFlags: {
			Default:			0x00000000,
			SetHomeToTarget:	0x00000001,
			SetLastToTarget:	0x00000002,
			ViaLure:			0x00000004,
			ViaLandmark:		0x00000008,
			ViaLocation:		0x00000010,
			ViaHome:			0x00000020,
			ViaTelehub:			0x00000040,
			ViaLogin:			0x00000080,
			ViaGodlikeLure:		0x00000100,
			Godlike:			0x00000200,
			NineOneOne:			0x00000400,
			DisableCancel:		0x00000800,
			ViaRegionID:		0x00001000,
			IsFlying:			0x00002000
		},
		TeleportLureFlags: {
			NormalLure: 0,
			GodlikeLure: 1,
			GodlikePursuit: 2
		},
		TeleportStatus: {
			None: 0,
			Start: 1,
			Progress: 2,
			Failed: 3,
			Finished: 4,
			Cancelled: 5
		}
	},
	NetworkManager: {
		DisconnectType: {
			ClientInitiated: 0,
			ServerInitiated: 1,
			NetworkTimeout: 2,
			SimShutdown: 3
		},
		LoginStatus: {
			Failed: -1,
			None: 0,
			ConnectingToLogin: 1,
			ReadingResponse: 2,
			ConnectingToSim: 3,
			Redirecting: 4,
			Success: 5
		}
	},
	Animations: {
		avatar_type: "c541c47f-e0c0-058b-ad1a-d6ae3a4584d9"
	},
	Map: {
		SimAccess: {
			Min: 0,
			Trial: 7,
			PG: 13,
			Mature: 21,
			Down: 254,
			Max: 21,
			NonExistent: 255
		},
		Item: {
			Telehub: 1,
			PGEvent: 2,
			MatureEvent: 3,
			Popular: 4,
			AgentLocations: 6,
			LandForSale: 7,
			Classified: 8
		}
	},
	Inventory: {
		InventoryType: {
			Unknown: -1,
			Texture: 0,
			Sound: 1,
			CallingCard: 2,
			Landmark: 3,
			Script: 4,
			Clothing: 5,
			Object: 6,
			Notecard: 7,
			Category: 8,
			Folder: 8,
			RootCategory: 0,
			LSL: 10,
			LSLBytecode: 11,
			TextureTGA: 12,
			Bodypart: 13,
			Trash: 14,
			Snapshot: 15,
			LostAndFound: 16,
			Attachment: 17,
			Wearable: 18,
			Animation: 19,
			Gesture: 20
		}
	},
	Permissions: {
		Transfer:	0x00002000,
		Modify:		0x00004000,
		Copy:		0x00008000,
		Move:		0x00080000,
		All:		0x7FFFFFFF
	},
	FriendRights: {
		None: 				0x00000000,
		CanSeeOnline:		0x00000001,
		CanSeeOnMap:		0x00000002,
		CanModifyObjects:	0x00000004
	}
};