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

AjaxLife.Constants = {
	MainAvatar: {
		AgentFlags: {
			None: 0,
			HideTitle: 1
		},
		AgentState: {
			None: 0,
			Typing: 4,
			Editing: 16
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
			CurrentlyUnused: 26,
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
			None: 0,
			Debit: 2,
			TakeControls: 4,
			RemapControls: 8,
			TriggerAnimation: 16,
			Attach: 32,
			ReleaseOwnership: 64,
			ChangeLinks: 128,
			ChangeJoints: 256,
			ChangePermissions: 512,
			TrackCamera: 1024,
			ControlCamera: 2048
		},
		TeleportFlags: {
			Default: 0,
			SetHomeToTarget: 1,
			SetLastToTarget: 2,
			ViaLure: 4,
			ViaLandmark: 8,
			ViaLocation: 16,
			ViaHome: 32,
			ViaTelehub: 64,
			ViaLogin: 128,
			ViaGodlikeLure: 256,
			Godlike: 512,
			NineOneOne: 1024,
			DisableCancel: 2048,
			ViaRegionID: 4096,
			IsFlying: 8192
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
		avatar_aim_l_bow: "46bb4359-de38-4ed8-6a22-f1f52fe8f506",
		avatar_aim_r_bazooka: "b5b4a67d-0aee-30d2-72cd-77b333e932ef",
		avatar_aim_r_handgun: "3147d815-6338-b932-f011-16b56d9ac18b",
		avatar_aim_r_rifle: "ea633413-8006-180a-c3ba-96dd1d756720",
		avatar_angry_fingerwag: "c1bc7f36-3ba0-d844-f93c-93be945d644f",
		avatar_angry_tantrum: "11000694-3f41-adc2-606b-eee1d66f3724",
		avatar_away: "fd037134-85d4-f241-72c6-4f42164fedee",
		avatar_backflip: "c4ca6188-9127-4f31-0158-23c4e2f93304",
		avatar_blowkiss: "db84829b-462c-ee83-1e27-9bbee66bd624",
		avatar_bow: "82e99230-c906-1403-4d9c-3889dd98daba",
		avatar_brush: "349a3801-54f9-bf2c-3bd0-1ac89772af01",
		avatar_busy: "efcf670c-2d18-8128-973a-034ebc806b67",
		avatar_clap: "9b0c1c4e-8ac7-7969-1494-28c874c4f668",
		avatar_courtbow: "9ba1c942-08be-e43a-fb29-16ad440efc50",
		avatar_crouch: "201f3fdf-cb1f-dbec-201f-7333e328ae7c",
		avatar_crouchwalk: "47f5f6fb-22e5-ae44-f871-73aaaf4a6022",
		avatar_dance1: "b68a3d7c-de9e-fc87-eec8-543d787e5b0d",
		avatar_dance2: "928cae18-e31d-76fd-9cc9-2f55160ff818",
		avatar_dance3: "30047778-10ea-1af7-6881-4db7a3a5a114",
		avatar_dance4: "951469f4-c7b2-c818-9dee-ad7eea8c30b7",
		avatar_dance5: "4bd69a1d-1114-a0b4-625f-84e0a5237155",
		avatar_dance6: "cd28b69b-9c95-bb78-3f94-8d605ff1bb12",
		avatar_dance7: "a54d8ee2-28bb-80a9-7f0c-7afbbe24a5d6",
		avatar_dance8: "b0dc417c-1f11-af36-2e80-7e7489fa7cdc",
		avatar_dead: "57abaae6-1d17-7b1b-5f98-6d11a6411276",
		avatar_drink: "0f86e355-dd31-a61c-fdb0-3a96b9aad05f",
		avatar_express_afraid: "6b61c8e8-4747-0d75-12d7-e49ff207a4ca",
		avatar_express_afraid_emote: "aa2df84d-cf8f-7218-527b-424a52de766e",
		avatar_express_anger: "5747a48e-073e-c331-f6f3-7c2149613d3e",
		avatar_express_anger_emote: "1a03b575-9634-b62a-5767-3a679e81f4de",
		avatar_express_bored: "b906c4ba-703b-1940-32a3-0c7f7d791510",
		avatar_express_bored_emote: "214aa6c1-ba6a-4578-f27c-ce7688f61d0d",
		avatar_express_cry: "92624d3e-1068-f1aa-a5ec-8244585193ed",
		avatar_express_cry_emote: "d535471b-85bf-3b4d-a542-93bea4f59d33",
		avatar_express_disdain: "d4416ff1-09d3-300f-4183-1b68a19b9fc1",
		avatar_express_embarrassed_emote: "0b8c8211-d78c-33e8-fa28-c51a9594e424",
		avatar_express_frown: "fee3df48-fa3d-1015-1e26-a205810e3001",
		avatar_express_kiss: "1e8d90cc-a84e-e135-884c-7c82c8b03a14",
		avatar_express_laugh: "18b3a4b5-b463-bd48-e4b6-71eaac76c515",
		avatar_express_laugh_emote: "62570842-0950-96f8-341c-809e65110823",
		avatar_express_open_mouth: "d63bc1f9-fc81-9625-a0c6-007176d82eb7",
		avatar_express_repulsed: "36f81a92-f076-5893-dc4b-7c3795e487cf",
		avatar_express_repulsed_emote: "f76cda94-41d4-a229-2872-e0296e58afe1",
		avatar_express_sad: "0eb702e2-cc5a-9a88-56a5-661a55c0676a",
		avatar_express_sad_emote: "eb6ebfb2-a4b3-a19c-d388-4dd5c03823f7",
		avatar_express_shrug: "70ea714f-3a97-d742-1b01-590a8fcd1db5",
		avatar_express_shrug_emote: "a351b1bc-cc94-aac2-7bea-a7e6ebad15ef",
		avatar_express_smile: "b7c7c833-e3d3-c4e3-9fc0-131237446312",
		avatar_express_surprise: "313b9881-4302-73c0-c7d0-0e7a36b6c224",
		avatar_express_surprise_emote: "728646d9-cc79-08b2-32d6-937f0a835c24",
		avatar_express_tongue_out: "835965c6-7f2f-bda2-5deb-2478737f91bf",
		avatar_express_toothsmile: "b92ec1a5-e7ce-a76b-2b05-bcdb9311417e",
		avatar_express_wink: "869ecdad-a44b-671e-3266-56aef2e3ac2e",
		avatar_express_wink_emote: "da020525-4d94-59d6-23d7-81fdebf33148",
		avatar_express_worry: "9f496bd2-589a-709f-16cc-69bf7df1d36c",
		avatar_express_worry_emote: "9c05e5c7-6f07-6ca4-ed5a-b230390c3950",
		avatar_falldown: "666307d9-a860-572d-6fd4-c3ab8865c094",
		avatar_female_walk: "f5fc7433-043d-e819-8298-f519a119b688",
		avatar_fist_pump: "7db00ccd-f380-f3ee-439d-61968ec69c8a",
		avatar_fly: "aec4610c-757f-bc4e-c092-c6e9caf18daf",
		avatar_flyslow: "2b5a38b2-5e00-3a97-a495-4c826bc443e6",
		avatar_hello: "9b29cd61-c45b-5689-ded2-91756b8d76a9",
		avatar_hold_l_bow: "8b102617-bcba-037b-86c1-b76219f90c88",
		avatar_hold_r_bazooka: "ef62d355-c815-4816-2474-b1acc21094a6",
		avatar_hold_r_handgun: "efdc1727-8b8a-c800-4077-975fc27ee2f2",
		avatar_hold_r_rifle: "3d94bad0-c55b-7dcc-8763-033c59405d33",
		avatar_hold_throw_r: "7570c7b5-1f22-56dd-56ef-a9168241bbb6",
		avatar_hover: "4ae8016b-31b9-03bb-c401-b1ea941db41d",
		avatar_hover_down: "20f063ea-8306-2562-0b07-5c853b37b31e",
		avatar_hover_up: "62c5de58-cb33-5743-3d07-9e4cd4352864",
		avatar_impatient: "5ea3991f-c293-392e-6860-91dfa01278a3",
		avatar_jump: "2305bd75-1ca9-b03b-1faa-b176b8a8c49e",
		avatar_jumpforjoy: "709ea28e-1573-c023-8bf8-520c8bc637fa",
		avatar_kick_roundhouse_r: "49aea43b-5ac3-8a44-b595-96100af0beda",
		avatar_kissmybutt: "19999406-3a3a-d58c-a2ac-d72e555dcf51",
		avatar_land: "7a17b059-12b2-41b1-570a-186368b6aa6f",
		avatar_laugh_short: "ca5b3f14-3194-7a2b-c894-aa699b718d1f",
		avatar_motorcycle_sit: "08464f78-3a8e-2944-cba5-0c94aff3af29",
		avatar_musclebeach: "315c3a41-a5f3-0ba4-27da-f893f769e69b",
		avatar_no_head: "5a977ed9-7f72-44e9-4c4c-6e913df8ae74",
		avatar_no_unhappy: "d83fa0e5-97ed-7eb2-e798-7bd006215cb4",
		avatar_nyanya: "f061723d-0a18-754f-66ee-29a44795a32f",
		avatar_peace: "b312b10e-65ab-a0a4-8b3c-1326ea8e3ed9",
		avatar_point_me: "17c024cc-eef2-f6a0-3527-9869876d7752",
		avatar_point_you: "ec952cca-61ef-aa3b-2789-4d1344f016de",
		avatar_prejump: "7a4e87fe-de39-6fcb-6223-024b00893244",
		avatar_punch_l: "f3300ad9-3462-1d07-2044-0fef80062da0",
		avatar_punch_onetwo: "eefc79be-daae-a239-8c04-890f5d23654a",
		avatar_punch_r: "c8e42d32-7310-6906-c903-cab5d4a34656",
		avatar_rps_countdown: "35db4f7e-28c2-6679-cea9-3ee108f7fc7f",
		avatar_rps_paper: "0836b67f-7f7b-f37b-c00a-460dc1521f5a",
		avatar_rps_rock: "42dd95d5-0bc6-6392-f650-777304946c0f",
		avatar_rps_scissors: "16803a9f-5140-e042-4d7b-d28ba247c325",
		avatar_run: "05ddbff8-aaa9-92a1-2b74-8fe77a29b445",
		avatar_salute: "cd7668a6-7011-d7e2-ead8-fc69eff1a104",
		avatar_shoot_l_bow: "e04d450d-fdb5-0432-fd68-818aaf5935f8",
		avatar_shout: "6bd01860-4ebd-127a-bb3d-d1427e8e0c42",
		avatar_sit: "1a5fe8ac-a804-8a5d-7cbd-56bd83184568",
		avatar_sit_female: "b1709c8d-ecd3-54a1-4f28-d55ac0840782",
		avatar_sit_generic: "245f3c54-f1c0-bf2e-811f-46d8eeb386e7",
		avatar_sit_ground: "1c7600d6-661f-b87b-efe2-d7421eb93c86",
		avatar_sit_to_stand: "a8dee56f-2eae-9e7a-05a2-6fb92b97e21e",
		avatar_sleep: "f2bed5f9-9d44-39af-b0cd-257b2a17fe40",
		avatar_smoke_idle: "d2f2ee58-8ad1-06c9-d8d3-3827ba31567a",
		avatar_smoke_inhale: "6802d553-49da-0778-9f85-1599a2266526",
		avatar_smoke_throw_down: "0a9fb970-8b44-9114-d3a9-bf69cfe804d6",
		avatar_snapshot: "eae8905b-271a-99e2-4c0e-31106afd100c",
		avatar_soft_land: "f4f00d6e-b9fe-9292-f4cb-0ae06ea58d57",
		avatar_stand: "2408fe9e-df1d-1d7d-f4ff-1384fa7b350f",
		avatar_stand_1: "15468e00-3400-bb66-cecc-646d7c14458e",
		avatar_stand_2: "370f3a20-6ca6-9971-848c-9a01bc42ae3c",
		avatar_stand_3: "42b46214-4b44-79ae-deb8-0df61424ff4b",
		avatar_stand_4: "f22fed8b-a5ed-2c93-64d5-bdd8b93c889f",
		avatar_standup: "3da1d753-028a-5446-24f3-9c9b856d9422",
		avatar_stretch: "80700431-74ec-a008-14f8-77575e73693f",
		avatar_stride: "1cb562b0-ba21-2202-efb3-30f82cdf9595",
		avatar_surf: "41426836-7437-7e89-025d-0aa4d10f1d69",
		avatar_sword_strike_r: "85428680-6bf9-3e64-b489-6f81087c24bd",
		avatar_talk: "5c682a95-6da4-a463-0bf6-0f5b7be129d1",
		avatar_throw_r: "aa134404-7dac-7aca-2cba-435f9db875ca",
		avatar_tryon_shirt: "83ff59fe-2346-f236-9009-4e3608af64c1",
		avatar_turn_180: "038fcec9-5ebd-8a8e-0e2e-6e71a0a1ac53",
		avatar_turnback_180: "6883a61a-b27b-5914-a61e-dda118a9ee2c",
		avatar_turnleft: "56e0ba0d-4a9f-7f27-6117-32f2ebbf6135",
		avatar_turnright: "2d6daa51-3192-6794-8e2e-a15f8338ec30",
		avatar_type: "c541c47f-e0c0-058b-ad1a-d6ae3a4584d9",
		avatar_walk: "6ed24bd8-91aa-4b12-ccc7-c97c857ab4e0",
		avatar_whisper: "7693f268-06c7-ea71-fa21-2b30d6533f8f",
		avatar_whistle: "b1ed7982-c68e-a982-7561-52a88a5298c0",
		avatar_wink_hollywood: "c0c4030f-c02b-49de-24ba-2331f43fe41c",
		avatar_yes_happy: "b8c8b2a3-9008-1771-3bfc-90924955ab2d",
		avatar_yes_head: "15dd911d-be82-2856-26db-27659b142875",
		avatar_yoga_float: "42ecd00b-9947-a97c-400a-bbc9174c7aeb"
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
	}
};