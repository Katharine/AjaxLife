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
            //try
            //{
                SecondLife client;
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
                        user["LastRequest"] = DateTime.Now;
                    }
                }
                string messagetype = POST["MessageType"];
                switch (messagetype)
                {
                    case "SpatialChat":
                        client.Self.Chat(POST["Message"], int.Parse(POST["Channel"]), (MainAvatar.ChatType)((byte)int.Parse(POST["Type"])));
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
                            (MainAvatar.InstantMessageDialog)((byte)int.Parse(POST["Dialog"])), 
                            (MainAvatar.InstantMessageOnline)int.Parse(POST["Online"]), 
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
                    if (client.Self.Teleport(POST["Sim"], new LLVector3(float.Parse(POST["X"]), float.Parse(POST["Y"]), float.Parse(POST["Z"]))))
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

                        case "GetSimStats":
                            {
                                Hashtable hash = new Hashtable();
                                hash.Add("FPS", client.Network.CurrentSim.FPS);
                                hash.Add("TimeDilation", client.Network.CurrentSim.Dilation);
                                hash.Add("LSLIPS", client.Network.CurrentSim.LSLIPS);
                                hash.Add("Objects", client.Network.CurrentSim.Objects);
                                hash.Add("ActiveScripts", client.Network.CurrentSim.ActiveScripts);
                                hash.Add("Agents", client.Network.CurrentSim.Agents);
                                hash.Add("ChildAgents", client.Network.CurrentSim.ChildAgents);
                                textwriter.WriteLine(JavaScriptConvert.SerializeObject(hash));
                                goto flushwriter;
                            }
                        case "TeleportLureRespond":
                            client.Self.TeleportLureRespond(new LLUUID(POST["RequesterID"]), bool.Parse(POST["Accept"]));
                            goto flushwriter;

                        case "FindPeople":
                            {
                                Hashtable hash = new Hashtable();
                                hash.Add("QueryID", client.Directory.StartPeopleSearch(DirectoryManager.DirFindFlags.NameSort | DirectoryManager.DirFindFlags.SortAsc, POST["Search"], int.Parse(POST["Start"])).ToStringHyphenated());
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
                            client.Appearance.BeginAgentSendAppearance();
                            break;
                        case "GetMapItems":
                            {
                                MapItemRequestPacket req = new MapItemRequestPacket();
                                req.AgentData.AgentID = client.Network.AgentID;
                                req.AgentData.SessionID = client.Network.SessionID;
                                req.RequestData.RegionHandle = client.Grid.Regions[POST["Region"]].RegionHandle;
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
                        case "GetOfflineMessages":
                            {
                                RetrieveInstantMessagesPacket req = new RetrieveInstantMessagesPacket();
                                req.AgentData.AgentID = client.Network.AgentID;
                                req.AgentData.SessionID = client.Network.SessionID;
                                client.Network.SendPacket((Packet)req);
                            }
                            break;
                    }
                }
            //}
            //catch (Exception exception)
            //{
            //    this.contenttype = "text/plain";
            //    textwriter.WriteLine(exception.Message);
            //}
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