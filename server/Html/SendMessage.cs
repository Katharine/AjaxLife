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
using Newtonsoft.Json;

namespace AjaxLife.Html
{
    public class SendMessage : IFile
    {
        // Fields
        private string contenttype = "text/plain; charset=utf-8";
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, Hashtable> users;

        // Methods
        public SendMessage(string name, IDirectory parent, Dictionary<Guid, Hashtable> users)
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
            //request.Response.SetHeader("Content-Type", "text/plain; charset=utf-8");
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter textwriter = new StreamWriter(request.Response.ResponseContent);
            SecondLife client;
            AvatarTracker avatars;
            StreamReader reader = new StreamReader(request.PostData);
            string qstring = reader.ReadToEnd();
            reader.Dispose();
            Dictionary<string,string> POST = AjaxLife.PostDecode(qstring);
            if (!POST.ContainsKey("sid"))
            {
                textwriter.WriteLine("Need an SID.");
                textwriter.Flush();
                return;
            }
            Guid guid = new Guid(POST["sid"]);
            Hashtable user = new Hashtable();
            lock (this.users)
            {
                if (!this.users.ContainsKey(guid))
                {
                    textwriter.WriteLine("Error: invalid SID");
                    textwriter.Flush();
                    return;
                }
                user = this.users[guid];
                lock (user)
                {
                    client = (SecondLife)user["SecondLife"];
                    avatars = (AvatarTracker)user["Avatars"];
                    user["LastRequest"] = DateTime.Now;
                }
            }
            string messagetype = POST["MessageType"];
            switch (messagetype)
            {
                case "SpatialChat":
                    client.Self.Chat(POST["Message"], int.Parse(POST["Channel"]), (ChatType)((byte)int.Parse(POST["Type"])));
                    goto flushwriter;

                case "SimpleInstantMessage":
                    if (POST.ContainsKey("IMSessionID"))
                    {
                        client.Self.InstantMessage(new LLUUID(POST["Target"]), POST["Message"], new LLUUID(POST["IMSessionID"]));
                    }
                    else
                    {
                        client.Self.InstantMessage(new LLUUID(POST["Target"]), POST["Message"]);
                    }
                    goto flushwriter;

                case "GenericInstantMessage":
                    client.Self.InstantMessage(
                        client.Self.FirstName + " " + client.Self.LastName, 
                        new LLUUID(POST["Target"]), 
                        POST["Message"], 
                        new LLUUID(POST["IMSessionID"]), 
                        (InstantMessageDialog)((byte)int.Parse(POST["Dialog"])), 
                        (InstantMessageOnline)int.Parse(POST["Online"]), 
                        client.Self.Position, 
                        client.Network.CurrentSim.ID,
                        new byte[0]);
                    goto flushwriter;

                case "NameLookup":
                    client.Avatars.RequestAvatarName(new LLUUID(POST["ID"]));
                    goto flushwriter;
                    //case "
            }
            if (messagetype == "Teleport")
            {
                Hashtable hash = new Hashtable();
                bool status;
                if(POST["Landmark"] != null)
                {
                    status = client.Self.Teleport(new LLUUID(POST["Landmark"]));
                }
                else
                {
                    status = client.Self.Teleport(POST["Sim"], new LLVector3(float.Parse(POST["X"]), float.Parse(POST["Y"]), float.Parse(POST["Z"])));
                }
                if (status)
                {
                    hash.Add("Success", true);
                    hash.Add("Sim", client.Network.CurrentSim.Name);
                    hash.Add("Position", client.Self.Position);
                }
                else
                {
                    hash.Add("Success", false);
                    hash.Add("Reason", client.Self.TeleportMessage);
                }
                textwriter.WriteLine(JavaScriptConvert.SerializeObject(hash));
            }
            else
            {
                switch (messagetype)
                {
                    case "GoHome":
                        client.Self.GoHome();
                        goto flushwriter;

                    case "GetPosition":
                        {
                            Hashtable hash = new Hashtable();
                            hash.Add("Sim", client.Network.CurrentSim.Name);
                            hash.Add("Position", client.Self.Position);
                            textwriter.WriteLine(JavaScriptConvert.SerializeObject(hash));
                            goto flushwriter;
                        }
                    case "RequestBalance":
                        client.Self.RequestBalance();
                        goto flushwriter;

                    case "GetStats":
                        {
                            Hashtable hash = new Hashtable();
                            hash.Add("FPS", client.Network.CurrentSim.Stats.FPS);
                            hash.Add("TimeDilation", client.Network.CurrentSim.Stats.Dilation);
                            hash.Add("LSLIPS", client.Network.CurrentSim.Stats.LSLIPS);
                            hash.Add("Objects", client.Network.CurrentSim.Stats.Objects);
                            hash.Add("ActiveScripts", client.Network.CurrentSim.Stats.ActiveScripts);
                            hash.Add("Agents", client.Network.CurrentSim.Stats.Agents);
                            hash.Add("ChildAgents", client.Network.CurrentSim.Stats.ChildAgents);
                            System.Diagnostics.Process process = System.Diagnostics.Process.GetCurrentProcess();
                            hash.Add("PhysicalMemoryUsage", process.NonpagedSystemMemorySize64);
                            hash.Add("PagedMemoryUsage", process.PagedMemorySize64);
                            hash.Add("AjaxLifeSessions", users.Count);
                            hash.Add("TextureCacheCount", AjaxLife.TextureCacheCount);
                            hash.Add("TextureCacheSize", AjaxLife.TextureCacheSize);
                            textwriter.WriteLine(JavaScriptConvert.SerializeObject(hash));
                            goto flushwriter;
                        }
                    case "TeleportLureRespond":
                        client.Self.TeleportLureRespond(new LLUUID(POST["RequesterID"]), bool.Parse(POST["Accept"]));
                        goto flushwriter;

                    case "FindPeople":
                        {
                            Hashtable hash = new Hashtable();
                            hash.Add("QueryID", client.Directory.StartPeopleSearch(DirectoryManager.DirFindFlags.People, POST["Search"], int.Parse(POST["Start"])).ToStringHyphenated());
                            textwriter.WriteLine(JavaScriptConvert.SerializeObject(hash));
                            goto flushwriter;
                        }
                    case "GetAgentData":
                        client.Avatars.RequestAvatarProperties(new LLUUID(POST["AgentID"]));
                        goto flushwriter;

                    case "StartAnimation":
                        client.Self.AnimationStart(new LLUUID(POST["Animation"]));
                        break;
                    case "StopAnimation":
                        client.Self.AnimationStop(new LLUUID(POST["Animation"]));
                        break;
                    case "SendAppearance":
                        client.Appearance.SetPreviousAppearance(false);
                        break;
                    case "GetMapItems":
                        {
                            MapItemRequestPacket req = new MapItemRequestPacket();
                            req.AgentData.AgentID = client.Network.AgentID;
                            req.AgentData.SessionID = client.Network.SessionID;
                            GridRegion region;
                            client.Grid.GetGridRegion(POST["Region"], GridLayerType.Objects, out region);
                            req.RequestData.RegionHandle = region.RegionHandle;
                            req.RequestData.ItemType = uint.Parse(POST["ItemType"]);
                            client.Network.SendPacket((Packet)req);
                        }
                        break;
                    case "GetMapBlocks":
                        {
                            MapBlockRequestPacket req = new MapBlockRequestPacket();
                            req.AgentData.AgentID = client.Network.AgentID;
                            req.AgentData.SessionID = client.Network.SessionID;
                            req.PositionData.MinX = 0;
                            req.PositionData.MinY = 0;
                            req.PositionData.MaxX = ushort.MaxValue;
                            req.PositionData.MaxY = ushort.MaxValue;
                            client.Network.SendPacket((Packet)req);
                        }
                        break;
                    case "GetMapBlock":
                        {
                            ushort x = ushort.Parse(POST["X"]);
                            ushort y = ushort.Parse(POST["Y"]);
                            MapBlockRequestPacket req = new MapBlockRequestPacket();
                            req.AgentData.AgentID = client.Network.AgentID;
                            req.AgentData.SessionID = client.Network.SessionID;
                            req.PositionData.MinX = x;
                            req.PositionData.MinY = y;
                            req.PositionData.MaxX = x;
                            req.PositionData.MaxY = y;
                            client.Network.SendPacket((Packet)req);
                        }
                        break;
                    case "GetOfflineMessages":
                        {
                            RetrieveInstantMessagesPacket req = new RetrieveInstantMessagesPacket();
                            req.AgentData.AgentID = client.Network.AgentID;
                            req.AgentData.SessionID = client.Network.SessionID;
                            client.Network.SendPacket((Packet)req);
                        }
                        break;
                    case "GetFriendList":
                        {
                            List<FriendsManager.FriendInfo> friends = client.Friends.FriendsList();
                            List<Hashtable> friendlist = new List<Hashtable>();
                            foreach (FriendsManager.FriendInfo friend in friends)
                            {
                                Hashtable friendhash = new Hashtable();
                                friendhash.Add("ID", friend.UUID.ToStringHyphenated());
                                friendhash.Add("Name", friend.Name);
                                friendhash.Add("Online", friend.IsOnline);
                                friendhash.Add("MyRights", friend.MyRightsFlags);
                                friendhash.Add("TheirRights", friend.TheirRightsFlags);
                                friendlist.Add(friendhash);
                            }
                            (new JsonSerializer()).Serialize(textwriter, friendlist);
                        }
                        break;
                    case "RequestTexture":
                        {
                            LLUUID image = new LLUUID(POST["ID"]);
                            if (File.Exists(AjaxLife.TEXTURE_CACHE + image.ToStringHyphenated() + ".png"))
                            {
                                textwriter.Write("{Ready: true, URL: \"textures/" + image.ToStringHyphenated() + ".png\"}");
                            }
                            else
                            {

                                client.Assets.RequestImage(image, ImageType.Normal, 125000.0f, 0);
                                textwriter.Write("{Ready: false}");
                            }
                        }
                        break;
                    case "AcceptFriendship":
                        client.Friends.AcceptFriendship(client.Self.ID, POST["IMSessionID"]);
                        break;
                    case "DeclineFriendship":
                        client.Friends.DeclineFriendship(client.Self.ID, POST["IMSessionID"]);
                        break;
                    case "OfferFriendship":
                        client.Friends.OfferFriendship(new LLUUID(POST["Target"]));
                        break;
                    case "TerminateFriendship":
                        client.Friends.TerminateFriendship(new LLUUID(POST["Target"]));
                        break;
                    case "SendAgentMoney":
                        client.Self.GiveAvatarMoney(new LLUUID(POST["Target"]), int.Parse(POST["Amount"]));
                        break;
                    case "RequestAvatarList":
                        {
                            List<Hashtable> list = new List<Hashtable>();
                            foreach (KeyValuePair<uint,Avatar> pair in avatars.Avatars)
                            {
                                Avatar avatar = pair.Value;
                                Hashtable hash = new Hashtable();
                                hash.Add("Name", avatar.Name);
                                hash.Add("ID", avatar.ID.ToStringHyphenated());
                                hash.Add("LocalID", avatar.LocalID);
                                hash.Add("Position", avatar.Position);
                                hash.Add("Rotation", avatar.Rotation);
                                hash.Add("Scale", avatar.Scale);
                                hash.Add("GroupName", avatar.GroupName);
                                list.Add(hash);
                            }
                            (new JsonSerializer()).Serialize(textwriter, list);
                        }
                        break;
                    case "LoadInventoryFolder":
                        client.Inventory.RequestFolderContents(new LLUUID(POST["UUID"]), client.Network.AgentID, true, true, InventorySortOrder.ByDate | InventorySortOrder.SystemFoldersToTop);
                        break;
                    case "RequestAsset":
                        {
                            LLUUID transferid = client.Assets.RequestInventoryAsset(new LLUUID(POST["AssetID"]), new LLUUID(POST["InventoryID"]),
                                LLUUID.Zero, new LLUUID(POST["OwnerID"]), (AssetType)int.Parse(POST["AssetType"]), false);
                            textwriter.Write("{TransferID: \"" + transferid.ToStringHyphenated() + "\"}");
                        }
                        break;
                    case "SendTeleportLure":
                        client.Self.SendTeleportLure(new LLUUID(POST["Target"]), POST["Message"]);
                        break;
                }
            }
        flushwriter:
            textwriter.Flush();
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