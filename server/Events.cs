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
using System.Runtime.InteropServices;
using OpenMetaverse;
using OpenMetaverse.Packets;
using OpenMetaverse.Assets;
using Newtonsoft.Json;
using System.Diagnostics;
using AjaxLife.Converters;
using Affirma.ThreeSharp;
using Affirma.ThreeSharp.Query;

using Bitmap = System.Drawing.Bitmap;

namespace AjaxLife
{
    public class Events
    {
        // Fields
        private Queue<Hashtable> pending = new Queue<Hashtable>();
        private bool active = true;
        private User user;
        private GridClient Client;
        private List<UUID> LoadedInventory = new List<UUID>();

        // Constructor. Lets us have access to various useful user things.
        public Events(User user)
        {
            this.Client = user.Client;
            this.user = user;
        }
        
        // Returns the number of events pending.
        public int GetEventCount()
        {
            return this.pending.Count;
        }

        // Returns the event queue in JSON format.
        public string GetPendingJson(GridClient client)
        {
            enqueue(this.GetFooter(client));
            return MakeJson.FromHashtableQueue(this.pending);
        }
        
        
        // Marks us as inactive - i.e. we should be logged off.
        public void deactivate()
        {
            active = false;
        }

        // Clear the inventory cache. This is needed to avoid confusing the client if it
        // reloads without relogging.
        public void ClearInventory()
        {
            LoadedInventory.Clear();
        }

