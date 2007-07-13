#region License
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
#endregion
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using MiniHttpd;
using libsecondlife;
using libsecondlife.Packets;
using libsecondlife.InventorySystem;
using Newtonsoft.Json;

namespace AjaxLife.Html
{
    public class Connect : IFile
    {
        // Fields
        private string contenttype = "text/plain; charset=utf-8";
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, Hashtable> users;

        // Methods
        public Connect(string name, IDirectory parent, Dictionary<Guid, Hashtable> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
        }

        public void Dispose()
        {
        }

        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter textWriter = new StreamWriter(request.Response.ResponseContent);
            try
            {
                Hashtable user;
                SecondLife client;
                StreamReader reader = new StreamReader(request.PostData);
                string qstring = reader.ReadToEnd();
                reader.Dispose();
                Hashtable POST = AjaxLife.PostDecode(qstring);
                Guid key = new Guid((string)POST["session"]);
                if (!this.users.ContainsKey(key))
                {
                    Hashtable response = new Hashtable();
                    response.Add("success", false);
                    response.Add("message", "The session '" + key.ToString("D") + "' does not exist. \nTry reloading the page.");
                    new JsonSerializer().Serialize(textWriter, response);
                    textWriter.Flush();
                    return;
                }
                lock (this.users)
                {
                    user = this.users[key];
                }
                lock (user)
                {
                    user["LastRequest"] = DateTime.Now;
                }
                lock (user)
                {
                    client = (SecondLife)user["SecondLife"];
                }
                if (client.Network.Login((string)POST["first"], (string)POST["last"], (string)POST["password"], "AjaxLife", "Katharine Berry <katharine@katharineberry.co.uk>"))
                {
                    Events events = new Events();
                    lock (user)
                    {
                        user["Events"] = events;
                    }
                    client.Self.OnScriptQuestion += new MainAvatar.ScriptQuestionCallback(events.Self_OnScriptQuestion);
                    client.Self.OnScriptDialog += new MainAvatar.ScriptDialogCallback(events.Self_OnScriptDialog);
                    client.Self.OnInstantMessage += new MainAvatar.InstantMessageCallback(events.Self_OnInstantMessage);
                    client.Self.OnChat += new MainAvatar.ChatCallback(events.Self_OnChat);
                    client.Avatars.OnFriendNotification += new AvatarManager.FriendNotificationCallback(events.Avatars_OnFriendNotification);
                    client.Avatars.OnAvatarNames += new AvatarManager.AvatarNamesCallback(events.Avatars_OnAvatarNames);
                    client.Directory.OnDirPeopleReply += new DirectoryManager.DirPeopleReplyCallback(events.Directory_OnDirPeopleReply);
                    client.Network.OnDisconnected += new NetworkManager.DisconnectedCallback(events.Network_OnDisconnected);
                    client.Self.OnTeleport += new MainAvatar.TeleportCallback(events.Self_OnTeleport);
                    client.Self.OnBalanceUpdated += new MainAvatar.BalanceCallback(events.Self_OnBalanceUpdated);
                    client.Self.OnMoneyBalanceReplyReceived += new MainAvatar.MoneyBalanceReplyCallback(events.Self_OnMoneyBalanceReplyReceived);
                    client.Avatars.OnAvatarGroups += new AvatarManager.AvatarGroupsCallback(events.Avatars_OnAvatarGroups);
                    client.Avatars.OnAvatarInterests += new AvatarManager.AvatarInterestsCallback(events.Avatars_OnAvatarInterests);
                    // LibSL screwed this one up, so it's implemented manually.
                    //client.Avatars.OnAvatarProperties += new AvatarManager.AvatarPropertiesCallback(events.Avatars_OnAvatarProperties);
                    client.Inventory.OnInventoryItemReceived += new InventoryManager.On_InventoryItemReceived(events.Inventory_OnInventoryItemReceived);
                    client.Inventory.OnInventoryFolderReceived += new InventoryManager.On_InventoryFolderReceived(events.Inventory_OnInventoryFolderReceived);
                    client.Network.RegisterCallback(PacketType.AvatarPropertiesReply, new NetworkManager.PacketCallback(events.Avatars_OnAvatarProperties));
                    client.Network.RegisterCallback(PacketType.MapBlockReply, new NetworkManager.PacketCallback(events.Packet_MapBlockReply));
                    client.Network.RegisterCallback(PacketType.MapItemReply, new NetworkManager.PacketCallback(events.Packet_MapItemReply));
                    client.Appearance.BeginAgentSendAppearance();
                    textWriter.WriteLine("{success: true}");
                }
                else
                {
                    JsonWriter j = new JsonWriter(textWriter);
                    j.WriteStartObject();
                    j.WritePropertyName("success");
                    j.WriteValue(false);
                    j.WritePropertyName("message");
                    j.WriteValue(client.Network.LoginMessage);
                    j.WriteEndObject();
                    j.Flush();
                }
            }
            catch (Exception exception)
            {
                this.contenttype = "text/plain";
                textWriter.WriteLine(exception.Message);
            }
            textWriter.Flush();
        }

        // Properties
        public string ContentType
        {
            get
            {
                return this.contenttype;
            }
        }

        public string Name
        {
            get
            {
                return this.name;
            }
        }

        public IDirectory Parent
        {
            get
            {
                return this.parent;
            }
        }
    }
}