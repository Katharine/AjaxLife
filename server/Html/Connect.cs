#region License
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
#endregion
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.IO;
using MiniHttpd;
using OpenMetaverse;
using OpenMetaverse.Packets;
using Newtonsoft.Json;

namespace AjaxLife.Html
{
    public class Connect : IFile
    {
        // Fields
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, User> users;

        // Methods
        public Connect(string name, IDirectory parent, Dictionary<Guid, User> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
        }

        public void Dispose()
        {
        }

        // Someone wants connect.kat.
        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter textWriter = new StreamWriter(request.Response.ResponseContent);
            try
            {
                // Grab various bits of data from the User object.
                // If we can't do that, complain.
                // While we're at it, decode the post data.
                User user;
                GridClient client;
                StreamReader reader = new StreamReader(request.PostData);
                string qstring = reader.ReadToEnd();
                reader.Dispose();
                Dictionary<string, string> POST = AjaxLife.PostDecode(qstring);
                Guid key = new Guid(POST["session"]);
                // The session doesn't exist. Get upset.
                if (!this.users.ContainsKey(key))
                {
                    this.invalidSessionID(key, textWriter);
                    return;
                }
                lock (this.users)
                {
                    user = users[key];
                }
                user.LastRequest = DateTime.Now;
                client = user.GetClient();

                string first = "";
                string last = "";
                string pass = "";
                // Decrypt the incoming login data
                string decrypted = StringHelper.ASCIIBytesToString(AjaxLife.RSA.Decrypt(StringHelper.HexStringToBytes(POST["logindata"])));
                // Split it into its component parts.
                string[] data = decrypted.Split('\\');
                // Get upset if the challenge was incorrect.
                if (data[0] == null || data[0] != user.Challenge)
                {
                    throw new Exception("Invalid request.");
                }
                // Decode the login data.
                first = StringHelper.ASCIIBytesToString(StringHelper.FromBase64(data[1]));
                last = StringHelper.ASCIIBytesToString(StringHelper.FromBase64(data[2]));
                pass = data[3];
                user.Signature = data[4];
                // Check if they're banned first.
                if (AjaxLife.BannedUsers.IsBanned(first, last))
                {
                    textWriter.WriteLine("{success: false, message: \"You have been banned from AjaxLife by the administrator.\"}");
                    textWriter.Flush();
                    return;
                }
                LoginParams login = client.Network.DefaultLoginParams(first, last, pass, "AjaxLife", "Katharine Berry <katharine@katharineberry.co.uk>");
                login.Platform = "web";
                login.Channel = "AjaxLife Release";
                login.MAC = AjaxLife.MAC_ADDRESS;
                login.ID0 = AjaxLife.ID0;
                login.Start = (POST["location"] != "arbitrary") ? POST["location"] : NetworkManager.StartLocation(POST["sim"], 128, 128, 20);
                // Pick the correct loginuri.
                lock (AjaxLife.LOGIN_SERVERS) login.URI = AjaxLife.LOGIN_SERVERS[POST["grid"]];
                client.Settings.LOGIN_SERVER = login.URI;
                user.LindenGrid = POST["grid"].EndsWith("(Linden Lab)");
                Console.WriteLine(login.FirstName + " " + login.LastName + " is attempting to log into " + POST["grid"] + " (" + login.URI + ")");
                if (client.Network.Login(login))
                {
                    // Ensure that the challenge isn't matched by another request with the same SID. 
                    // We don't do this until after successful login because otherwise a second attempt will always fail.
                    user.Challenge = null;
                    AvatarTracker avatars = new AvatarTracker(client);
                    Events events = new Events(user);
                    user.Events = events;
                    user.Avatars = avatars;
                    // Register event handlers
                    this.RegisterCallbacks(user);
                    // Pythagoras says that 181.0193m is the optimal view distance to see the whole sim.
                    client.Self.Movement.Camera.Far = 181.0193f;
                    
                    // This doesn't seem to work.
                    // client.Self.Movement.Camera.SetPositionOrientation(new Vector3(128, 128, 0), 0, 0, 0);
                    
                    // Everything's happy. Log the requested message list, if any.
                    if(POST.ContainsKey("events"))
                    {
                        user.ParseRequestedEvents(POST["events"]);
                    }
                    
                    // If we got this far, it worked. Announce this.
                    textWriter.WriteLine("{\"success\": 1}");
                }
                else
                {
                    // Return whatever errors may have transpired.
                    textWriter.WriteLine("{success: false, message: " + AjaxLife.StringToJSON(client.Network.LoginMessage) + "}");
                }
            }
            catch (Exception exception)
            {
                request.Response.ContentType = "text/plain";
                textWriter.WriteLine(exception.Message);
            }
            textWriter.Flush();
        }