        // Whatever this function returns is tacked onto every message queue response.
        // It contains useful data (thus the name "UsefulData") - that is, the user's position,
        // region, and the positions of others in the region.
        public Hashtable GetFooter(GridClient client)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "UsefulData");
            message.Add("Positions", client.Network.CurrentSim.AvatarPositions);
            message.Add("YourPosition", client.Self.SimPosition);
            message.Add("YourRegion", client.Network.CurrentSim.Name);
            return message;
        }
        
        private void enqueue(Hashtable message)
        {
            if(!message.ContainsKey("MessageType")) return;
            if(message == null) return;
            if(user.RequestedEvents == null || user.RequestedEvents.Contains((string)message["MessageType"]))
            {
                this.pending.Enqueue(message);
            }
        }

        // CALLBACKS
        
        // These are all assigned to LibSL callbacks in Connect.cs. This determines their argument order.
        // The if(!active) check is to ensure they don't get called after we've logged off. This is a
        // LibSL bug.
        
        // These almost all perform the same task:
        // 1) Create a hashtable
        // 2) Place various passed-in arguments in the hashtable
        // 3) Optionally, loop through one of the arguments if necessary, and add this to the hashtable
        //    as a bunch more hashtables.
        // 4) Enqueue the hashtable in the message queue. This is periodically emptied by the client.
        
        public void Avatars_AvatarGroupsReply(object sender, AvatarGroupsReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarGroups");
            item.Add("AvatarID", e.AvatarID);
            item.Add("Groups", e.Groups);
            enqueue(item);
        }

        public void Avatars_AvatarInterestsReply(object sender, AvatarInterestsReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarInterests");
            item.Add("AvatarID", e.AvatarID);
            item.Add("WantToMask", e.Interests.WantToMask);
            item.Add("WantToText", e.Interests.WantToText);
            item.Add("SkillsMask", e.Interests.SkillsMask);
            item.Add("SkillsText", e.Interests.SkillsText);
            item.Add("LanguagesText", e.Interests.LanguagesText);
            enqueue(item);
        }

        public void Avatars_UUIDNameReply(object sender, UUIDNameReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarNames");
            item.Add("Names", e.Names);
            enqueue(item);
        }

        public void Avatars_AvatarProperties(object sender, PacketReceivedEventArgs e)
        {
            Hashtable item = new Hashtable();
            AvatarPropertiesReplyPacket reply = (AvatarPropertiesReplyPacket)e.Packet;
            item.Add("MessageType",     "AvatarProperties");
            item.Add("AvatarID",        reply.AgentData.AvatarID);
            item.Add("PartnerID",       reply.PropertiesData.PartnerID);
            item.Add("AboutText",       Utils.BytesToString(reply.PropertiesData.AboutText));
            item.Add("FirstLifeText",   Utils.BytesToString(reply.PropertiesData.FLAboutText));
            item.Add("FirstLifeImage",  reply.PropertiesData.FLImageID);
            item.Add("ProfileImage",    reply.PropertiesData.ImageID);
            item.Add("ProfileURL",      Utils.BytesToString(reply.PropertiesData.ProfileURL));
            item.Add("BornOn",          Utils.BytesToString(reply.PropertiesData.BornOn));
            item.Add("CharterMember",   Utils.BytesToString(reply.PropertiesData.CharterMember));
            item.Add("AllowPublish",    reply.PropertiesData.Flags & (0x1 << 0));
            item.Add("MaturePublish",   reply.PropertiesData.Flags & (0x1 << 1));
            item.Add("Identified",      reply.PropertiesData.Flags & (0x1 << 2));
            item.Add("Transacted",      reply.PropertiesData.Flags & (0x1 << 3));
            item.Add("Online",          reply.PropertiesData.Flags & (0x1 << 4));
            enqueue(item);
        }

        public void Avatars_OnFriendNotification(UUID agentID, bool online)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "FriendNotification");
            item.Add("AgentID", agentID);
            item.Add("Online", online);
            enqueue(item);
        }

        public void Friends_FriendFoundReply(object sender, FriendFoundReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "FriendFound");
            item.Add("Location", e.Location);
            item.Add("RegionHandle", e.RegionHandle.ToString()); // String to avoid upsetting JavaScript.
            enqueue(item);
        }

        public void Directory_DirPeopleReply(object sender, DirPeopleReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "DirPeopleReply");
            List<Hashtable> results = new List<Hashtable>();
            foreach (DirectoryManager.AgentSearchData person in e.MatchedPeople)
            {
                Hashtable result = new Hashtable();
                result.Add("AgentID", person.AgentID);
                result.Add("FirstName", person.FirstName);
                result.Add("LastName", person.LastName);
                results.Add(result);
            }
            item.Add("Results", results);
            enqueue(item);
        }

        public void Directory_DirGroupsReply(object sender, DirGroupsReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "DirGroupsReply");
            List<Hashtable> results = new List<Hashtable>();
            foreach (DirectoryManager.GroupSearchData group in e.MatchedGroups)
            {
                Hashtable result = new Hashtable();
                result.Add("GroupID", group.GroupID);
                result.Add("Name", group.GroupName);
                result.Add("MemberCount", group.Members);
                results.Add(result);
            }
            item.Add("Results", results);
            enqueue(item);
        }

        public void Inventory_InventoryObjectOffered(object sender, InventoryObjectOfferedEventArgs e)
        {
            if (!active)
            {
                e.Accept = false;
                return;
            }

            Hashtable hashtable = new Hashtable();
            hashtable.Add("MessageType", "ObjectOffered");
            hashtable.Add("FromAgentID", e.Offer.FromAgentID);
            hashtable.Add("FromAgentName", e.Offer.FromAgentName);
            hashtable.Add("RegionID", e.Offer.RegionID);
            hashtable.Add("Position", e.Offer.Position);
            hashtable.Add("Timestamp", e.Offer.Timestamp);
            hashtable.Add("Type", e.AssetType);
            hashtable.Add("ObjectID", e.ObjectID);
            hashtable.Add("FromTask", e.FromTask);
            enqueue(hashtable);
            e.Accept = true; // Sigh...
        }

        public void Network_Disconnected(object sender, DisconnectedEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "Disconnected");
            item.Add("Reason", e.Reason);
            item.Add("Message", e.Message);
            enqueue(item);
        }

        public void Self_MoneyBalance(object sender, BalanceEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "BalanceUpdated");
            item.Add("Balance", e.Balance);
            enqueue(item);
        }

        public void Self_ChatFromSimulator(object sender, ChatEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "SpatialChat");
            item.Add("Message", e.Message);
            item.Add("Audible", e.AudibleLevel);
            item.Add("Type", e.Type);
            item.Add("SourceType", e.SourceType);
            item.Add("FromName", e.FromName);
            item.Add("ID", e.SourceID);
            item.Add("OwnerID", e.OwnerID);
            item.Add("Position", e.Position);
            enqueue(item);
        }

        public void Self_IM(object sender, InstantMessageEventArgs e)
        {
            InstantMessage im = e.IM;
            UUID fromAgentID = im.FromAgentID;
            string fromAgentName = im.FromAgentName;
            //UUID toAgentID = im.ToAgentID;
            UUID regionID = im.RegionID;
            Vector3 position = im.Position;
            InstantMessageDialog dialog = im.Dialog;
            bool groupIM = im.GroupIM;
            UUID imSessionID = im.IMSessionID;
            DateTime timestamp = im.Timestamp;
            string message = im.Message;
            InstantMessageOnline offline = im.Offline;
            byte[] binaryBucket = im.BinaryBucket;
            uint parentEstateID = im.ParentEstateID;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "InstantMessage");
            item.Add("FromAgentID", fromAgentID);
            item.Add("FromAgentName", fromAgentName);
            item.Add("ParentEstateID", parentEstateID.ToString());
            item.Add("RegionID", regionID);
            item.Add("Position", position);
            item.Add("Dialog", dialog);
            item.Add("GroupIM", groupIM);
            item.Add("IMSessionID", imSessionID);
            item.Add("Timestamp", timestamp);
            item.Add("Message", message);
            item.Add("Offline", offline);
            item.Add("BinaryBucket", binaryBucket);
            enqueue(item);
        }

        public void Self_MoneyBalanceReply(object sender, MoneyBalanceReplyEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "MoneyBalanceReplyReceived");
            item.Add("TransactionID", e.TransactionID);
            item.Add("TransactionSuccess", e.Success);
            item.Add("Balance", e.Balance);
            item.Add("MetersCredit", e.MetersCredit);
            item.Add("MetersCommitted", e.MetersCommitted);
            item.Add("Description", e.Description);
            enqueue(item);
        }

        public void Self_ScriptDialog(object sender, ScriptDialogEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "ScriptDialog");
            item.Add("Message", e.Message);
            item.Add("ObjectName", e.ObjectName);
            item.Add("ImageID", e.ImageID);
            item.Add("ObjectID", e.ObjectID);
            item.Add("FirstName", e.FirstName);
            item.Add("LastName", e.LastName);
            item.Add("ChatChannel", e.Channel);
            item.Add("Buttons", e.ButtonLabels);
            enqueue(item);
        }

        public void Self_ScriptQuestion(object sender, ScriptQuestionEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "ScriptPermissionRequest");
            item.Add("TaskID", e.TaskID);
            item.Add("ItemID", e.ItemID);
            item.Add("ObjectName", e.ObjectName);
            item.Add("ObjectOwner", e.ObjectOwnerName);
            item.Add("Permissions", (int)e.Questions);
            enqueue(item);
        }

        public void Self_TeleportProgress(object sender, TeleportEventArgs e)
        {
            Hashtable item = new Hashtable();
            item.Add("MessageType", "Teleport");
            item.Add("Status", e.Status);
            item.Add("Flags", e.Flags);
            if (e.Status == TeleportStatus.Finished)
            {
                Client.Self.Movement.Camera.Far = 182f;
                Client.Self.Movement.Camera.SetPositionOrientation(new Vector3(128, 128, 0), 0, 0, 0);
                Client.Self.Movement.SendUpdate();
            }
            enqueue(item);
        }

        public void Packet_MapBlockReply(object sender, PacketReceivedEventArgs e)
        {
            MapBlockReplyPacket reply = (MapBlockReplyPacket)e.Packet;
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "MapBlocks");
            Hashtable[] blocks = new Hashtable[reply.Data.Length];
            float temp1, temp2; // Neither of these do anything, really. Just to make Helpers.GlobalPosToRegionHandle happy.
            int i = 0;
            foreach (MapBlockReplyPacket.DataBlock data in reply.Data)
            {
                string name = Utils.BytesToString(data.Name);
                Hashtable simhash = new Hashtable();
                simhash.Add("Name", name);
                simhash.Add("Access", data.Access);
                simhash.Add("X", data.X);
                simhash.Add("Y", data.Y);
                simhash.Add("Flags", data.RegionFlags);
                // Convert the regionhandle to a string - JavaScript is likely to get upset over long integers.
                simhash.Add("RegionHandle", Helpers.GlobalPosToRegionHandle(data.X*256, data.Y*256, out temp1, out temp2).ToString());
                blocks[i++] = simhash;
            }
            hash.Add("Blocks", blocks);
            enqueue(hash);
        }

        public void Packet_MapItemReply(object sender, PacketReceivedEventArgs e)
        {
            MapItemReplyPacket reply = (MapItemReplyPacket)e.Packet;
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "MapItems");
            List<Hashtable> items = new List<Hashtable>();
            hash.Add("ItemType", reply.RequestData.ItemType);
            foreach (MapItemReplyPacket.DataBlock data in reply.Data)
            {
                Hashtable itemhash = new Hashtable();
                itemhash.Add("Name", Utils.BytesToString(data.Name));
                itemhash.Add("X", data.X);
                itemhash.Add("Y", data.Y);
                itemhash.Add("Extra", data.Extra);
                itemhash.Add("Extra2", data.Extra2);
                itemhash.Add("ID", data.ID);
                items.Add(itemhash);
            }
            hash.Add("Items", items);
            enqueue(hash);
        }
        
        public void Assets_TextureDownloadCallback(TextureRequestState state, AssetTexture texture)
        {
            if(state == TextureRequestState.NotFound || state == TextureRequestState.Aborted || state == TextureRequestState.Timeout)
            {
                Console.WriteLine("Failed to download " + texture.AssetID + " - " + state.ToString() + ".");
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "ImageDownloaded");
                hash.Add("UUID", texture.AssetID);
                hash.Add("Success", false);
                hash.Add("Error", "Image could not be downloaded: " + state.ToString());
                enqueue(hash);
            }
            else if(state == TextureRequestState.Finished)
            {
                bool success = true;
                string key = texture.AssetID.ToString();
                try
                {
                    texture.Decode();
                    byte[] img = texture.Image.ExportRaw();
                    int size = img.Length;
                    int width = texture.Image.Width;
                    int height = texture.Image.Height;
                    texture.Image.Clear();
                    
                    // Helpfully, it's upside-down, and has red and blue flipped.
                    
                    // Assuming 32 bits (accurate) and a height as a multiple of two (accurate),
                    // this will vertically invert the image.
                    int length = width * 4;
                    byte[] fliptemp = new byte[length];
                    for(int i = 0; i < height / 2; ++i)
                    {
                        int index = i * width * 4;
                        int endindex = size - ((i+1) * width * 4);
                        Array.Copy(img, index, fliptemp, 0, length);
                        Array.Copy(img, endindex, img, index, length);
                        Array.Copy(fliptemp, 0, img, endindex, length);
                    }
                    
                    // This changes RGBA to BGRA. Or possibly vice-versa. I don't actually know.
                    // The documentation is vague/nonexistent.
                    for(int i = 0; i < size; i += 4)
                    {
                        byte temp = img[i+2];
                        img[i+2] = img[i];
                        img[i] = temp;
                    }
                    
                    // Use System.Drawing.Bitmap to create a PNG. This requires us to feed it a pointer to an array
                    // for whatever reason, so we temporarily pin the image array.
                    GCHandle handle = GCHandle.Alloc(img, GCHandleType.Pinned);
                    Bitmap bitmap = new Bitmap(texture.Image.Width, texture.Image.Height, texture.Image.Width * 4, 
                                        System.Drawing.Imaging.PixelFormat.Format32bppArgb, handle.AddrOfPinnedObject());
                    bitmap.Save(AjaxLife.TEXTURE_CACHE + key + ".png", System.Drawing.Imaging.ImageFormat.Png);
                    bitmap.Dispose();
                    handle.Free();
                    if(AjaxLife.USE_S3)
                    {
                        try
                        {
                            IThreeSharp service = new ThreeSharpQuery(AjaxLife.S3Config);
                            Affirma.ThreeSharp.Model.ObjectAddRequest request = new Affirma.ThreeSharp.Model.ObjectAddRequest(AjaxLife.TEXTURE_BUCKET, key + ".png");
                            request.LoadStreamWithFile(AjaxLife.TEXTURE_CACHE + key + ".png");
                            request.Headers.Add("x-amz-acl", "public-read");
                            request.Headers.Add("Content-Type", "image/png");
                            service.ObjectAdd(request).DataStream.Close();
                            AjaxLife.CachedTextures.Add(texture.AssetID);
                            File.Delete(AjaxLife.TEXTURE_CACHE + key + ".png");
                        }
                        catch
                        {
                            success = false;
                        }
                    }
                }
                catch(Exception e)
                {
                    success = false;
                    AjaxLife.Debug("Events", "Texture download for "+key+" failed (" + e.GetType().Name + "): " + e.Message);
                }
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "ImageDownloaded");
                hash.Add("Success", success);
                hash.Add("UUID", key);
                hash.Add("URL", AjaxLife.TEXTURE_ROOT + key + ".png");
                enqueue(hash);
            }
        
        }
        
        public void Friends_FriendshipOffered(object sender, FriendshipOfferedEventArgs e)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendshipOffered");
            hash.Add("AgentID", e.AgentID);
            hash.Add("AgentName", e.AgentName);
            hash.Add("IMSessionID", e.SessionID);
            enqueue(hash);
        }

        public void Friends_FriendRightsUpdate(object sender, FriendInfoEventArgs e)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendRightsChanged");
            hash.Add("Name", e.Friend.Name);
            hash.Add("ID", e.Friend.UUID);
            hash.Add("TheirRights", e.Friend.TheirFriendRights);
            hash.Add("MyRights", e.Friend.MyFriendRights);
            hash.Add("Online", e.Friend.IsOnline);
            enqueue(hash);
        }

        public void Friends_FriendOnOffline(object sender, FriendInfoEventArgs e)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendOnOffline");
            hash.Add("Name", e.Friend.Name);
            hash.Add("ID", e.Friend.UUID);
            hash.Add("TheirRights", e.Friend.TheirFriendRights);
            hash.Add("MyRights", e.Friend.MyFriendRights);
            hash.Add("Online", e.Friend.IsOnline);
            enqueue(hash);
        }

        public void AvatarTracker_OnAvatarAdded(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarAdded");
            hash.Add("Name", avatar.Name);
            hash.Add("ID", avatar.ID);
            hash.Add("LocalID", avatar.LocalID);
            hash.Add("Position", avatar.Position);
            hash.Add("Scale", avatar.Scale);
            hash.Add("GroupName", avatar.GroupName);
            enqueue(hash);
        }

        public void AvatarTracker_OnAvatarRemoved(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarRemoved");
            hash.Add("Name", avatar.Name);
            hash.Add("ID", avatar.ID);
            hash.Add("LocalID", avatar.LocalID);
            enqueue(hash);
        }

        public void AvatarTracker_OnAvatarUpdated(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarUpdated");
            hash.Add("ID", avatar.ID);
            hash.Add("Position", avatar.Position);
            enqueue(hash);
        }

        public void Assets_OnAssetReceived(AssetDownload transfer, Asset asset, UUID inventoryID)
        {
            if (asset == null && transfer != null)
            {
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "AssetReceived");
                hash.Add("Success", false);
                hash.Add("InventoryID", inventoryID);
                if (transfer != null)
                {
                    hash.Add("TransferID", transfer.AssetID);
                    hash.Add("AssetID", transfer.AssetID);
                    hash.Add("Error", transfer.Status.ToString());
                    hash.Add("AssetType", transfer.AssetType);
                }
                enqueue(hash);
                return;
            }
            if (transfer == null)
            {
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "NullTransfer");
                hash.Add("InventoryID", inventoryID);
                enqueue(hash);
                return;
            }
            try
            {
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "AssetReceived");
                hash.Add("InventoryID", inventoryID);
                hash.Add("Success", transfer.Success);
                if (!transfer.Success)
                {
                    hash.Add("AssetData", "Could not download asset: " + transfer.Status.ToString());
                }
                else
                {
                    switch (asset.AssetType)
                    {
                        case AssetType.Notecard:
                        case AssetType.LSLText:
                            hash.Add("AssetData", Utils.BytesToString(asset.AssetData));
                            break;
                        case AssetType.Bodypart:
                            {
                                AssetBodypart part = (AssetBodypart)asset;
                                hash.Add("Creator", part.Creator);
                                hash.Add("Description", part.Description);
                                hash.Add("Textures", part.Textures);
                                hash.Add("Params", part.Params);
                                hash.Add("Permissions", part.Permissions);
                                hash.Add("Owner", part.Owner);
                            }
                            break;
                    }
                }
                hash.Add("AssetType", transfer.AssetType);
                hash.Add("AssetID", transfer.AssetID);
                hash.Add("TransferID", transfer.ID);
                enqueue(hash);
            }
            catch { }
        }

        public void Inventory_FolderUpdated(object sender, FolderUpdatedEventArgs e)
        {
            List<InventoryBase> contents = Client.Inventory.Store.GetContents(e.FolderID);
            Hashtable roothash = new Hashtable();
            roothash.Add("MessageType", "FolderUpdated");
            roothash.Add("FolderID", e.FolderID);
            List<Hashtable> response = new List<Hashtable>();
            lock (LoadedInventory)
            {
                foreach (InventoryBase o in contents)
                {
                    if (LoadedInventory.Contains(o.UUID)) continue;
                    LoadedInventory.Add(o.UUID);
                    Hashtable hash = new Hashtable();
                    if (o is InventoryFolder)
                    {
                        InventoryFolder folder = (InventoryFolder)o;
                        hash.Add("Type", "InventoryFolder");
                        hash.Add("Name", folder.Name);
                        hash.Add("PreferredType", folder.PreferredType);
                        hash.Add("OwnerID", folder.OwnerID);
                        hash.Add("UUID", folder.UUID);
                        response.Add(hash);
                    }
                    else if (o is InventoryItem)
                    {
                        InventoryItem item = (InventoryItem)o;
                        hash.Add("Type", "InventoryItem");
                        hash.Add("Name", item.Name);
                        hash.Add("UUID", item.UUID);
                        hash.Add("AssetType", item.AssetType);
                        hash.Add("AssetUUID", item.AssetUUID);
                        hash.Add("CreatorID", item.CreatorID);
                        hash.Add("OwnerID", item.OwnerID);
                        hash.Add("CreationDate", item.CreationDate);
                        hash.Add("Description", item.Description);
                        hash.Add("Flags", item.Flags);
                        hash.Add("InventoryType", item.InventoryType);
                        hash.Add("Permissions", item.Permissions);
                        response.Add(hash);
                    }
                }
            }
            roothash.Add("Contents", response);
            enqueue(roothash);
        }

        public void Terrain_LandPatchReceived(object sender, LandPatchReceivedEventArgs e)
        {
            if (e.X >= 16 || e.Y >= 16)
            {
                Console.WriteLine("Bad patch coordinates, (" + e.X + ", " + e.Y + ")");
                return;
            }

            if (e.PatchSize != 16)
            {
                Console.WriteLine("Unhandled patch size " + e.PatchSize + "x" + e.PatchSize);
                return;
            }
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "LandPatch");
            hash.Add("OffsetX", e.X * 16);
            hash.Add("OffsetY", e.Y * 16);
            hash.Add("Region", e.Simulator.Name);
            hash.Add("WaterLevel", e.Simulator.WaterHeight); // Is there anywhere better to put this?
            
            float[,] landscape = new float[16, 16];
            for (int i = 0; i < 16; ++i)
            {
                for (int j = 0; j < 16; ++j)
                {
                    landscape[i, j] = e.HeightMap[i * 16 + j];
                }
            }
            // Ugly hack to fix the JSON encoding.
            float[][] resp = new float[16][];
            for (int i = 0; i < 16; ++i)
            {
                resp[i] = new float[16];
                for (int j = 0; j < 16; ++j)
                {
                    resp[i][j] = landscape[i, j];
                }
            }
            hash.Add("Patch", resp);
            enqueue(hash);
        }

        public void Assets_OnAssetUploaded(AssetUpload upload)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AssetUploaded");
            hash.Add("AssetID", upload.AssetID);
            hash.Add("TransferID", upload.XferID);
            hash.Add("ID", upload.ID);
            hash.Add("Success", upload.Success);
            enqueue(hash);
        }

        public void Groups_GroupProfile(object sender, GroupProfileEventArgs e)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "GroupProfile");
            hash.Add("ID", e.Group.ID);
            hash.Add("Name", e.Group.Name);
            hash.Add("Charter", e.Group.Charter);
            hash.Add("Founder", e.Group.FounderID);
            hash.Add("Insignia", e.Group.InsigniaID);
            hash.Add("MemberCount", e.Group.GroupMembershipCount);
            hash.Add("OwnerRole", e.Group.OwnerRole);
            hash.Add("MemberTitle", e.Group.MemberTitle);
            hash.Add("Money", e.Group.Money);
            hash.Add("MembershipFee", e.Group.MembershipFee);
            hash.Add("OpenEnrollment", e.Group.OpenEnrollment);
            hash.Add("ShowInList", e.Group.ShowInList);
            hash.Add("AcceptNotices", e.Group.AcceptNotices);
            hash.Add("Contribution", e.Group.Contribution);
            enqueue(hash);
        }


        public void Groups_GroupMembersReply(object sender, GroupMembersReplyEventArgs e)
        {
            List<Hashtable> list = new List<Hashtable>();
            foreach (KeyValuePair<UUID,GroupMember> memberpair in e.Members)
            {
                GroupMember member = memberpair.Value;
                Hashtable hash = new Hashtable();
                hash.Add("UUID", memberpair.Key);
                hash.Add("Contribution", member.Contribution);
                hash.Add("IsOwner", member.IsOwner);
                hash.Add("ID", member.ID);
                hash.Add("OnlineStatus", member.OnlineStatus);
                hash.Add("Powers", member.Powers);
                hash.Add("Title", member.Title);
                list.Add(hash);
            }
            Hashtable message = new Hashtable();
            message.Add("MessageType", "GroupMembers");
            message.Add("MemberList", list);
            message.Add("GroupID", e.GroupID);
            enqueue(message);
        }

        public void Groups_GroupNamesReply(object sender, GroupNamesEventArgs e)
        {
            AjaxLife.Debug("OnGroupNames", "OnGroupNames arrived.");
            Hashtable message = new Hashtable();
            message.Add("MessageType", "GroupNames");
            message.Add("Names", e.GroupNames);
            enqueue(message);
        }

        public void Groups_CurrentGroups(object sender, CurrentGroupsEventArgs e)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "CurrentGroups");
            message.Add("Groups", e.Groups);
            enqueue(message);
        }

        public void Self_GroupChatJoined(object sender, GroupChatJoinedEventArgs e)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "GroupChatJoin");
            message.Add("GroupChatSessionID", e.SessionID);
            message.Add("TmpSessionID", e.TmpSessionID);
            message.Add("SessionName", e.SessionName);
            message.Add("Success", e.Success);
            enqueue(message);
        }

        public void Inventory_OnNoteUploaded(bool success, string status, UUID itemID, UUID assetID)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "InventoryNoteUploaded");
            message.Add("Success", success);
            message.Add("Status", status);
            message.Add("ItemID", itemID);
            message.Add("AssetID", assetID);
            enqueue(message);
        }

        public void Inventory_OnItemCreated(bool success, InventoryItem item)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "InventoryCreated");
            message.Add("Success", success);
            message.Add("Name", item.Name);
            message.Add("FolderID", item.ParentUUID);
            message.Add("UUID", item.UUID);
            message.Add("AssetType", item.AssetType);
            message.Add("AssetUUID", item.AssetUUID);
            message.Add("CreatorID", item.CreatorID);
            message.Add("OwnerID", item.OwnerID);
            message.Add("CreationDate", item.CreationDate);
            message.Add("Description", item.Description);
            message.Add("Flags", item.Flags);
            message.Add("InventoryType", item.InventoryType);
            message.Add("Permissions", item.Permissions);
            enqueue(message);
        }

        public void Inventory_ItemReceived(object sender, ItemReceivedEventArgs e)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "ItemReceived");
            message.Add("Name", e.Item.Name);
            message.Add("FolderID", e.Item.ParentUUID);
            message.Add("UUID", e.Item.UUID);
            message.Add("AssetType", e.Item.AssetType);
            message.Add("AssetUUID", e.Item.AssetUUID);
            message.Add("CreatorID", e.Item.CreatorID);
            message.Add("OwnerID", e.Item.OwnerID);
            message.Add("CreationDate", e.Item.CreationDate);
            message.Add("Description", e.Item.Description);
            message.Add("Flags", e.Item.Flags);
            message.Add("InventoryType", e.Item.InventoryType);
            message.Add("Permissions", e.Item.Permissions);
            enqueue(message);
        }

        public void Inventory_TaskItemReceived(object sender, TaskItemReceivedEventArgs e)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "TaskItemReceived");
            message.Add("ItemID", e.ItemID);
            message.Add("FolderID", e.FolderID);
            message.Add("CreatorID", e.CreatorID);
            message.Add("AssetID", e.AssetID);
            message.Add("Type", (byte)e.Type);
            enqueue(message);
        }
        
        public void Parcels_ParcelProperties(object sender, ParcelPropertiesEventArgs e)
        {
            if(e.Result == ParcelResult.NoData)
            {
                Hashtable message = new Hashtable();
                message.Add("MessageType", "ParcelPropertiesFailed");
                message.Add("LocalID", e.Parcel.LocalID);
                message.Add("SequenceID", e.SequenceID);
                enqueue(message);
            }
            else
            {
                Hashtable message = new Hashtable();
                message.Add("MessageType", "ParcelProperties");
                message.Add("SequenceID", e.SequenceID);
                message.Add("LocalID", e.Parcel.LocalID);
                message.Add("AABBMax", e.Parcel.AABBMax);
                message.Add("AABBMin", e.Parcel.AABBMin);
                message.Add("AccessList", e.Parcel.AccessWhiteList);
                message.Add("BanList", e.Parcel.AccessBlackList);
                message.Add("Area", e.Parcel.Area);
                message.Add("AuctionID", e.Parcel.AuctionID);
                message.Add("AuthBuyerID", e.Parcel.AuthBuyerID);
                message.Add("Category", e.Parcel.Category);
                message.Add("ClaimDate", e.Parcel.ClaimDate);
                message.Add("ClaimPrice", e.Parcel.ClaimPrice);
                message.Add("Desc", e.Parcel.Desc);
                message.Add("Dwell", e.Parcel.Dwell);
                message.Add("Flags", (uint)e.Parcel.Flags);
                message.Add("GroupID", e.Parcel.GroupID);
                message.Add("GroupPrims", e.Parcel.GroupPrims);
                message.Add("IsGroupOwned", e.Parcel.IsGroupOwned);
                message.Add("LandingType", e.Parcel.Landing);
                message.Add("MaxPrims", e.Parcel.MaxPrims);
                message.Add("MediaAutoScale", e.Parcel.Media.MediaAutoScale);
                message.Add("MediaDesc", e.Parcel.Media.MediaDesc);
                message.Add("MediaHeight", e.Parcel.Media.MediaHeight);
                message.Add("MediaID", e.Parcel.Media.MediaID);
                message.Add("MediaLoop", e.Parcel.Media.MediaLoop);
                message.Add("MediaType", e.Parcel.Media.MediaType);
                message.Add("MediaURL", e.Parcel.Media.MediaURL);
                message.Add("MediaWidth", e.Parcel.Media.MediaWidth);
                message.Add("MusicURL", e.Parcel.MusicURL);
                message.Add("Name", e.Parcel.Name);
                message.Add("ObscureMedia", e.Parcel.ObscureMedia);
                message.Add("ObscureMusic", e.Parcel.ObscureMusic);
                message.Add("OtherCleanTime", e.Parcel.OtherCleanTime);
                message.Add("OtherPrims", e.Parcel.OtherPrims);
                message.Add("OwnerPrims", e.Parcel.OwnerPrims);
                message.Add("OwnerID", e.Parcel.OwnerID);
                message.Add("PrimBonus", e.Parcel.ParcelPrimBonus);
                message.Add("PassHours", e.Parcel.PassHours);
                message.Add("PassPrice", e.Parcel.PassPrice);
                message.Add("PublicCount", e.Parcel.PublicCount);
                message.Add("RegionDenyAgeUnverified", e.Parcel.RegionDenyAgeUnverified);
                message.Add("RegionDenyAnonymous", e.Parcel.RegionDenyAnonymous);
                message.Add("RegionPushOverride", e.Parcel.RegionPushOverride);
                message.Add("RentPrice", e.Parcel.RentPrice);
                message.Add("SalePrice", e.Parcel.SalePrice);
                message.Add("SelectedPrims", e.SelectedPrims);
                message.Add("SelfCount", e.Parcel.SelfCount);
                message.Add("SimWideMaxPrims", e.Parcel.SimWideMaxPrims);
                message.Add("SimWideTotalPrims", e.Parcel.SimWideTotalPrims);
                message.Add("SnapshotID", e.Parcel.SnapshotID);
                message.Add("Status", e.Parcel.Status);
                message.Add("TotalPrims", e.Parcel.TotalPrims);
                message.Add("UserLocation", e.Parcel.UserLocation);
                message.Add("UserLookAt", e.Parcel.UserLookAt);
                enqueue(message);
            }
        }
    }
}
