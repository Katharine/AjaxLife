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

AjaxLife.Strings = {
	// Default English translations
	en: {
		Friends: {
			OnlineNotification: "#{name} is #{status}.",
			Online: "online",
			Offline: "offline",
			FriendshipOffered: "#{name} has offered friendship. Will you accept?",
			YouAccept: "You accepted #{name} as a friend.",
			YouDecline: "You declined #{name}'s friendship offer."
		},
		InstantMessage: {
			Typing: "#{name} is typing...",
			OnlineFriends: "Online Friends",
			Send: "Send",
			WindowTitle: "Instant Messages",
			Profile: "Profile"
		},
		AjaxLife: {
			Precaching: "Precaching...",
			MOTD: "Message of the Day"
		},
		Map: {
			TeleportConfirm: "Are you sure you want to teleport to #{sim} (#{x}, #{y})?",
			RegionLabel: "Region:",
			PositionLabel: "Position:",
			TeleportNoun: "Teleport",
			TeleportVerb: "Teleport",
			Teleporting: "Teleporting",
			FocusYou: "Focus on you",
			Clear: "Clear",
			FocusTarget: "Focus on target",
			HomeButton: "Go Home",
			HomeConfirm: "Are you sure you want to go home?",
			TeleportRequest: "#{name} has offered you a teleport:<br /><br />#{message}",
			TeleportRequestTitle: "Teleport offer",
			Teleportation: "Teleportation",
			TeleportSuccess: "You have successfully teleported to #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "Your teleport was cancelled.",
			TeleportError: "Your teleport was not successful. Please try again later.",
			WindowTitle: "Map",
			NoRegionGiven: "The server has failed to send the name of the sim you are in."
			
		},
		Network: {
			LoggingOut: "Logging out...",
			LogoutError: "Could not log out of Second Life due to a communication error.",
			LogoutSuccess: "You have logged out of Second Life.",
			LogoutForced: "You have been logged out of Second Life:<br /><br />#{reason}",
			UnhandledMessage: "Unhandled message",
			EventQueueFailure: "The event queue could not be updated.",
			GenericSendError: "An error occured while sending the data.",
			InventoryReceive: "#{name} gave you #{item}",
			Error: "Error",
			Disconnected: "Disconnected"
		},
		StatusBar: {
			Money: "Money",
			LindenDollarSymbol: "L$",
			Loading: " loading...",
			MoneyReceived: "You were paid L$#{amount}.",
			MoneyGiven: "You paid L$#{amount}."
		},
		SpatialChat: {
			ThirdPersonShout: " shouts:",
			SecondPersonShout: " shout:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: " whispers:",
			SecondPersonWhisper: " whisper:",
			You: "You",
			Say: "Say",
			Whisper: "Whisper",
			Shout: "Shout",
			WindowTitle: "Local chat"
		},
		Toolbar: {
			ChatButton: "Chat",
			ChatTooltip: "Talk to people near you",
			IMButton: "Instant Messages",
			IMTooltip: "Communicate with distant people",
			MapButton: "Map",
			MapTooltip: "Show the grid map",
			SearchButton: "Search",
			SearchTooltip: "",
			LogoutButton: "Log out",
			LogoutTitle: "Log out",
			LogoutPrompt: "Are you sure you want to log out?",
			LogoutTooltip: "Log out of Second Life",
			NearbyButton: "Nearby Avatars",
			NearbyTooltop: "People in your general vicinity.",
			InventoryButton: "Inventory",
			InventoryTooltip: "Read-only inventory access",
			StatsButton: "Stats",
			StatsTooltip: ""
		},
		Widgets: {
			Yes: "Yes",
			No: "No",
			Accept: "Accept",
			Decline: "Decline",
			OK: "OK",
			Cancel: "Cancel"
		},
		Search: {
			WindowTitle: "Search",
			Searching: "Searching...",
			People: "People"
		},
		Profile: {
			WindowTitle: "Profile - #{name}",
			Loading: "Loading...",
			JoinDate: "Joined: #{date}",
			Account: "Account:<br />#{type}",
			PaymentInfoOnFile: "Payment info on file",
			PaymentInfoUsed: "Payment info used",
			LindenAccount: "Linden Lab Employee",
			NoPaymentInfo: "No payment info",
			Picks: "Picks",
			Interests: "Interests",
			SecondLife: "2nd Life",
			FirstLife: "1st Life",
			Groups: "Groups",
			About: "About",
			Name: "Name: #{name}",
			Online: "Online",
			Offline: "Offline",
			Partner: "Partner:<br />#{partner}",
			None: "None",
			IMButton: "Instant Message",
			PayButton: "Pay",
			PayDialogTitle: "Paying #{first} #{last}",
			PayDialogPrompt: "How much do you want to pay #{first} #{last}?",
			InvalidAmount: "That is an invalid amount to pay!",
			FriendButton: "Add Friend",
			ConfirmFriendAdd: "Are you sure you want to add #{first} #{last} as a friend?",
			FriendshipOffered: "You have offered #{first} #{last} friendship.",
			TeleportButton: "Offer Teleport",
			TeleportDialogTitle: "Teleporting #{first} #{last}",
			TeleportDialogPrompt: "Enter a message to send with your teleport offer:",
			TeleportDefaultMessage: "Join me in #{sim}!"
		},
		Texture: {
			DownloadFailed: "Could not download texture."
		},
		Number: {
			ThousandSeparatorInterval: 3,
			ThousandSeparator: ",",
			DecimalPoint: "."
		},
		AvatarsNear: {
			WindowTitle: "Nearby Avatars"
		},
		Inventory: {
			WindowTitle: "Inventory",
			NullAssetTransfer: "An asset request failed."
		},
		InventoryDialogs: {
			Texture: {
				WindowTitle: "Texture: #{name}"
			},
			Notecard: {
				WindowTitle: "Notecard: #{name}"
			},
			Script: {
				WindowTitle: "Script: #{name}"
			},
			Landmark: {
				Title: "Teleport to landmark",
				Message: "Are you sure you want to teleport to #{name}?"
			}
		},
		Stats: {
			WindowTitle: "Stats",
			Region: "Region",
			FPS: "FPS",
			TD: "Time Dilation",
			ScriptIPS: "Script IPS",
			Objects: "Objects",
			Scripts: "Active Scripts",
			Agents: "Agents",
			ChildAgents: "Child Agents",
			ALServer: "AjaxLife Server",
			Sessions: "Sessions"
		},
		ScriptDialogs: {
			PermissionRequestTitle: "Script permission request",
			PermissionRequestBody: "'#{object}', an object owned by '#{owner}', would like to:<br /><br />#{permission}<br />Is this OK?",
			DialogMessage: "#{first} #{last}'s '#{object}':<br />#{message}",
			DialogTitle: "Script dialog"
		},
		Permissions: {
			Debit: "Take Linden Dollars (L$) from you",
			TakeControls: "Act on your control inputs",
			Animate: "Animate your avatar",
			Attach: "Attach to your avatar",
			ChangeLinks: "Link and delink from other objects",
			TrackCamera: "Track your camera",
			ControlCamera: "Control your camera"
		}
	},	
	// Translate by Smiley Barry (TG)
	he: {
		Friends: {
			OnlineNotification: "#{name} כרגע #{status}.",
			Online: "מחובר",
			Offline: "מנותק",
			FriendshipOffered: "#{name} הציע חברות. לאשר?",
			YouAccept: "הסכמת לבקשת החברות של #{name}.",
			YouDecline: "סירבת לבקשת החברות של #{name}."
		},
		InstantMessage: {
			Typing: "#{name} מקליד הודעה כעת...",
			OnlineFriends: "חברים מחוברים",
			Send: "שלח",
			WindowTitle: "הודעות מיידיות",
			Profile: "פרופיל"
		},
		AjaxLife: {
			Precaching: "טוען מטמון...",
			MOTD: "הודעת היום"
		},
		Map: {
			TeleportConfirm: "האם אתה בטוח שברצונך לשגר את הדמות שלך אל #{sim} (#{x}, #{y})?",
			RegionLabel: "אזור:",
			PositionLabel: "מיקום:",
			TeleportNoun: "שגר",
			TeleportVerb: "שגר",
			Teleporting: "משגר",
			FocusYou: "התמקד במקומך",
			Clear: "אפס",
			FocusTarget: "התמקד במטרה",
			HomeButton: "השתגר הביתה",
			HomeConfirm: "האם אתה בטוח שברצונך לשגר את דמותך הביתה?",
			TeleportRequest: "#{name} הציע לשגר אותך למקומו:<br /><br />#{message}",
			TeleportRequestTitle: "הצעת שיגור",
			Teleportation: "שיגור",
			TeleportSuccess: "השתגרת בהצלחה אל #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "ביטלת את השיגור.",
			TeleportError: "השיגור נכשל. נסה שנית בבקשה.",
			WindowTitle: "מפה",
			NoRegionGiven: "השרת נכשל לשלוח את שם האזור שאתה בו כרגע."
			
		},
		Network: {
			LoggingOut: "מתנתק ויוצא...",
			LogoutError: "אין אפשרות להתנתק בגלל תקלת שירות.",
			LogoutSuccess: "נותקת בהצלחה.",
			LogoutForced: "נותקת מהשרת:<br /><br />#{reason}",
			UnhandledMessage: "הודעה לא מוכרת",
			EventQueueFailure: "רשימת האירועים נכשלה בעדכון.",
			GenericSendError: "אירעה שגיאה בעת שליחת המידע.",
			InventoryReceive: "#{name} נתן לך את הפריט #{item}",
			Error: "שגיאה",
			Disconnected: "נותקת"
		},
		StatusBar: {
			Money: "כסף",
			LindenDollarSymbol: "L$",
			Loading: " טוען...",
			MoneyReceived: "שילמו לך L$#{amount}.",
			MoneyGiven: "אתה שילמת L$#{amount}."
		},
		SpatialChat: {
			ThirdPersonShout: " צועק:",
			SecondPersonShout: " צעק:",
			ThirdPersonSay: " אמר:",
			SecondPersonSay: " אמר:",
			ThirdPersonWhisper: " לחש:",
			SecondPersonWhisper: " לחש:",
			You: "אתה",
			Say: "אומר",
			Whisper: "לוחש",
			Shout: "צועק",
			WindowTitle: "הודעות מקומיות"
		},
		Toolbar: {
			ChatButton: "דבר",
			ChatTooltip: "דבר לאנשים הקרובים אליך",
			IMButton: "הודעות מיידיות",
			IMTooltip: "דבר עם אנשים הרחוקים ממך",
			MapButton: "מפה",
			MapTooltip: "הראה את מפת העולם",
			SearchButton: "חפש",
			SearchTooltip: "חפש פריטים, אנשים, ועוד בעולם הוירטואלי",
			LogoutButton: "התנתק",
			LogoutTitle: "התנתק",
			LogoutPrompt: "האם אתה בטוח שברצונך להתנתק?",
			LogoutTooltip: "התנתק מהשרת",
			NearbyButton: "דמויות קרובות",
			NearbyTooltop: "אנשים בקרבתך.",
			InventoryButton: "מאגר פריטים",
			InventoryTooltip: "גישה למאגר הפריטים שלך (קריאה בלבד)",
			StatsButton: "סטטיסטיקות",
			StatsTooltip: "גלה מידע על האזור שבו אתה כעת, ומידע על שרת התוכנה."
		},
		Widgets: {
			Yes: "כן",
			No: "לא",
			Accept: "אשר",
			Decline: "סרב",
			OK: "אישור",
			Cancel: "ביטול"
		},
		Search: {
			WindowTitle: "חפש",
			Searching: "מחפש...",
			People: "אנשים"
		},
		Profile: {
			WindowTitle: "פרופיל - #{name}",
			Loading: "טוען...",
			JoinDate: "הצטרף: #{date}",
			Account: "חשבון:<br />#{type}",
			PaymentInfoOnFile: "מידע תשלום נמצא",
			PaymentInfoUsed: "מידע תשלום שומש לפחות פעם אחת",
			LindenAccount: "מנהל שרתים",
			NoPaymentInfo: "מידע תשלום לא נמצא",
			Picks: "מקומות",
			Interests: "תחביבים",
			SecondLife: "חיים שניים",
			FirstLife: "חיים ראשונים",
			Groups: "קבוצות",
			About: "אודות",
			Name: "שם: #{name}",
			Online: "מחובר",
			Offline: "מנותק",
			Partner: "בן/בת-זוג:<br />#{partner}",
			None: "ריק",
			IMButton: "שלח הודעה",
			PayButton: "שלם",
			PayDialogTitle: "משלם ל#{first} #{last}",
			PayDialogPrompt: "כמה תרצה לשלם ל#{first} #{last}?",
			InvalidAmount: "זהו סכום בלתי חוקי לשלם!",
			FriendButton: "הוסף כחבר",
			ConfirmFriendAdd: "האם אתה בטוח שברצונך להוסיף את #{first} #{last} כחבר?",
			FriendshipOffered: "אתה הצעת ל#{first} #{last} חברות.",
			TeleportButton: "הצע שיגור",
			TeleportDialogTitle: "משגר #{first} #{last}",
			TeleportDialogPrompt: "הכנס הודעה לכלול עם הצעת השיגור שלך:",
			TeleportDefaultMessage: "הצטרף אליי ב#{sim}!"
		},
		Texture: {
			DownloadFailed: "לא ניתן להוריד את הטקסטורה."
		},
		Number: {
			ThousandSeparatorInterval: 3,
			ThousandSeparator: ",",
			DecimalPoint: "."
		},
		AvatarsNear: {
			WindowTitle: "דמויות קרובות"
		},
		Inventory: {
			WindowTitle: "מלאי אישי"
		},
		InventoryDialogs: {
			Texture: {
				WindowTitle: "טקסטורה: #{name}"
			},
			Notecard: {
				WindowTitle: "פתק: #{name}"
			},
			Script: {
				WindowTitle: "קובץ תכנות: #{name}"
			},
			Landmark: {
				Title: "שגר את דמותך למיקום",
				Message: "האם אתה בטוח שברצונך לשגר את דמותך אל #{name}?"
			}
		},
		Stats: {
			WindowTitle: "סטטיסטיקה",
			Region: "שרת אזור",
			FPS: "מהירות פריים לשניה",
			TD: "מהירות שרת נוכחית מתוך מקסימום",
			ScriptIPS: "הוראות תכנות לשניה",
			Objects: "אובייקטים פרימיטיביים",
			Scripts: "קובצי תכנות פעילים",
			Agents: "משתמשים",
			ChildAgents: "משתמשים בשרת שכן",
			ALServer: "שרת תוכנה",
			Sessions: "משתמשים בשרת תוכנה"
		}
	},
	// Translation by Alissa Sabre
	ja: {
		Friends: {
			OnlineNotification: "#{name}は#{status}です。",
			Online: "オンライン",
			Offline: "オフライン",
			FriendshipOffered: "#{name}がフレンド登録を希望しています。承諾しますか?",
			YouAccept: "#{name}のフレンド登録を承諾しました。",
			YouDecline: "#{name}からのフレンド登録を辞退しました。"
		},
		InstantMessage: {
			Typing: "#{name}が入力中です...",
			OnlineFriends: "オンラインのフレンド",
			Send: "送る",
			WindowTitle: "IM (インスタントメッセージ)",
			Profile: "プロフィール"
		},
		AjaxLife: {
			Precaching: "読み込み中...",
			MOTD: "今日の一言"
		},
		Map: {
			TeleportConfirm: "#{sim} (#{x}/#{y}) にテレポートしていいですか?",
			RegionLabel: "地区:",
			PositionLabel: "位置:",
			TeleportNoun: "テレポート",
			TeleportVerb: "テレポートする",
			Teleporting: "テレポート中",
			FocusYou: "自分に注目",
			Clear: "クリア",
			FocusTarget: "他の場所に注目",
			HomeButton: "ホームに移動",
			HomeConfirm: "ホームに移動していいですか?",
			TeleportRequest: "#{name}がテレポートを誘っています:<br /><br />#{message}",
			TeleportRequestTitle: "テレポートの誘い",
			Teleportation: "テレポート",
			TeleportSuccess: "#{sim} (#{x}/#{y}/#{z}) へのテレポートは成功しました。",
			TeleportCancelled: "テレポートは中断しました。",
			TeleportError: "テレポートに失敗しました。また後で試してください。",
			WindowTitle: "地図",
			NoRegionGiven: "サーバからSIMの名前を獲得できませんでした。"
		},
		Network: {
			LoggingOut: "ログアウトしています...",
			LogoutError: "通信エラーによりログアウトに失敗しました。",
			LogoutSuccess: "Second Lifeからログアウトしました。",
			LogoutForced: "Second Lifeから強制ログアウトされました。<br /><br />#{reason}",
			UnhandledMessage: "無効なメッセージ",
			EventQueueFailure: "イベントキューを更新できません。",
			GenericSendError: "データ送信中にエラーが発生しました。",
			InventoryReceive: "#{name}が#{item}を贈ってきました。",
			Error: "エラー",
			Disconnected: "切断しました。"
		},
		StatusBar: {
			Money: "残高",
			LindenDollarSymbol: "L$",
			Loading: " 読み込み中 ...",
			MoneyReceived: "L$#{amount}を受け取りました。",
			MoneyGiven: "L$#{amount}を支払いました。"
		},
		SpatialChat: {
			ThirdPersonShout: "の叫び:",
			SecondPersonShout: "の叫び:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: "のささやき:",
			SecondPersonWhisper: "のささやき:",
			You: "あなた",
			Say: "言う",
			Whisper: "ささやく",
			Shout: "叫ぶ",
			WindowTitle: "チャット"
		},
		Toolbar: {
			ChatButton: "チャット",
			ChatTooltip: "近くの人に向けて話す",
			IMButton: "IM",
			IMTooltip: "遠くの特定の人と話す",
			MapButton: "地図",
			MapTooltip: "グリッドの地図を表示",
			SearchButton: "検索",
			SearchTooltip: "",
			LogoutButton: "ログアウト",
			LogoutTitle: "ログアウト",
			LogoutPrompt: "本当にログアウトしたいのですか?",
			LogoutTooltip: "Second Lifeからログアウトする",
			NearbyButton: "近くの人",
			NearbyTooltop: "あなたの近くにいる人達",
			InventoryButton: "持ち物",
			InventoryTooltip: "持ち物を表示する (変更できません)",
			StatsButton: "統計",
			StatsTooltip: ""
		},
		Widgets: {
			Yes: "はい",
			No: "いいえ",
			Accept: "了承",
			Decline: "辞退",
			OK: "OK",
			Cancel: "キャンセル"
		},
		Search: {
			WindowTitle: "検索",
			Searching: "検索中...",
			People: "人々"
		},
		Profile: {
			WindowTitle: "#{name}のプロフィール",
			Loading: "読み込み中...",
			JoinDate: "登録: #{date}",
			Account: "アカウント:<br />#{type}",
			PaymentInfoOnFile: "支払情報登録済み",
			PaymentInfoUsed: "支払い実績あり",
			LindenAccount: "リンデン社従業員",
			NoPaymentInfo: "支払情報未登録",
			Picks: "お勧め",
			Interests: "興味",
			SecondLife: "セカンドライフ",
			FirstLife: "リアルライフ",
			Groups: "グループ",
			About: "基本情報",
			Name: "名前: #{name}",
			Online: "オンライン",
			Offline: "オフライン",
			Partner: "パートナー:<br />#{partner}",
			None: "(なし)",
			IMButton: "IM",
			PayButton: "支払う",
			PayDialogTitle: "#{first} #{last}への支払い",
			PayDialogPrompt: "いくら#{first} #{last}に支払いますか?",
			InvalidAmount: "支払い金額が不適当です!",
			FriendButton: "フレンド登録",
			ConfirmFriendAdd: "本当に#{first} #{last}をフレンド登録したいのですか?",
			FriendshipOffered: "#{first} #{last}にフレンド登録を頼みました。",
			TeleportButton: "テレポートに誘う",
			TeleportDialogTitle: "#{first} #{last}をテレポートに誘う",
			TeleportDialogPrompt: "テレポートを誘う一言:",
			TeleportDefaultMessage: "Join me in #{sim}! / 私がいる#{sim}に来てください!"
		},
		Texture: {
			DownloadFailed: "テクスチャをダウンロードできませんでした。"
		},
		Number: {
			ThousandSeparatorInterval: 3,
			ThousandSeparator: ",",
			DecimalPoint: "."
		},
		AvatarsNear: {
			WindowTitle: "近くの人々"
		},
		Inventory: {
			WindowTitle: "持ち物"
		},
		InventoryDialogs: {
			Texture: {
				WindowTitle: "テクスチャ: #{name}"
			},
			Notecard: {
				WindowTitle: "ノート: #{name}"
			},
			Script: {
				WindowTitle: "スクリプト: #{name}"
			},
			Landmark: {
				Title: "ランドマークにテレポート",
				Message: "#{name}にテレポートしますか?"
			}
		},
		Stats: {
			WindowTitle: "統計",
			Region: "地区",
			FPS: "FPS",
			TD: "時間の乖離",
			ScriptIPS: "スクリプト速度",
			Objects: "オブジェクト",
			Scripts: "実行中スクリプト",
			Agents: "エージェント",
			ChildAgents: "子エージェント",
			ALServer: "AjaxLifeサーバ",
			Sessions: "セション"
		}
	},
	// by Aurelio A. Heckert (http://aurium.cjb.net)
	pt_br: {
		Friends: {
			OnlineNotification: "#{name} está #{status}.",
			Online: "on-line",
			Offline: "off-line",
			FriendshipOffered: "#{name} quer ser seu amigo. Você aceita?",
			YouAccept: "Você aceitou #{name} como amigo.",
			YouDecline: "Você rejeitou a amizade de #{name}."
		},
		InstantMessage: {
			Typing: "#{name} está digitando...",
			OnlineFriends: "Amigos On-line",
			Send: "Enviar",
			WindowTitle: "Mensagens Instantâneas",
			Profile: "Profile"
		},
		AjaxLife: {
			Precaching: "Pré cache...",
			MOTD: "Mensagem do Dia"
		},
		Map: {
			TeleportConfirm: "Você tem certeza de que quer teleportar-se para #{sim} (#{x}, #{y})?",
			RegionLabel: "Região:",
			PositionLabel: "Posição:",
			TeleportNoun: "Teleporte",
			TeleportVerb: "Teleportar",
			Teleporting: "Teleportando",
			FocusYou: "Foco em você",
			Clear: "Limpar",
			FocusTarget: "Foco no alvo",
			HomeButton: "Ir para Casa",
			HomeConfirm: "Tem certeza de que quer ir para casa?",
			TeleportRequest: "#{name} está te oferecendo um teleporte:<br /><br />#{message}",
			TeleportRequestTitle: "Oferta de Teleporte",
			Teleportation: "Teleportação",
			TeleportSuccess: "Você foi teleportado com sucesso para #{sim} (#{x}, #{y}, #{z})",
			TeleportCancelled: "Seu teleporte foi cancelado.",
			TeleportError: "Seu teleporte falhou. Por favor, tente novamente depois.",
			WindowTitle: "Mapa",
			NoRegionGiven: "O servidor falhou ao enviar o nome do sim onde você está."
			
		},
		Network: {
			LoggingOut: "Saindo...",
			LogoutError: "Não foi possível sair do Second Life por erro na comunicação.",
			LogoutSuccess: "Você saiu do Second Life.",
			LogoutForced: "Você foi desconectado do Second Life:<br /><br />#{reason}",
			UnhandledMessage: "Mensagem Desconhecida",
			EventQueueFailure: "A fila de eventos não pode ser atualizada.",
			GenericSendError: "Um erro ocorreu enquanto os dados eram enviados.",
			InventoryReceive: "#{name} lhe deu um(a) #{item}",
			Error: "Erro",
			Disconnected: "Desconectado"
		},
		StatusBar: {
			Money: "Dinheiro",
			LindenDollarSymbol: "L$",
			Loading: " carregando...",
			MoneyReceived: "Você recebeu L$#{amount}.",
			MoneyGiven: "Você pagou L$#{amount}."
		},
		SpatialChat: {
			ThirdPersonShout: " gritou:",
			SecondPersonShout: " gritou:",
			ThirdPersonSay: ":",
			SecondPersonSay: ":",
			ThirdPersonWhisper: " sussurrou:",
			SecondPersonWhisper: " sussurrou:",
			You: "Você",
			Say: "Disse",
			Whisper: "Sussurrar",
			Shout: "Gritar",
			WindowTitle: "Conversa local"
		},
		Toolbar: {
			ChatButton: "Conversa",
			ChatTooltip: "Falar para as pessoas próximas a você",
			IMButton: "Mensagens Instantâneas",
			IMTooltip: "Comunicar-se com pessoas distantes",
			MapButton: "Mapa",
			MapTooltip: "Mostrar a grade do mapa",
			SearchButton: "Busca",
			SearchTooltip: "",
			LogoutButton: "Sair",
			LogoutTitle: "Sair",
			LogoutPrompt: "Você tem certeza de que quer sair?",
			LogoutTooltip: "Sair do Second Life",
			NearbyButton: "Avatares Próximos",
			NearbyTooltop: "Pessoas nas suas proximidades",
			InventoryButton: "Inventário",
			InventoryTooltip: "Acesso somente para leitura do inventário",
			StatsButton: "Status",
			StatsTooltip: ""
		},
		Widgets: {
			Yes: "Sim",
			No: "Não",
			Accept: "Aceitar",
			Decline: "Rejeitar",
			OK: "OK",
			Cancel: "Cancelar"
		},
		Search: {
			WindowTitle: "Busca",
			Searching: "Procurando...",
			People: "Pessoas"
		},
		Profile: {
			WindowTitle: "Profile - #{name}",
			Loading: "carregando...",
			JoinDate: "Membro desde: #{date}",
			Account: "Conta:<br />#{type}",
			PaymentInfoOnFile: "Informação de pagamento em arquivo",
			PaymentInfoUsed: "Informação de pagamento usada",
			LindenAccount: "Empregado da Linden Lab",
			NoPaymentInfo: "Sem informação de pagamento",
			Picks: "Fotos",
			Interests: "Interesses",
			SecondLife: "2&ordf; Vida",
			FirstLife: "1&ordf; Vida",
			Groups: "Grupos",
			About: "Sobre",
			Name: "Nome: #{name}",
			Online: "On-line",
			Offline: "Off-line",
			Partner: "Parceiro:<br />#{partner}",
			None: "Nenhum",
			IMButton: "Mensagem Instantânea",
			PayButton: "Pagar",
			PayDialogTitle: "Pagando #{first} #{last}",
			PayDialogPrompt: "Quanto você que pagar para #{first} #{last}?",
			InvalidAmount: "Essa quantia de pagamento é invalida!",
			FriendButton: "Adicionar como Amigo",
			ConfirmFriendAdd: "Tem certeza que quer adicionar #{first} #{last} como amigo?",
			FriendshipOffered: "Você ofereceu amizade para #{first} #{last}.",
			TeleportButton: "Oferecer Teleporte",
			TeleportDialogTitle: "Teleportando #{first} #{last}",
			TeleportDialogPrompt: "Adicione uma mensagem à sua oferta de teleporte:",
			TeleportDefaultMessage: "Encontre-me em #{sim}!"
		},
		Texture: {
			DownloadFailed: "Não foi possível baixar a textura."
		},
		Number: {
			ThousandSeparatorInterval: 3,
			ThousandSeparator: ",",
			DecimalPoint: "."
		},
		AvatarsNear: {
			WindowTitle: "Avatares Próximos"
		},
		Inventory: {
			WindowTitle: "Inventário"
		},
		InventoryDialogs: {
			Texture: {
				WindowTitle: "Textura: #{name}"
			},
			Notecard: {
				WindowTitle: "Cartão: #{name}"
			},
			Script: {
				WindowTitle: "Script: #{name}"
			},
			Landmark: {
				Title: "Teleporte para local marcado",
				Message: "Tem certeza de que quer teleportar-se para #{name}?"
			}
		},
		Stats: {
			WindowTitle: "Status",
			Region: "Região",
			FPS: "FPS",
			TD: "Dilatação do Tempo",
			ScriptIPS: "Script IPS",
			Objects: "Objetos",
			Scripts: "Scripts Ativos",
			Agents: "Agentes",
			ChildAgents: "Agentes Filhos",
			ALServer: "Servidor AjaxLife",
			Sessions: "Sessões"
		}
	}
	// More translations here.
};

