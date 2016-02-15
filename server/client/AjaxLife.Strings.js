/* Copyright (c) 2008, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *     may be used to endorse or promote products derived from this software
 *     without specific prior written permission.
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
    Language: {
      Direction: "ltr"
    },
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
      Send: "Send",
      WindowTitle: "Instant Messages",
      Profile: "Profile",
      NewIMSession: "#{from} has sent you a new instant message.",
      SessionCreateFailed: "Couldn't create new group chat session.",
      CreatingGroupChat: "Creating new group chat session..."
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
      NoRegionGiven: "The server has failed to send the name of the sim you are in.",
      GodLikeTeleportRequest: "You are being forced to teleport to a Linden.",
      TeleportCompleteMessage: "Completed teleport from #{url}"

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
      Disconnected: "Disconnected",
      Reconnecting: "Attempting to reconnect to server...",
      DeadServer: "It appears that we have lost the connection to the server. Although we will attempt to reconnect, it is likely that the server is down. It is suggested that you try again later."
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
      ContactsButton: "Contacts",
      MapButton: "Map",
      SearchButton: "Search",
      LogoutButton: "Log out",
      LogoutTitle: "Log out",
      LogoutPrompt: "Are you sure you want to log out?",
      NearbyButton: "Nearby Avatars",
      InventoryButton: "Inventory",
      StatsButton: "Stats",
      AudioButton: "Music",
      VideoButton: "Media"
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
      TeleportDefaultMessage: "Join me in #{sim}!",
      DropInventory: "Drop inventory here"
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
      NullAssetTransfer: "An asset request failed.",
      OfferAccepted: "#{name} accepted your inventory offer.",
      OfferDeclined: "#{name} declined your inventory offer.",
      NoFolderTransfer: "Unfortunately, giving folders is not yet supported.",
      NoNoTransferTransfer: "'#{item}' is no transfer, so cannot be given away.",
      ConfirmTransfer: "Are you sure you want to give #{item} to #{first} #{last}?",
      ConfirmNoCopyTransfer: "#{item} is not copyable. If you give it away, you will lose your copy.<br /><br />Do you wish to give #{first} #{last} #{item}?",
      ConfirmTransferTitle: "Inventory transfer",
      Delete: "Delete",
      Properties: "Properties",
      CreateFolder: "Create new folder",
      CreateNote: "Create new notecard",
      EmptyTrash: "Empty trash",
      NewFolderName: "Please enter a name for the folder:",
      NewNoteName: "Please enter a name for the notecard:",
      FolderCreationFailed: "Could not create new folder.",
      CreationFailed: "Could not create new inventory item.",
      ConfirmItemPurge: "Are you sure you wish to permanently delete '#{item}'?",
      ConfirmEmptyTrash: "Are you sure you want to empty the trash?",
      Rename: "Rename",
      RenameItem: "Enter a new name:",
      ScriptRestricted: "You need more permissions to open this script.",
      CopyUUID: "Copy UUID",
      Loading: "Loading contents...",
      MyInventory: "My Inventory",
      InventoryReceivedTitle: "Inventory received",
      InventoryReceived: "#{from} has given you the #{type} '#{name}'"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "Texture: #{name}"
      },
      Notecard: {
        WindowTitle: "Notecard: #{name}",
        Loading: "Loading notecard...",
        Save: "Save"
      },
      Script: {
        WindowTitle: "Script: #{name}"
      },
      Landmark: {
        Title: "Teleport to landmark",
        Message: "Are you sure you want to teleport to #{name}?"
      },
      Properties: {
        Title: "Properties - #{name}",
        Name: "Name:",
        Description: "Description:",
        Creator: "Creator:",
        Owner: "Owner:",
        Acquired: "Acquired:",
        OwnerCan: "Owner can:",
        NextOwnerCan: "Next owner can:",
        MarkItem: "Mark item:",
        ForSale: "For sale",
        Original: "Original",
        Copy: "Copy",
        Price: "Price:",
        Profile: "Profile",
        Unknown: "(unknown)"
      }
    },
    Stats: {
      WindowTitle: "Stats",
      Region: "Region",
      FPS: "FPS",
      TD: "Time Dilation",
      Objects: "Objects",
      Scripts: "Active Scripts",
      Agents: "Agents",
      ChildAgents: "Child Agents",
      ALServer: "AjaxLife Server",
      Sessions: "Sessions",
      PingSim: "Ping sim",
      BandwidthIn: "Incoming bandwidth",
      BandwidthOut: "Outgoing bandwidth",
      DroppedPackets: "Dropped packets"
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
    },
    AssetPermissions: {
      Copy: "Copy",
      NoCopy: "No copy",
      Transfer: "Transfer",
      NoTransfer: "No transfer",
      Modify: "Modify",
      NoModify: "No modify"
    },
    Login: {
      First: "First name",
      Last: "Last name",
      Password: "Password",
      LogIn: "Log in",
      Grid: "Grid",
      Language: "Language",
      EnableSound: "Enable sound",
      LoadingSession: "Loading session data...",
      SessionLoadFailed: "Error loading session data.",
      Encrypting: "Encrypting login data...",
      LoggingIn: "Logging in to Second Life...",
      Error: "Error",
      SomethingWrong: "Despite our best efforts, something has gone wrong.<br /><br />Please try again later.",
      Location: "Start Location",
      Home: "My Home",
      LastPlace: "My Last Location",
      ArbitraryPlace: "<Type region name>" // HTML encoding not needed for the location list.
    },
    Media: {
      AudioTitle: "Music controls",
      VideoTitle: "Parcel media",
      InternetExplorerWarning: "It appears that you are using Internet Explorer. We recommend that you use another browser.\n\nAs you are using Internet Explorer, we must load the DirectX QuickTime control for media playback.\nPlease click any yellow bar asking for permission BEFORE logging in if you wish to listen to media. If you don't see one, that's fine."
    },
    Contacts: {
      WindowTitle: "Contacts",
      OnlineFriends: "Online",
      OfflineFriends: "Offline",
      Groups: "Groups"
    }
  },
  // Translated by Smiley Barry (TG)
  he: {
    Language: {
      Direction: "rtl"
    },
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
      Profile: "פרופיל",
      NewIMSession: "#{from} שלח לך הודעה מיידית חדשה.",
      Groups: "קבוצות",
      SessionCreateFailed: "נכשל הנסיון ליצירת שיחת קבוצה חדשה."
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
      NoRegionGiven: "השרת נכשל לשלוח את שם האזור שאתה בו כרגע.",
      GodLikeTeleportRequest: "אתה משוגר בכוח לנציג חברת לינדן לאב.",
      TeleportCompleteMessage: "השיגור הושלם מכתובת המקום #{url}"

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
      IMButton: "הודעות מיידיות",
      MapButton: "מפה",
      SearchButton: "חפש",
      LogoutButton: "התנתק",
      LogoutTitle: "התנתק",
      LogoutPrompt: "האם אתה בטוח שברצונך להתנתק?",
      NearbyButton: "דמויות קרובות",
      InventoryButton: "מאגר פריטים",
      StatsButton: "סטטיסטיקות"
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
      TeleportDefaultMessage: "הצטרף אליי ב#{sim}!",
      DropInventory: "גרור פריט לפה"
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
      WindowTitle: "מלאי אישי",
      NullAssetTransfer: "התרחשה שגיאה בעת בקשת הנכס.",
      OfferAccepted: "#{name} אישר את הצעת המלאי שלך.",
      OfferDeclined: "#{name} סירב את הצעת המלאי שלך.",
      NoFolderTransfer: "לצערנו, שליחת תיקיות אינה נתמכת כעת.",
      NoNoTransferTransfer: "לצערנו, הפריט #{item} לא ניתן להעברה. כתוצאה מכך, הפריט שלך לא הועבר למשתמש.",
      ConfirmTransfer: "האם אתה בטוח שברצונך לתת את הפריט #{item} למשתמש #{first} #{last}?",
      ConfirmNoCopyTransfer: "#{item} לא ניתן להעתקה, אך ניתן להעברה. אם תמשיך בתהליך, העותק שלך ינתן למשתמש האחר.<br /><br />האם אתה בטוח שברצונך לתת למשתמש #{first} #{last} את הפריט #{item}?",
      ConfirmTransferTitle: "העברת פריטים",
      Delete: "מחק",
      Properties: "מאפיינים",
      CreateFolder: "צור תיקיה חדשה",
      EmptyTrash: "רוקן אשפה",
      NewFolderName: "הכנס שם לתיקיה החדשה:",
      FolderCreationFailed: "שגיאה התרחשה בעת יצירת התיקיה החדשה.",
      ConfirmItemPurge: "האם אתה בטוח כי ברצונך למחוק לצמיתות את הפריט '#{item}'? לא תיתכן אפשרות שיחזור אם תמשיך.",
      ConfirmEmptyTrash: "האם אתה בטוח כי ברצונך לרוקן את האשפה?",
      Rename: "שנה שם",
      RenameItem: "הכנס שם חדש:",
      ScriptRestricted: "אתה צריך רשות שינוי בכדי לראות את קובץ התכנות הזה.",
      CopyUUID: "העתק מזהה (UUID)",
      CreateNote: "צור פתק חדש",
      NewNoteName: "אנא הכנס שם בשביל הפתק החדש:",
      CreationFailed: "נכשל הנסיון ליצירת פריט מלאי חדש.",
      Loading: "טוען תכנים...",
      MyInventory: "המלאי שלי",
      InventoryReceivedTitle: "מלאי התקבל",
      InventoryReceived: "#{from} נתן לך את ה- #{type} '#{name}'" // where #{type} is "object", "notecard" etc. and is currently not translated.
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "טקסטורה: #{name}"
      },
      Notecard: {
        WindowTitle: "פתק: #{name}",
        Loading: "טוען פתק...",
        Save: "שמור"
      },
      Script: {
        WindowTitle: "קובץ תכנות: #{name}",
        Loading: "טוען קובץ תכנות..."
      },
      Landmark: {
        Title: "שגר את דמותך למיקום",
        Message: "האם אתה בטוח שברצונך לשגר את דמותך אל #{name}?"
      },
      Properties: {
        Title: "מאפיינים - #{name}",
        Name: "שם:",
        Description: "תקציר:",
        Creator: "יוצר:",
        Owner: "בעלים:",
        Acquired: "הושג:",
        OwnerCan: "הבעלים יכול...:",
        NextOwnerCan: "הבעלים הבאים יכולים...:",
        MarkItem: "סמן פריט:",
        ForSale: "למכירה",
        Original: "מקורי",
        Copy: "העתק",
        Price: "מחיר:",
        Profile: "פרופיל",
        Unknown: "(לא ידוע)"
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
    },
    ScriptDialogs: {
      PermissionRequestTitle: "הענקת רשות לקובץ תכנות",
      PermissionRequestBody: "'#{object}', אובייקט אשר בעליו הם '#{owner}', רוצה לקבל את ההרשאה הבאה:<br /><br />#{permission}<br />לאשר?",
      DialogMessage: "הפריט '#{object}' של #{first} #{last} אומר:<br />#{message}",
      DialogTitle: "דיאלוג מקובץ תכנות"
    },
    Permissions: {
      Debit: "לקחת כסף (L$) ממך",
      TakeControls: "לדעת על אילו מקשי תנועה אתה לוחץ",
      Animate: "להניע את הדמות שלך באמצעות אנימציה",
      Attach: "להתחבר באופן פיזי לדמותך",
      ChangeLinks: "לחבר ולהינתק מאובייקטים אחרים",
      TrackCamera: "לעקוב אחרי זווית המצלמה שלך",
      ControlCamera: "לשלוט בזווית המצלמה שלך"
    },
    Login: {
      First: "שם פרטי",
      Last: "שם משפחה",
      Password: "סיסמה",
      LogIn: "התחבר",
      Grid: "רשת",
      Language: "שפת ממשק",
      LoadingSession: "טוען את הנתונים שלך...",
      SessionLoadFailed: "שגיאה בעת טעינת הנתונים שלך.",
      Encrypting: "מצפין מידע...",
      LoggingIn: "מתחבר...",
      Error: "שגיאה",
      SomethingWrong: "למרות כל נסיונותינו, משהו השתבש בעת החיבור.<br /><br />אנא נסה שנית מאוחר יותר.",
      Location: "מיקום התחלתי",
      Home: "מיקום הבית שלי",
      LastPlace: "המיקום האחרון שלי",
      ArbitraryPlace: "<כתוב שם אזור/שרת>"
    },
    AssetPermissions: {
      Copy: "מותר להעתיק",
      NoCopy: "אסור להעתיק",
      Transfer: "מותר להעביר",
      NoTransfer: "אסור להעביר",
      Modify: "מותר לשנות",
      NoModify: "אסור לשנות"
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
      YouDecline: "#{name}からのフレンド登録を辞退しました。",
      Groups: "グループ",
      SessionCreateFailed: "グループチャットのセッションを開始できませんでした。"
    },
    InstantMessage: {
      Typing: "#{name}が入力中です...",
      OnlineFriends: "オンラインのフレンド",
      Send: "送る",
      WindowTitle: "IM (インスタントメッセージ)",
      Profile: "プロフィール",
      NewIMSession: "#{from}からIMが来ました。"
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
      NoRegionGiven: "サーバからSIMの名前を獲得できませんでした。",
      GodLikeTeleportRequest: "リンデンがあなたを強制テレポートしています。",
      TeleportCompleteMessage: "#{url} からのテレポートが完了しました。"
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
      IMButton: "IM",
      MapButton: "地図",
      SearchButton: "検索",
      LogoutButton: "ログアウト",
      LogoutTitle: "ログアウト",
      LogoutPrompt: "本当にログアウトしたいのですか?",
      NearbyButton: "近くの人",
      InventoryButton: "持ち物",
      StatsButton: "統計"
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
      TeleportDefaultMessage: "Join me in #{sim}! / 私がいる#{sim}に来てください!",
      DropInventory: "ここに持ち物をドロップ"
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
      WindowTitle: "持ち物",
      NullAssetTransfer: "アセット要求が失敗しました。",
      OfferAccepted: "#{name}がアイテムを受け取りました。",
      OfferDeclined: "#{name}がアイテムを辞退しました。",
      NoFolderTransfer: "今のところ、フォルダごと渡すことはできません。",
      NoNoTransferTransfer: "#{item}は譲渡不可です。他人に渡すことはできません。",
      ConfirmTransfer: "#{first} #{last}に#{item}を渡そうとしています。間違いありませんか?",
      ConfirmNoCopyTransfer: "#{item}はコピー不可です。他人に渡すと、あなたの手元には残りません。<br /><br />#{first} #{last}に#{item}を渡していいですか?",
      ConfirmTransferTitle: "持ち物を渡す",
      Delete: "削除",
      Properties: "プロパティ",
      CreateFolder: "新しいフォルダを作る",
      EmptyTrash: "ごみ箱を空にする",
      NewFolderName: "フォルダの名前:",
      FolderCreationFailed: "フォルダを作れませんでした。",
      ConfirmItemPurge: "'#{item}'を完全に削除します。いいですか?",
      ConfirmEmptyTrash: "ごみ箱の中のものを完全に削除します。いいですか?",
      Rename: "名前の変更",
      RenameItem: "新しい名前:",
      ScriptRestricted: "このスクリプトを開くための許可が不足しています。",
      CopyUUID: "UUIDをコピー",
      CreateNote: "ノートカードの新規作成",
      NewNoteName: "ノートカードの名前を指定:",
      CreationFailed: "アイテムを作成できませんでした。",
      Loading: "コンテントの読込み中 ...",
      MyInventory: "私の持ち物",
      InventoryReceivedTitle: "アイテムの受取り",
      InventoryReceived: "#{from}から'#{name}'という名前の#{type}を受け取りました。"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "テクスチャ: #{name}"
      },
      Notecard: {
        WindowTitle: "ノート: #{name}",
        Loading: "ノートカードの読込み中...",
        Save: "保存"
      },
      Script: {
        WindowTitle: "スクリプト: #{name}",
        Loading: "スクリプトの読込み中..."
      },
      Landmark: {
        Title: "ランドマークにテレポート",
        Message: "#{name}にテレポートしますか?"
      },
      Properties: {
        Title: "#{name}のプロパティ",
        Name: "名前:",
        Description: "説明:",
        Creator: "クリエーター:",
        Owner: "オーナー:",
        Acquired: "入手:",
        OwnerCan: "できること:",
        NextOwnerCan: "次のオーナーができること:",
        MarkItem: "アイテムにマーク:",
        ForSale: "販売用",
        Original: "オリジナル",
        Copy: "コピー",
        Price: "料金:",
        Profile: "プロフィール",
        Unknown: "(不明)"
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
    },
    ScriptDialogs: {
      PermissionRequestTitle: "スクリプトの権限",
      PermissionRequestBody: "'#{owner}'が所有する'#{object}'が、以下の権限を求めています:<br /><br />#{permission}<br />許可しますか?",
      DialogMessage: "#{first} #{last}の'#{object}':<br />#{message}",
      DialogTitle: "スクリプトからのメッセージ"
    },
    Permissions: {
      Debit: "Lindenドル（L$）を徴収する",
      TakeControls: "アバター操作介入する",
      Animate: "アバターに動きをつける",
      Attach: "アバターに装着したり外れたりする",
      ChangeLinks: "他のオブジェクトとリンクしたり解除したりする",
      TrackCamera: "カメラの状態を得る",
      ControlCamera: "カメラを制御する"
    },
    Login: {
      First: "ファーストネーム",
      Last: "ラストネーム",
      Password: "パスワード",
      LogIn: "ログイン",
      Grid: "グリッド",
      Language: "言語",
      LoadingSession: "セション情報を読込んでいます...",
      SessionLoadFailed: "セション情報の読込みエラー",
      Encrypting: "ログインデータの暗号処理中...",
      LoggingIn: "Second Lifeに接続しています...",
      Error: "エラー",
      SomethingWrong: "全力を尽くしたのですが、何か問題が起きました。<br /><br />また後で試してください。",
      Location: "開始する場所",
      Home: "ホーム",
      LastPlace: "最後にいた場所",
      ArbitraryPlace: "<地域名を入力>"
    },
    AssetPermissions: {
      Copy: "コピー可",
      NoCopy: "コピー不可",
      Transfer: "再販/プレゼント可",
      NoTransfer: "再販/プレゼント不可",
      Modify: "修正可",
      NoModify: "修正不可"
    }
  },
  // by Aurelio A. Heckert (http://aurium.cjb.net) and Babel Translations
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
      Profile: "Profile",
      NewIMSession: "#{from} lhe enviou uma nova mensagem instantânea.",
      Groups: "Grupos",
      SessionCreateFailed: "Não foi possível criar uma nova sessão de chat no grupo."
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
      NoRegionGiven: "O servidor falhou ao enviar o nome do sim onde você está.",
      GodLikeTeleportRequest: "Você está sendo forçado a teleportar por um Linden.",
      TeleportCompleteMessage: "Teleporte Completo de #{url}"

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
      IMButton: "Mensagens Instantâneas",
      MapButton: "Mapa",
      SearchButton: "Busca",
      LogoutButton: "Sair",
      LogoutTitle: "Sair",
      LogoutPrompt: "Você tem certeza de que quer sair?",
      NearbyButton: "Avatares Próximos",
      InventoryButton: "Inventário",
      StatsButton: "Status"
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
      TeleportDefaultMessage: "Encontre-me em #{sim}!",
      DropInventory: "Solte o inventário aqui"
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
      WindowTitle: "Inventário",
      NullAssetTransfer: "Uma requisição falhou.",
      OfferAccepted: "#{name} aceitou a sua oferta de inventário.",
      OfferDeclined: "#{name} rejeitou a sua oferta de inventário.",
      NoFolderTransfer: "Infelizmente, as pastas selecionadas ainda não são suportadas.",
      NoNoTransferTransfer: "#{item} não é transferível, portanto não pode ser dado.",
      ConfirmTransfer: "Você tem certeza de que quer dar #{item} para #{first} #{last}?",
      ConfirmNoCopyTransfer: "#{item} não é copiável. Se você der isso mesmo assim, você perderá sua cópia.<br /><br />Você gostaria de dar o item #{item} para #{first} #{last}?",
      ConfirmTransferTitle: "Transferir inventário",
      Delete: "Delete",
      Properties: "Propiedades",
      CreateFolder: "Criar nova pasta",
      EmptyTrash: "Esvaziar lixeira",
      NewFolderName: "Insira um nome para a pasta:",
      FolderCreationFailed: "Não foi possível criar a nova pasta.",
      ConfirmItemPurge: "Você tem certeza de que quer apagar '#{item}' permanentemente?",
      ConfirmEmptyTrash: "Você tem certeza de que quer apagar a lixeira?",
      Rename: "Renomear",
      RenameItem: "Insira um novo nome:",
      ScriptRestricted: "Você precisa de mais permissões para abrir esse script.",
      CopyUUID: "Copiar UUID",
      CreateNote: "Criar um novo Notecard",
      NewNoteName: "Por favor, digite um nome para o Notecard:",
      CreationFailed: "Não foi possível criar o novo item para o inventório.",
      Loading: "Carregando Conteúdos...",
      MyInventory: "Meu Inventário",
      InventoryReceivedTitle: "Inventário Recebido",
      InventoryReceived: "#{from} has given you the #{type} '#{name}'"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "Textura: #{name}"
      },
      Notecard: {
        WindowTitle: "Cartão: #{name}",
        Loading: "Carregando notecard",
        Save: "Salvar"
      },
      Script: {
        WindowTitle: "Script: #{name}",
        Loading: "Carregando script"
      },
      Landmark: {
        Title: "Teleporte para local marcado",
        Message: "Tem certeza de que quer teleportar-se para #{name}?"
      },
      Properties: {
        Title: "Propriedades - #{name}",
        Name: "Nome:",
        Description: "Descrição:",
        Creator: "Criador:",
        Owner: "Dono:",
        Acquired: "Adquirido:",
        OwnerCan: "Dono pode:",
        NextOwnerCan: "Próximo dono poderá:",
        MarkItem: "Fazer item:",
        ForSale: "A venda",
        Original: "Original",
        Copy: "Copia",
        Price: "Preço:",
        Profile: "Profile",
        Unknown: "(desconhecido)"
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
    },
    ScriptDialogs: {
      PermissionRequestTitle: "Requisição de permissão para script",
      PermissionRequestBody: "'#{object}', um objeto de '#{owner}', gostaria de:<br /><br />#{permission}<br />Ok para você?",
      DialogMessage: "'#{object}' de #{first} #{last}:<br />#{message}",
      DialogTitle: "Diálogo de Script"
    },
    Permissions: {
      Debit: "Receber Linden Dollars (L$) de você",
      TakeControls: "Agir em seus controles",
      Animate: "Animar seu avatar",
      Attach: "Anexar em seu avatar",
      ChangeLinks: "Linkar e deslinkar de outros objetos",
      TrackCamera: "Puxar sua câmera",
      ControlCamera: "Controlar sua câmera"
    },
    Login: {
      First: "Primeiro nome",
      Last: "Último nome",
      Password: "Senha",
      LogIn: "Entrar",
      Grid: "Grid",
      Language: "Língua",
      LoadingSession: "Carregando dados da sessão...",
      SessionLoadFailed: "Erro ao carregar dados da sessão.",
      Encrypting: "Encriptando dados de login...",
      LoggingIn: "Entrando no Second Life...",
      Error: "Erro",
      SomethingWrong: "Apesar dos nossos esforços, algo correu de errado.<br /><br />Por favor, tente novamente mais tarde.",
      Location: "Local Inicial",
      Home: "Minha Casa",
      LastPlace: "Minha Última Localização",
      ArbitraryPlace: "<Digite o nome da região>"
    },
    AssetPermissions: {
      Copy: "Copiar",
      NoCopy: "Não copiar",
      Transfer: "Transferir",
      NoTransfer: "Não transferir",
      Modify: "Modificar",
      NoModify: "Não modificar"
    }
  },
  // Mariel Voyunicef
  es: {
    Friends: {
      OnlineNotification: "#{name} se ha #{status}.",
      Online: "conectado",
      Offline: "desconectado",
      FriendshipOffered: "#{name} te ha ofrecido su amistad. ¿Vas a aceptar?",
      YouAccept: "Aceptaste a #{name} como un amigo.",
      YouDecline: "Declinaste el ofrecimiento de amistad de #{name}."
    },
    InstantMessage: {
      Typing: "#{name} está escribiendo...",
      OnlineFriends: "Amigos conectados",
      Send: "Enviar",
      WindowTitle: "Mensajes instantáneos",
      Profile: "Perfil"
    },
    AjaxLife: {
      Precaching: "Preparando el precache...",
      MOTD: "Mensaje del día"
    },
    Map: {
      TeleportConfirm: "¿Estás seguro de querer teletransportarte a #{sim} (#{x}, #{y})?",
      RegionLabel: "Región:",
      PositionLabel: "Posición:",
      TeleportNoun: "Teletransportación",
      TeleportVerb: "Teletransportar",
      Teleporting: "Teletransportando",
      FocusYou: "Enfocar sobre ti",
      Clear: "Limpiar",
      FocusTarget: "Enfocar el destino",
      HomeButton: "Ir a lugar de inicio",
      HomeConfirm: "¿Estás seguro de querer ir a tu lugar de inicio?",
      TeleportRequest: "#{name} te ha ofrecido teletransportarte:<br /><br />#{message}",
      TeleportRequestTitle: "Ofrecimiento de teletransportación",
      Teleportation: "Teletransportación",
      TeleportSuccess: "Has sido teletransportado con éxito a #{sim} (#{x}, #{y}, #{z})",
      TeleportCancelled: "Tu teletransportación fue cancelada.",
      TeleportError: "Tu teletransportación no tuvo éxito. Por favor intenta de nuevo más tarde.",
      WindowTitle: "Mapa",
      NoRegionGiven: "El servidor no mandó el nombre del simulador en el que estás."
    },
    Network: {
      LoggingOut: "Desconectando...",
      LogoutError: "No se pudo desconectar de Second Life por un error de comunicación.",
      LogoutSuccess: "Te has desconectado de Second Life.",
      LogoutForced: "Has sido desconectado de Second Life:<br /><br />#{reason}",
      UnhandledMessage: "Mensaje no procesado",
      EventQueueFailure: "La fila de eventos en espera no pudo ser actualizada.",
      GenericSendError: "Un error ocurrió mientras se enviaba los datos.",
      InventoryReceive: "#{name} te dio #{item}",
      Error: "Error",
      Disconnected: "Desconectado"
    },
    StatusBar: {
      Money: "Dinero",
      LindenDollarSymbol: "L$",
      Loading: " cargando...",
      MoneyReceived: "Fuiste pagado L$#{amount}.",
      MoneyGiven: "Pagaste L$#{amount}."
    },
    SpatialChat: {
      ThirdPersonShout: " grita:",
      SecondPersonShout: " gritas:",
      ThirdPersonSay: ":",
      SecondPersonSay: ":",
      ThirdPersonWhisper: " susurra:",
      SecondPersonWhisper: " susurras:",
      You: "Tú",
      Say: "Decir",
      Whisper: "Susurrar",
      Shout: "Gritar",
      WindowTitle: "Chat local"
    },
    Toolbar: {
      ChatButton: "Chat",
      IMButton: "Mensajes instantáneos",
      MapButton: "Mapa",
      SearchButton: "Buscar",
      LogoutButton: "Desconectar",
      LogoutPrompt: "¿Estás seguro de querer desconectarte?",
      NearbyButton: "Avatars cercanos",
      InventoryButton: "Inventario",
      StatsButton: "Estadísticas"
    },
    Widgets: {
      Yes: "Sí",
      No: "No",
      Accept: "Aceptar",
      Decline: "Declinar",
      OK: "OK",
      Cancel: "Cancelar"
    },
    Search: {
      WindowTitle: "Buscar",
      Searching: "Buscando...",
      People: "Gente"
    },
    Profile: {
      WindowTitle: "Perfil - #{name}",
      Loading: "Cargando...",
      JoinDate: "Creación: #{date}",
      Account: "Cuenta:<br />#{type}",
      PaymentInfoOnFile: "Información de pago registrada",
      PaymentInfoUsed: "Información de pago usada",
      LindenAccount: "Empleado de Linden Lab",
      NoPaymentInfo: "Sin información de pago",
      Picks: "Favoritos",
      Interests: "Intereses",
      SecondLife: "2da vida",
      FirstLife: "1a vida",
      Groups: "Grupos",
      About: "Acerca",
      Name: "Nombre: #{name}",
      Online: "Conectado",
      Offline: "Desconectado",
      Partner: "Pareja:<br />#{partner}",
      None: "Ninguno",
      IMButton: "Mensaje instantáneo",
      PayButton: "Pagar",
      PayDialogTitle: "Pagando #{first} #{last}",
      PayDialogPrompt: "¿Cuánto le quieres pagar a #{first} #{last}?",
      InvalidAmount: "¡Ésa es una cantidad a pagar inválida!",
      FriendButton: "Agregar amigo",
      ConfirmFriendAdd: "¿Estás seguro de que quieres agregar a #{first} #{last} como amigo?",
      FriendshipOffered: "Le has ofrecido a #{first} #{last} tu amistad.",
      TeleportButton: "Ofrecer TP",
      TeleportDialogTitle: "Teletransportando a #{first} #{last}",
      TeleportDialogPrompt: "Escribe un mensaje para agregar a tu ofrecimiento de teletransportación:",
      TeleportDefaultMessage: "¡Ven conmigo a #{sim}!"
    },
    Texture: {
      DownloadFailed: "No se pudo descargar la textura."
    },
    Number: {
      ThousandSeparatorInterval: 3,
      ThousandSeparator: ",",
      DecimalPoint: "."
    },
    AvatarsNear: {
      WindowTitle: "Avatars que están cerca"
    },
    Inventory: {
      WindowTitle: "Inventario",
      NullAssetTransfer: "El pedido de un recurso falló.",
      OfferAccepted: "#{name} aceptó tu ofrecimiento de inventario.",
      OfferDeclined: "#{name} declinó tu ofrecimiento de inventario.",
      NoFolderTransfer: "Desafortunadamente, todavía no se puede dar carpetas enteras.",
      NoNoTransferTransfer: "'#{item}' es de no transferencia, por lo que no lo puedes transferir.",
      ConfirmTransfer: "¿Estás seguro de que quieres darle #{item} a #{first} #{last}?",
      ConfirmNoCopyTransfer: "#{item} no se puede copiar. Si lo das, vas a perder tu copia.<br /><br />¿Le quieres dar a #{first} #{last} #{item}?",
      ConfirmTransferTitle: "Transferencia de inventario"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "Textura: #{name}"
      },
      Notecard: {
        WindowTitle: "Nota: #{name}"
      },
      Script: {
        WindowTitle: "Script: #{name}"
      },
      Landmark: {
        Title: "Teletransportar a punto de referencia",
        Message: "¿Estás seguro de querer teletransportarte a #{name}?"
      }
    },
    Stats: {
      WindowTitle: "Estadísticas",
      Region: "Región",
      FPS: "FPS",
      TD: "Dilatación de tiempo",
      ScriptIPS: "Script IPS",
      Objects: "Objetos",
      Scripts: "Scripts activos",
      Agents: "Agentes",
      ChildAgents: "Agents tipo child",
      ALServer: "Servidor de AjaxLife",
      Sessions: "Sesiones"
    },
    ScriptDialogs: {
      PermissionRequestTitle: "Pedido de permiso de script",
      PermissionRequestBody: "'#{object}', un objeto que pertenece a '#{owner}', quiere que:<br /><br />#{permission}<br />¿Está bien?",
      DialogMessage: "El '#{object}' de #{first} #{last}:<br />#{message}",
      DialogTitle: "Diálogo de script"
    },
    Permissions: {
      Debit: "Tomar dólares Linden (L$) de tu cuenta",
      TakeControls: "Actuar conforme a las entradas de control",
      Animate: "Animar tu avatar",
      Attach: "Adjuntar a tu avatar",
      ChangeLinks: "Unir y separar de otros objetos",
      TrackCamera: "Sigue a tu cámara",
      ControlCamera: "Controla tu cámara"
    },
    Login: {
      First: "Nombre",
      Last: "Apellido",
      Password: "Contraseña",
      LogIn: "Conectar",
      Grid: "Grid",
      Language: "Idioma",
      LoadingSession: "Cargando datos de sesión...",
      SessionLoadFailed: "Error cargando datos de sesión.",
      Encrypting: "Encriptando datos de sesión...",
      LoggingIn: "Entrando a Second Life...",
      Error: "Error",
      SomethingWrong: "A pesar de nuestros más grandes esfuerzos, algo se equivocó.<br /><br />Por favor intenta de nuevo más tarde."
    }
  },
  // Arthur Kokcharov (www.secondforum.de)
  de: {
    Friends: {
      OnlineNotification: "#{name} ist #{status}.",
      Online: "online",
      Offline: "offline",
      FriendshipOffered: "#{name} bietet Dir Freundschaft an. Willst Du sie akzeptieren?",
      YouAccept: "Du hast #{name} als Freund akzeptiert.",
      YouDecline: "Du hast #{name} als Freund abgelehnt."
    },
    InstantMessage: {
      Typing: "#{name} tippt...",
      OnlineFriends: "Freunde online",
      Send: "Senden",
      WindowTitle: "Instant Messages",
      Profile: "Profil",
      NewIMSession: "#{from} hat Dir eine neue Nachricht.",
      Groups: "Gruppen",
      SessionCreateFailed: "Es konnte keine neue Gruppen-Sitzung gestartet werden."
    },
    AjaxLife: {
      Precaching: "Lädt...",
      MOTD: "News des Tages"
    },
    Map: {
      TeleportConfirm: "Möchtest Du Dich wirklich zum #{sim} (#{x}, #{y}) teleportieren?",
      RegionLabel: "Region:",
      PositionLabel: "Position:",
      TeleportNoun: "Teleport",
      TeleportVerb: "Teleport",
      Teleporting: "Teleport",
      FocusYou: "Meine Position",
      Clear: "Löschen",
      FocusTarget: "Ziel anzeigen",
      HomeButton: "Nach Hause",
      HomeConfirm: "Möchtest Du wirklich nach Hause?",
      TeleportRequest: "#{name} bietet Dir einen Teleport an:<br /><br />#{message}",
      TeleportRequestTitle: "Teleport Angebot",
      Teleportation: "Teleport",
      TeleportSuccess: "Du wurdest erfolgreich nach #{sim} (#{x}, #{y}, #{z}) teleportiert",
      TeleportCancelled: "Dein Teleport wurde leider abgebrochen.",
      TeleportError: "Du konntest leider nicht teleporteirt werden. Bitte versuche es später nochmal.",
      WindowTitle: "Karte",
      NoRegionGiven: "Der Server konnte die Sim auf der Du Dich gerade befindest nicht ermitteln.",
      GodLikeTeleportRequest: "Sie wurden gezwungen sich zu einem Linden zu teleportieren.",
      TeleportCompleteMessage: "Teleport von #{url} beendet."

    },
    Network: {
      LoggingOut: "Meldet ab...",
      LogoutError: "Du konntest Dich wegen einem Kommunikationsfehler nicht abmelden.",
      LogoutSuccess: "Du wurdest von Second Life abgemeldet.",
      LogoutForced: "Du wurdest von Second Life abgemeldet:<br /><br />#{reason}",
      UnhandledMessage: "Unhandled message",
      EventQueueFailure: "Die Anfrage konnte nicht aktualisiert werden.",
      GenericSendError: "Ein Fehler während des Sendens der Daten.",
      InventoryReceive: "#{name} gab Dir #{item}",
      Error: "Fehler",
      Disconnected: "Verbindung wurde getrennt."
    },
    StatusBar: {
      Money: "Geld",
      LindenDollarSymbol: "L$",
      Loading: " lädt...",
      MoneyReceived: "Du hast L$#{amount} bekommen.",
      MoneyGiven: "Du hast L$#{amount} bezahlt."
    },
    SpatialChat: {
      ThirdPersonShout: " schreit:",
      SecondPersonShout: " schreist:",
      ThirdPersonSay: ":",
      SecondPersonSay: ":",
      ThirdPersonWhisper: " flüstert:",
      SecondPersonWhisper: " flüsterst:",
      You: "Du",
      Say: "sagen",
      Whisper: "flüstern",
      Shout: "schreien",
      WindowTitle: "Chat Verlauf"
    },
    Toolbar: {
      ChatButton: "Chat",
      IMButton: "Unterhalten",
      MapButton: "Karte",
      SearchButton: "Suchen",
      LogoutButton: "Abmelden",
      LogoutTitle: "Abmelden",
      LogoutPrompt: "Möchtest Du Dich wirklich abmelden?",
      NearbyButton: "Avatare in Deiner Nähe",
      InventoryButton: "Inventar",
      StatsButton: "Status"
    },
    Widgets: {
      Yes: "Ja",
      No: "Nein",
      Accept: "Akzeptiert",
      Decline: "Abgelehnt",
      OK: "OK",
      Cancel: "Abbrechen"
    },
    Search: {
      WindowTitle: "Suchen",
      Searching: "Suchen...",
      People: "Leute"
    },
    Profile: {
      WindowTitle: "Profil - #{name}",
      Loading: "Laden...",
      JoinDate: "Geboren am: #{date}",
      Account: "Konto:<br />#{type}",
      PaymentInfoOnFile: "Zahlungsinfo verwendete",
      PaymentInfoUsed: "Zahlungsinfo verwendet",
      LindenAccount: "Linden Lab Mitarbeiter",
      NoPaymentInfo: "Keine Zahlungsinfo verwendet",
      Picks: "Foto",
      Interests: "Interessen",
      SecondLife: "2nd Life",
      FirstLife: "1st Life",
      Groups: "Gruppen",
      About: "Info",
      Name: "Name: #{name}",
      Online: "Online",
      Offline: "Offline",
      Partner: "Partner:<br />#{partner}",
      None: "",
      IMButton: "Instant Message",
      PayButton: "Zahlen",
      PayDialogTitle: " Zahle #{first} #{last}",
      PayDialogPrompt: "Wieviel möchtest Du #{first} #{last} bezahlen?",
      InvalidAmount: "Die ist eine unzulässige Menge, zum bezahlen!",
      FriendButton: "Als Freund hinzufügen",
      ConfirmFriendAdd: "Bist Du Dir sicher, dass Du #{first} #{last} als Freund hinzufügen möchtest?",
      FriendshipOffered: "Du hast #{first} #{last} die Freundscaft angebotren.",
      TeleportButton: "Teleport anbieten",
      TeleportDialogTitle: " #{first} #{last} einen Teleport anbieten.",
      TeleportDialogPrompt: "Schreibe eine Message zu Deinem Teleport:",
      TeleportDefaultMessage: "Besuche mich auf #{sim}!",
      DropInventory: "Inventar hier absetzen"
    },
    Texture: {
      DownloadFailed: "Die Texture konnte nicht heruntergeladen werden."
    },
    Number: {
      ThousandSeparatorInterval: 3,
      ThousandSeparator: ",",
      DecimalPoint: "."
    },
    AvatarsNear: {
      WindowTitle: "Avatare in Deiner Nähe."
    },
    Inventory: {
      WindowTitle: "Inventar",
      NullAssetTransfer: "Eine betimmte Anfrage scheiterte.",
      OfferAccepted: "#{name} hat ihr Inventarangebot angenommen.",
      OfferDeclined: "#{name} hat ihr Inventarangebot abgelehnt.",
      NoFolderTransfer: "Leider ist das Verschieben des Ordner momentan nicht möglich.",
      NoNoTransferTransfer: "'#{item}' ist no transfer, so kann es nicht verschickt werden.",
      ConfirmTransfer: "Bis Du Dir sicher, dass Du #{item} an #{first} #{last} geben möchtest?",
      ConfirmNoCopyTransfer: "#{item} kann nicht kopiert werden. Wenn Du das Objekt hergibst verlierst Du Deine Kopie.<br /><br />Willst Du #{first} #{last} #{item} geben?",
      ConfirmTransferTitle: "Inventar transfer",
      Delete: "Löschen",
      Properties: "Eigenschaften",
      CreateFolder: "Neuen Ordner erstellen",
      EmptyTrash: "Mülleimer leeren",
      NewFolderName: "Name des neuen Ordners:",
      FolderCreationFailed: "Es konnte kein neuer Ordner erstellt werden.",
      ConfirmItemPurge: "Bist Du sicher, dass Du '#{item} permanent löschen möchtest'?",
      ConfirmEmptyTrash: "Bist Du sicher, dass Du den Mülleimer leeren möchtest?",
      Rename: "Umbennen",
      RenameItem: "Trage den neuen Namen ein:",
      ScriptRestricted: "Du hast nicht genügend Rechte das Skript zu öffnen.",
      CopyUUID: "Kopiere die UUID",
      CreateNote: "Neue Notiz erstellen",
      NewNoteName: "Bitte tragen Sie einen Namen für die Notiz ein:",
      CreationFailed: "Es konnte kein neuer Gegestand im Inventar erstellt werden.",
      Loading: "Inhalt wird geladen...",
      MyInventory: "Mein Inventar",
      InventoryReceivedTitle: "Inventar empfängt",
      InventoryReceived: "#{from} hat dir #{type} '#{name}' gegeben"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "Textur: #{name}"
      },
      Notecard: {
        WindowTitle: "Notiz: #{name}",
        Loading: "Notiz wird geladen...",
        Save: "Speichern"
      },
      Script: {
        WindowTitle: "Skript: #{name}",
        Loading: "Skript wird geladen..."
      },
      Landmark: {
        Title: "Teleport zum Landmark",
        Message: "Willst Du Dich wirklich nach #{name} teleportieren?"
      },
      Properties: {
        Title: "Eigenschaften - #{name}",
        Name: "Name:",
        Description: "Beschreibung:",
        Creator: "Ersteller:",
        Owner: "Eigentümer:",
        Acquired: "Gruppe:",
        OwnerCan: "Der Eigentümer kann:",
        NextOwnerCan: "Der nächste Eigentümer kann:",
        MarkItem: "Objekt merken:",
        ForSale: "Zu verkaufen",
        Original: "Original",
        Copy: "Kopie",
        Price: "Preis:",
        Profile: "Profil",
        Unknown: "(unbekannt)"
      }
    },
    Stats: {
      WindowTitle: "Status",
      Region: "Region",
      FPS: "FPS",
      TD: "Time Dilation",
      ScriptIPS: "Script IPS",
      Objects: "Objekte",
      Scripts: "Active Skripte",
      Agents: "Agenten",
      ChildAgents: "Child Agenten",
      ALServer: "AjaxLife Server",
      Sessions: "Sessions"
    },
    ScriptDialogs: {
      PermissionRequestTitle: "Script permission request",
      PermissionRequestBody: "'#{object}', ein Objekt von '#{owner}', würde gerne:<br /><br />#{permission}<br />Ist das ok?",
      DialogMessage: "#{first} #{last}'s '#{object}':<br />#{message}",
      DialogTitle: "Script dialog"
    },
    Permissions: {
      Debit: "Linden Dollars (L$) von Dir nehmen",
      TakeControls: "Ihre Steuerelemente beeinflussen",
      Animate: "Ihren Avatar animieren",
      Attach: "sich an Ihrem Avatar festhalten",
      ChangeLinks: "Verlinken von Objekten",
      TrackCamera: "Kamera finden",
      ControlCamera: "Kamera kontrollieren"
    },
    Login: {
      First: "Vorname",
      Last: "Nachname",
      Password: "Passwort",
      LogIn: "Einloggen",
      Grid: "Grid",
      Language: "Sprache",
      LoadingSession: "Daten laden...",
      SessionLoadFailed: "Fehler beim Laden der Daten.",
      Encrypting: "Logindaten verschlüsseln...",
      LoggingIn: "Logging in Second Life...",
      Error: "Fehler",
      SomethingWrong: "Wir haben unser Bestes versucht, aber etwas ging hier schief.<br /><br />Versuche es später noch einmal.",
      Location: "Startposition",
      Home: "Mein Zuhause",
      LastPlace: "Meine letzte Position",
      ArbitraryPlace: "<Regionsname>"
    }
  },
  fr: {
    Friends: {
      OnlineNotification: "#{name} est #{status}.",
      Online: "online",
      Offline: "offline",
      FriendshipOffered: "#{name} vous propose d'être son ami. Acceptez vous ?",
      YouAccept: "Vous avez accepté #{name} comme ami.",
      YouDecline: "vous avez refusé #{name} comme ami."
    },
    InstantMessage: {
      Typing: "#{name} tape un message...",
      OnlineFriends: "Amis online",
      Send: "Envoyé",
      WindowTitle: "Messages instantanés",
      Profile: "Profil"
    },
    AjaxLife: {
      Precaching: "Mise en cache...",
      MOTD: "Message du jour"
    },
    Map: {
      TeleportConfirm: "Êtes vous sur de vouloir vous téléporter vers #{sim} (#{x}, #{y})?",
      RegionLabel: "Region:",
      PositionLabel: "Position:",
      TeleportNoun: "Teleportation",
      TeleportVerb: "Teleporter",
      Teleporting: "Teleportation",
      FocusYou: "Focus sur vous",
      Clear: "Nettoyer",
      FocusTarget: "Focus sur la destination",
      HomeButton: "Aller vers Home",
      HomeConfirm: "Êtes vous sur de vouloir aller vers Home ?",
      TeleportRequest: "#{name} vous invite à vous téléporter:<br /><br />#{message}",
      TeleportRequestTitle: "demande de téléportation",
      Teleportation: "Teleportation",
      TeleportSuccess: "Vous vous êtes téléporté avec succès vers #{sim} (#{x}, #{y}, #{z})",
      TeleportCancelled: "Votre téléportation a été annulée.",
      TeleportError: "Votre téléportation n'a pas fontionné. Essayez plus tard.",
      WindowTitle: "carte",
      NoRegionGiven: "Le serveur n'a pas réussi à envoyé de le nom de la sim dans laquelle vous êtes."

    },
    Network: {
      LoggingOut: "déconnexion...",
      LogoutError: "Ne peut pas se déconnecter de Second Life, du à un problème de communication.",
      LogoutSuccess: "Vous êtes déconnectés de Second Life.",
      LogoutForced: "Vous avez été déconnecté de Second Life:<br /><br />#{reason}",
      UnhandledMessage: "Unhandled message",
      EventQueueFailure: "La file des évènements n'a pas pu être mise à jour.",
      GenericSendError: "Un erreur est survenue en envoyant les données.",
      InventoryReceive: "#{name} vous a donné #{item}",
      Error: "Erreur",
      Disconnected: "Déconnecté"
    },
    StatusBar: {
      Money: "Argent",
      LindenDollarSymbol: "L$",
      Loading: " loading...",
      MoneyReceived: "Vous avez été payé #{amount} L$.",
      MoneyGiven: "Vous avez payé #{amount} L$."
    },
    SpatialChat: {
      ThirdPersonShout: " crie:",
      SecondPersonShout: " crie:",
      ThirdPersonSay: ":",
      SecondPersonSay: ":",
      ThirdPersonWhisper: " chuchote :",
      SecondPersonWhisper: " chuchote :",
      You: "Vous",
      Say: "Dites",
      Whisper: "Chuchotez",
      Shout: "criez",
      WindowTitle: "Chat local"
    },
    Toolbar: {
      ChatButton: "Chat",
      IMButton: "Messagerie instantanée",
      MapButton: "Carte",
      SearchButton: "Recherche",
      LogoutButton: "Déconnexion",
      LogoutTitle: "Déconnexion",
      LogoutPrompt: "Êtes vous sur de vouloir vous déconnecter ?",
      NearbyButton: "Avatars autour de vous",
      InventoryButton: "Inventaire",
      StatsButton: "Stats"
    },
    Widgets: {
      Yes: "Oui",
      No: "Non",
      Accept: "Accepter",
      Decline: "Refuser",
      OK: "OK",
      Cancel: "Annuler"
    },
    Search: {
      WindowTitle: "Recherche",
      Searching: "recherche...",
      People: "Personnes"
    },
    Profile: {
      WindowTitle: "Profil - #{name}",
      Loading: "Loading...",
      JoinDate: "Inscrit: #{date}",
      Account: "Compte:<br />#{type}",
      PaymentInfoOnFile: "Informations paiement sur le fichier",
      PaymentInfoUsed: "Information paiement utilisée",
      LindenAccount: "Employé Linden Lab",
      NoPaymentInfo: "Pa d'information paiement",
      Picks: "Picks",
      Interests: "Interêts",
      SecondLife: "2eme vie",
      FirstLife: "1e vie",
      Groups: "Groupes",
      About: "A propos",
      Name: "Nom: #{name}",
      Online: "Online",
      Offline: "Offline",
      Partner: "Partenaire:<br />#{partner}",
      None: "Aucun",
      IMButton: "Message instantané",
      PayButton: "Payer",
      PayDialogTitle: "Payer #{first} #{last}",
      PayDialogPrompt: "Combien voulez vous payer #{first} #{last}?",
      InvalidAmount: "Mauvais montant à payer!",
      FriendButton: "Ajouter comme ami",
      ConfirmFriendAdd: "Êtes vous sur de vouloir ajouter #{first} #{last} comme ami ?",
      FriendshipOffered: "Vous avez demandé à #{first} #{last} d'être votre ami.",
      TeleportButton: "Inviter TP",
      TeleportDialogTitle: "Teleportation de #{first} #{last}",
      TeleportDialogPrompt: "Entrer un message à envoyer avec votre offre de téléportation:",
      TeleportDefaultMessage: "Retrouve moi à #{sim}!"
    },
    Texture: {
      DownloadFailed: "Impossible de télécharger la texture."
    },
    Number: {
      ThousandSeparatorInterval: 3,
      ThousandSeparator: " ",
      DecimalPoint: ","
    },
    AvatarsNear: {
      WindowTitle: "Avatars autour de vous"
    },
    Inventory: {
      WindowTitle: "Inventaire",
      NullAssetTransfer: "Une requête à échoué.",
      OfferAccepted: "#{name} a accepté votre offre.",
      OfferDeclined: "#{name} a refusé votre offre.",
      NoFolderTransfer: "Malheureusement, donner des répertoires n'est pas encore supporté.",
      NoNoTransferTransfer: "'#{item}' est no-transfer, donc ne peut pas être donné.",
      ConfirmTransfer: "Êtes vous sur de vouloir donner #{item} à #{first} #{last}?",
      ConfirmNoCopyTransfer: "#{item} n'est pas copiable. Si vous le donnez, vous perdrez votre copie.<br /><br />Voulez vous donner #{item} à #{first} #{last} ?",
      ConfirmTransferTitle: "Transfert d'inventaire"
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
        Title: "Se téléporter vers le landmark",
        Message: "Êtes vous sur de vouloir vous téléporter vers #{name}?"
      }
    },
    Stats: {
      WindowTitle: "Stats",
      Region: "Région",
      FPS: "FPS",
      TD: "Dilation temporelle",
      ScriptIPS: "Script IPS",
      Objects: "Objets",
      Scripts: "Scripts actifs",
      Agents: "Agents",
      ChildAgents: "Child Agents",
      ALServer: "Serveur AjaxLife",
      Sessions: "Sessions"
    },
    ScriptDialogs: {
      PermissionRequestTitle: "Requête de permission du script",
      PermissionRequestBody: "'#{object}', un objet détenu par '#{owner}', voudrait:<br /><br />#{permission}<br />Est ce d'accord ?",
      DialogMessage: "'#{object}' de #{first} #{last} :<br />#{message}",
      DialogTitle: "Script dialog"
    },
    Permissions: {
      Debit: "Vous retire des Linden Dollars (L$) de votre capital",
      TakeControls: "Agit sur le controle",
      Animate: "Anime votre avatar",
      Attach: "Attache à votre avatar",
      ChangeLinks: "Lier et délier depuis d'autres objets",
      TrackCamera: "Piste votre caméra",
      ControlCamera: "Controle votre caméra"
    },
    Login: {
      First: "Prénom",
      Last: "Nom",
      Password: "Mot de passe",
      LogIn: "Se connecter",
      Grid: "Grille",
      Language: "Langue",
      LoadingSession: "Chargement des données de la session...",
      SessionLoadFailed: "Erreur lors du chargement des données de la session.",
      Encrypting: "cryptage des données de connexion...",
      LoggingIn: "Connexion à Second Life...",
      Error: "Erreur",
      SomethingWrong: "Malgré tous nos efforts, quelquechose ne fonctionne pas.<br /><br />Veuillez essayer plus tard."
    }
  },
  // Translated by Roc Furse and Babel Translations
  nl: {
    Language: {
      Direction: "ltr"
    },
    Friends: {
      OnlineNotification: "#{name} is #{status}.",
      Online: "online",
      Offline: "offline",
      FriendshipOffered: "#{name} heeft vriendschap aangeboden. Wil je het aanbod accepteren?",
      YouAccept: "Je hebt #{name} geaccepteerd als vriend.",
      YouDecline: "Je hebt #{name}'s aanbod voor vriendschap afgewezen."
    },
    InstantMessage: {
      Typing: "#{name} is aan het typen...",
      OnlineFriends: "Online vrienden",
      Send: "Versturen",
      WindowTitle: "Berichten",
      Profile: "Profiel",
      NewIMSession: "#{from} heeft je een bericht gestuurd.",
      Groups: "Groepen",
      SessionCreateFailed: "Kan geen nieuwe groep chat-sessie creeëren."
    },
    AjaxLife: {
      Precaching: "Buffer vullen...",
      MOTD: "Bericht van de dag"
    },
    Map: {
      TeleportConfirm: "Weet je zeker dat je wilt teleporteren naar #{sim} (#{x}, #{y})?",
      RegionLabel: "Gebied:",
      PositionLabel: "Positie:",
      TeleportNoun: "Teleport",
      TeleportVerb: "Teleporteren",
      Teleporting: "Teleporteren",
      FocusYou: "Toon jou",
      Clear: "Wissen",
      FocusTarget: "Toon doel",
      HomeButton: "Ga naar huis",
      HomeConfirm: "Weet je zeker dat je naar huis wilt teleporteren?",
      TeleportRequest: "#{name} heeft je een teleport aangeboden:<br /><br />#{message}",
      TeleportRequestTitle: "Teleport aanbod",
      Teleportation: "Teleportatie",
      TeleportSuccess: "Je bent succesvol geteleporteerd naar #{sim} (#{x}, #{y}, #{z})",
      TeleportCancelled: "Je teleport is afgebroken.",
      TeleportError: "Je teleport is niet gelukt. Probeer het later nog eens.",
      WindowTitle: "Kaart",
      NoRegionGiven: "De naam van de huidige sim is niet ontvangen van de server.",
      GodLikeTeleportRequest: "Je wordt gedwongen om naar een Linden te teleporteren",
      TeleportCompleteMessage: "Afgesloten teleport van  #{url}"

    },
    Network: {
      LoggingOut: "Bezig met uitloggen...",
      LogoutError: "Kon Second Life niet verlaten vanwege een communicatie fout.",
      LogoutSuccess: "Je hebt Second Life verlaten.",
      LogoutForced: "Je hebt Second Life verlaten:<br /><br />#{reason}",
      UnhandledMessage: "Niet verwerkbaar bericht",
      EventQueueFailure: "De gebeurtenis-wachtrij kon niet worden bijgewerkt.",
      GenericSendError: "Bij het versturen van gegevens is een fout opgetreden.",
      InventoryReceive: "#{name} gaf je #{item}",
      Error: "Fout",
      Disconnected: "Verbinding verbroken"
    },
    StatusBar: {
      Money: "Geld",
      LindenDollarSymbol: "L$",
      Loading: " laden...",
      MoneyReceived: "Je hebt L$#{amount} ontvangen.",
      MoneyGiven: "Je hebt L$#{amount} betaald."
    },
    SpatialChat: {
      ThirdPersonShout: " roept:",
      SecondPersonShout: " roept:",
      ThirdPersonSay: ":",
      SecondPersonSay: ":",
      ThirdPersonWhisper: " fluistert:",
      SecondPersonWhisper: " fluistert:",
      You: "Jij",
      Say: "Zeg",
      Whisper: "Fluister",
      Shout: "Roep",
      WindowTitle: "Gesprekken om je heen"
    },
    Toolbar: {
      ChatButton: "Gesprek",
      IMButton: "Berichten",
      MapButton: "Kaart",
      SearchButton: "Zoek",
      LogoutButton: "Log uit",
      LogoutTitle: "Log uit",
      LogoutPrompt: "Weet je zeker dat je wilt uitloggen?",
      NearbyButton: "Avatars vlakbij",
      InventoryButton: "Inventaris",
      StatsButton: "Status"
    },
    Widgets: {
      Yes: "Ja",
      No: "Nee",
      Accept: "Accepteren",
      Decline: "Weigeren",
      OK: "OK",
      Cancel: "Annuleren"
    },
    Search: {
      WindowTitle: "Zoeken",
      Searching: "Zoeken...",
      People: "Personen"
    },
    Profile: {
      WindowTitle: "Profiel - #{name}",
      Loading: "Laden...",
      JoinDate: "Lid sinds: #{date}",
      Account: "Account:<br />#{type}",
      PaymentInfoOnFile: "Betalings gegevens bekend",
      PaymentInfoUsed: "Betalings gegevens gebruikt",
      LindenAccount: "Linden Lab medewerker",
      NoPaymentInfo: "Geen betalings gegevens",
      Picks: "Favorieten",
      Interests: "Interesses",
      SecondLife: "2nd Life",
      FirstLife: "1st Life",
      Groups: "Groepen",
      About: "Over",
      Name: "Naam: #{name}",
      Online: "Online",
      Offline: "Offline",
      Partner: "Partner:<br />#{partner}",
      None: "Geen",
      IMButton: "Stuur bericht",
      PayButton: "Betaal",
      PayDialogTitle: "Betaal #{first} #{last}",
      PayDialogPrompt: "Hoeveel wil je #{first} #{last} betalen?",
      InvalidAmount: "Dat is geen geldig bedrag!",
      FriendButton: "Vriend toevoegen",
      ConfirmFriendAdd: "Weet je zeker dat je #{first} #{last} als vriend wilt toevoegen?",
      FriendshipOffered: "Je hebt vriendschap aangeboden aan #{first} #{last}.",
      TeleportButton: "Teleport aanbieden",
      TeleportDialogTitle: "Bezig #{first} #{last} te teleporteren",
      TeleportDialogPrompt: "Voer een bericht in om bij je teleport uitnodiging te versturen:",
      TeleportDefaultMessage: "Kom ook naar #{sim}!",
      DropInventory: "Sleep hier inventaris heen"
    },
    Texture: {
      DownloadFailed: "Kon texture niet downloaden."
    },
    Number: {
      ThousandSeparatorInterval: 3,
      ThousandSeparator: ".",
      DecimalPoint: ","
    },
    AvatarsNear: {
      WindowTitle: "Avatars vlakbij"
    },
    Inventory: {
      WindowTitle: "Inventaris",
      NullAssetTransfer: "Kon inventaris verzoek niet uitvoeren.",
      OfferAccepted: "#{name} heeft je inventaris aanbod geaccepteerd.",
      OfferDeclined: "#{name} heeft je inventaris aanbod geweigerd.",
      NoFolderTransfer: "Helaas, het geven van mappen wordt nog niet ondersteund.",
      NoNoTransferTransfer: "'#{item}' is niet overdraagbaar, dus kan niet worden gegeven.",
      ConfirmTransfer: "Weet je zeker dat je  #{item} aan #{first} #{last} wilt geven?",
      ConfirmNoCopyTransfer: "#{item} is niet kopieerbaar. Als je het weggeeft, ben je jouw exemplaar kwijt.<br /><br />Wil je #{item} aan #{first} #{last} geven?",
      ConfirmTransferTitle: "Inventaris transactie",
      Delete: "Verwijderen",
      Properties: "Eigenschappen",
      CreateFolder: "Maak nieuwe map",
      EmptyTrash: "Prullenbak legen",
      NewFolderName: "Voer naam voor de map in:",
      FolderCreationFailed: "Kon geen nieuwe map maken.",
      ConfirmItemPurge: "Weet je zeker dat je '#{item}' definitief wilt verwijderen?",
      ConfirmEmptyTrash: "Weet je zeker dat je de prullenbak wilt legen?",
      Rename: "Naam wijzigen",
      RenameItem: "Voer een nieuwe naam in:",
      ScriptRestricted: "Je hebt meer bevoegdheden nodig om dit script te openen.",
      CopyUUID: "Kopieer UUID",
      CreateNote: "Maak een nieuwe notecard",
      NewNoteName: "Geef een nieuwe naam voor de notecard:",
      CreationFailed: "Kan geen nieuw inventaris object creeëren.",
      Loading: "Inhoud laden...",
      MyInventory: "Mijn inventaris",
      InventoryReceivedTitle: "Inventaris is ontvangen",
      InventoryReceived: "#{from} heeft u gegeven het #{type} '#{name}'"
    },
    InventoryDialogs: {
      Texture: {
        WindowTitle: "Texture: #{name}"
      },
      Notecard: {
        WindowTitle: "Notitie: #{name}",
        Loading: "Laden notecard...",
        Save: "opslaan"
      },
      Script: {
        WindowTitle: "Script: #{name}",
        Loading: "Laden script..."
      },
      Landmark: {
        Title: "Teleport naar landmark",
        Message: "Weet je zeker dat je naar #{name} wilt teleporteren?"
      },
      Properties: {
        Title: "Eigenschappen - #{name}",
        Name: "Naam:",
        Description: "Omschrijving:",
        Creator: "Maker:",
        Owner: "Eigenaar:",
        Acquired: "In bezit sinds:",
        OwnerCan: "Eigenaar kan:",
        NextOwnerCan: "Volgende eigenaar kan:",
        MarkItem: "Item markeren:",
        ForSale: "Te koop",
        Original: "Origineel",
        Copy: "Kopi&euml;ren",
        Price: "Prijs:",
        Profile: "Profiel",
        Unknown: "(onbekend)"
      }
    },
    Stats: {
      WindowTitle: "Status",
      Region: "Gebied",
      FPS: "FPS",
      TD: "Tijd vertraging",
      ScriptIPS: "Script IPS",
      Objects: "Voorwerpen",
      Scripts: "Actieve Scripts",
      Agents: "Agents",
      ChildAgents: "Child Agents",
      ALServer: "AjaxLife Server",
      Sessions: "Sessies"
    },
    ScriptDialogs: {
      PermissionRequestTitle: "Verzoek om script toestemming",
      PermissionRequestBody: "'#{object}', een voorwerp van '#{owner}', wil:<br /><br />#{permission}<br />Is dat goed?",
      DialogMessage: "#{first} #{last}'s '#{object}':<br />#{message}",
      DialogTitle: "Script dialoog"
    },
    Permissions: {
      Debit: "Linden Dollars (L$) van je account afboeken",
      TakeControls: "Reageren op jouw besturings invoer",
      Animate: "Je avatar bewegen",
      Attach: "Zich koppelen aan jouw avatar",
      ChangeLinks: "Zich koppelen aan of ontkoppelen van andere voorwerpen",
      TrackCamera: "Je camera standpunt volgen",
      ControlCamera: "Je camera bedienen"
    },
    AssetPermissions: {
      Copy: "Kopieerbaar",
      NoCopy: "Niet kopieerbaar",
      Transfer: "Overdraagbaarr",
      NoTransfer: "Niet overdraagbaar",
      Modify: "Wijzigbaar",
      NoModify: "Niet wijzigbaar"
    },
    Login: {
      First: "Voornaam",
      Last: "Achternaam",
      Password: "Password",
      LogIn: "Log in",
      Grid: "Grid",
      Language: "Taal",
      LoadingSession: "Sessie data wordt geladen...",
      SessionLoadFailed: "Fout bij laden van sessie data.",
      Encrypting: "Login data wordt versleuteld...",
      LoggingIn: "Bezig met inloggen op Second Life...",
      Error: "Fout",
      SomethingWrong: "Er is helaas iets mis gegaan.<br /><br />Probeer het later alsjeblieft nog eens.",
      Location: "Start Locatie",
      Home: "Mijn thuisplek",
      LastPlace: "Mijn laatste Locatie",
      ArbitraryPlace: "<Typ regio naam>"
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
        if(parts[2])
        {
          if(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]][parts[2]])
          {
            return(new Template(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]][parts[2]])).evaluate(args);
          }
        }
        else
        {
          return(new Template(AjaxLife.Strings[gLanguageCode][parts[0]][parts[1]])).evaluate(args);
        }
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
        if(parts[2])
        {
          if(AjaxLife.Strings.en[parts[0]][parts[1]][parts[2]])
          {
            return(new Template(AjaxLife.Strings.en[parts[0]][parts[1]][parts[2]])).evaluate(args);
          }
        }
        else
        {
          return(new Template(AjaxLife.Strings.en[parts[0]][parts[1]])).evaluate(args);
        }
      }
    }
  }
  // Give up and return what we were given.
  return str;
};