        private void RegisterCallbacks(User user)
        {
            GridClient client = user.Client;
            Events events = user.Events;
            AvatarTracker avatars = user.Avatars;
            // GridClient Event callbacks.
            // These are assigned to the aforementioned Event object.
            client.Self.ScriptQuestion += new EventHandler<ScriptQuestionEventArgs>(events.Self_ScriptQuestion);
            client.Self.ScriptDialog += new EventHandler<ScriptDialogEventArgs>(events.Self_ScriptDialog);
            client.Self.IM += new EventHandler<InstantMessageEventArgs>(events.Self_IM);
            client.Self.ChatFromSimulator += new EventHandler<ChatEventArgs>(events.Self_ChatFromSimulator);
            client.Self.TeleportProgress += new EventHandler<TeleportEventArgs>(events.Self_TeleportProgress);
            client.Self.MoneyBalance += new EventHandler<BalanceEventArgs>(events.Self_MoneyBalance);
            client.Self.MoneyBalanceReply += new EventHandler<MoneyBalanceReplyEventArgs>(events.Self_MoneyBalanceReply);
            client.Self.GroupChatJoined += new EventHandler<GroupChatJoinedEventArgs>(events.Self_GroupChatJoined);
            client.Friends.FriendOnline += new EventHandler<FriendInfoEventArgs>(events.Friends_FriendOnOffline);
            client.Friends.FriendOffline += new EventHandler<FriendInfoEventArgs>(events.Friends_FriendOnOffline);
            client.Friends.FriendRightsUpdate += new EventHandler<FriendInfoEventArgs>(events.Friends_FriendRightsUpdate);
            client.Friends.FriendshipOffered += new EventHandler<FriendshipOfferedEventArgs>(events.Friends_FriendshipOffered);
            client.Friends.FriendFoundReply += new EventHandler<FriendFoundReplyEventArgs>(events.Friends_FriendFoundReply);
            client.Avatars.UUIDNameReply += new EventHandler<UUIDNameReplyEventArgs>(events.Avatars_UUIDNameReply);
            client.Avatars.AvatarGroupsReply += new EventHandler<AvatarGroupsReplyEventArgs>(events.Avatars_AvatarGroupsReply);
            client.Avatars.AvatarInterestsReply += new EventHandler<AvatarInterestsReplyEventArgs>(events.Avatars_AvatarInterestsReply);
            client.Directory.DirPeopleReply += new EventHandler<DirPeopleReplyEventArgs>(events.Directory_DirPeopleReply);
            client.Directory.DirGroupsReply += new EventHandler<DirGroupsReplyEventArgs>(events.Directory_DirGroupsReply);
            client.Network.Disconnected += new EventHandler<DisconnectedEventArgs>(events.Network_Disconnected);
            
            // We shouldn't really be using this... it forces us to immediately accept inventory.
            client.Inventory.InventoryObjectOffered += new EventHandler<InventoryObjectOfferedEventArgs>(events.Inventory_InventoryObjectOffered);
            client.Inventory.FolderUpdated += new EventHandler<FolderUpdatedEventArgs>(events.Inventory_FolderUpdated);
            client.Inventory.ItemReceived += new EventHandler<ItemReceivedEventArgs>(events.Inventory_ItemReceived);
            client.Inventory.TaskItemReceived += new EventHandler<TaskItemReceivedEventArgs>(events.Inventory_TaskItemReceived);
            client.Terrain.LandPatchReceived += new EventHandler<LandPatchReceivedEventArgs>(events.Terrain_LandPatchReceived);
            client.Groups.GroupProfile += new EventHandler<GroupProfileEventArgs>(events.Groups_GroupProfile);
            client.Groups.GroupMembersReply += new EventHandler<GroupMembersReplyEventArgs>(events.Groups_GroupMembersReply);
            client.Groups.GroupNamesReply += new EventHandler<GroupNamesEventArgs>(events.Groups_GroupNamesReply);
            client.Groups.CurrentGroups += new EventHandler<CurrentGroupsEventArgs>(events.Groups_CurrentGroups);
            client.Parcels.ParcelProperties += new EventHandler<ParcelPropertiesEventArgs>(events.Parcels_ParcelProperties);
            
            // AvatarTracker event callbacks.
            avatars.OnAvatarAdded += new AvatarTracker.Added(events.AvatarTracker_OnAvatarAdded);
            avatars.OnAvatarRemoved += new AvatarTracker.Removed(events.AvatarTracker_OnAvatarRemoved);
            avatars.OnAvatarUpdated += new AvatarTracker.Updated(events.AvatarTracker_OnAvatarUpdated);

            // Packet callbacks
            // We register these because there's no LibSL function for doing it easily.
            client.Network.RegisterCallback(PacketType.AvatarPropertiesReply, new EventHandler<PacketReceivedEventArgs>(events.Avatars_AvatarProperties));

            // Manual map handler.
            client.Network.RegisterCallback(PacketType.MapBlockReply, new EventHandler<PacketReceivedEventArgs>(events.Packet_MapBlockReply));
            client.Network.RegisterCallback(PacketType.MapItemReply, new EventHandler<PacketReceivedEventArgs>(events.Packet_MapItemReply));
        }

        // Properties
        public string ContentType
        {
            get
            {
                return "application/json";
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

        private void invalidSessionID(Guid key, StreamWriter textWriter)
        {
            Hashtable response = new Hashtable();
            response.Add("success", false);
            // Guid::ToString("D") outputs the Guid in standard printable format:
            // 00000000-0000-0000-0000-000000000000
            response.Add("message", "The session '" + key.ToString("D") + "' does not exist.\nTry reloading the page.");
            textWriter.Write(MakeJson.FromHashtable(response));
            textWriter.Flush();
        }
    }
}