// Global usage functions.

// This function uses the current language to find the required string.
// It's called "_" because it's used so often.
function _(str, args)
{
	// Avoid complaints about this being null.
	if(!args)
	{
		args = {};
	}
	// Remove anything that's not scalar, make strings safe for display.
	for(var i in args)
	{
		if(typeof(args[i]) == "string")
		{
			args[i] = args[i].escapeHTML().gsub('\n','<br />');
		}
		else if(typeof(args[i]) == "function" || typeof(args[i]) == "object")
		{
			args[i] = "";
		}
	}
	// Find the required part, replace any #{something} codes, and return it.
	var parts = str.split('.');
	if(AjaxLife.Strings[gLanguageCode])
	{
		if(AjaxLife.Strings[gLanguageCode][parts[0]])
		{
			if(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]])
			{
				if(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]][parts[2]])
				{
					return(new Template(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]][parts[2]])).evaluate(args);
				}
				return(new Template(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]])).evaluate(args);
			}
		}
	}
	// If we don't have that language, use English.
	if(AjaxLife.Strings.en)
	{
		if(AjaxLife.Strings.en[parts[0]])
		{
			if(AjaxLife.Strings.en[parts[0]][parts[1]])
			{
				if(AjaxLife.Strings.en[parts[0]][parts[1]][parts[2]])
				{
					return(new Template(AjaxLife.Strings.en[parts[0]][parts[1]][parts[2]])).evaluate(args);
				}
				return(new Template(AjaxLife.Strings.en[parts[0]][parts[1]])).evaluate(args);
			}
		}
	}
	// Give up and return what we were given.
	return str;
};