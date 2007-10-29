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
using libsecondlife;
using libsecondlife.Packets;
using Newtonsoft.Json;
using System.Diagnostics;
using AjaxLife.Converters;

namespace AjaxLife
{
    internal class Events
    {
        // Fields
        private Queue<Hashtable> pending = new Queue<Hashtable>();
        private bool active = true;
        private SecondLife Client;
        private AvatarTracker Avatars;
        private List<LLUUID> LoadedInventory = new List<LLUUID>();

        public Events(Hashtable user)
        {
            lock (user)
            {
                this.Client = (SecondLife)user["SecondLife"];
                this.Avatars = (AvatarTracker)user["Avatars"];
            }
        }

        // Methods
        public void Avatars_OnAvatarGroups(LLUUID avatarID, AvatarGroupsReplyPacket.GroupDataBlock[] groups)
        {
            if (!active) return;
            List<Hashtable> list = new List<Hashtable>();
            foreach (AvatarGroupsReplyPacket.GroupDataBlock block in groups)
            {
                Hashtable hashtable = new Hashtable();
                hashtable.Add("GroupID", block.GroupID);
                hashtable.Add("GroupInsigniaID", block.GroupInsigniaID);
                hashtable.Add("GroupName", Helpers.FieldToUTF8String(block.GroupName));
                hashtable.Add("GroupTitle", Helpers.FieldToUTF8String(block.GroupTitle));
                hashtable.Add("GroupPowers", block.GroupPowers);
                hashtable.Add("AcceptNotices", block.AcceptNotices);
                list.Add(hashtable);
            }
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarGroups");
            item.Add("AvatarID", avatarID);
            item.Add("Groups", list);
            this.pending.Enqueue(item);
        }

        public void Avatars_OnAvatarInterests(LLUUID avatarID, Avatar.Interests interests)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarInterests");
            item.Add("AvatarID", avatarID);
            item.Add("WantToMask", interests.WantToMask);
            item.Add("WantToText", interests.WantToText);
            item.Add("SkillsMask", interests.SkillsMask);
            item.Add("SkillsText", interests.SkillsText);
            item.Add("LanguagesText", interests.LanguagesText);
            this.pending.Enqueue(item);
        }

        public void Avatars_OnAvatarNames(Dictionary<LLUUID, string> names)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarNames");
            Dictionary<string, string> namedict = new Dictionary<string, string>();
            foreach (KeyValuePair<LLUUID, string> name in names)
            {
                namedict.Add(name.Key.ToStringHyphenated(), name.Value);
            }
            item.Add("Names", namedict);
            this.pending.Enqueue(item);
        }

        public void Avatars_OnAvatarProperties(Packet packet, Simulator sim)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            AvatarPropertiesReplyPacket reply = (AvatarPropertiesReplyPacket)packet;
            item.Add("MessageType",     "AvatarProperties");
            item.Add("AvatarID",        reply.AgentData.AvatarID);
            item.Add("PartnerID",       reply.PropertiesData.PartnerID);
            item.Add("AboutText",       Helpers.FieldToUTF8String(reply.PropertiesData.AboutText));
            item.Add("FirstLifeText",   Helpers.FieldToUTF8String(reply.PropertiesData.FLAboutText));
            item.Add("FirstLifeImage",  reply.PropertiesData.FLImageID);
            item.Add("ProfileImage",    reply.PropertiesData.ImageID);
            item.Add("ProfileURL",      Helpers.FieldToUTF8String(reply.PropertiesData.ProfileURL));
            item.Add("BornOn",          Helpers.FieldToUTF8String(reply.PropertiesData.BornOn));
            item.Add("CharterMember",   Helpers.FieldToUTF8String(reply.PropertiesData.CharterMember));
            item.Add("AllowPublish",    reply.PropertiesData.Flags & (0x1 << 0));
            item.Add("MaturePublish",   reply.PropertiesData.Flags & (0x1 << 1));
            item.Add("Identified",      reply.PropertiesData.Flags & (0x1 << 2));
            item.Add("Transacted",      reply.PropertiesData.Flags & (0x1 << 3));
            item.Add("Online",          reply.PropertiesData.Flags & (0x1 << 4));
            this.pending.Enqueue(item);
        }

        public void Avatars_OnFriendNotification(LLUUID agentID, bool online)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "FriendNotification");
            item.Add("AgentID", agentID);
            item.Add("Online", online);
            this.pending.Enqueue(item);
        }

        public void Directory_OnDirPeopleReply(LLUUID queryID, List<DirectoryManager.AgentSearchData> matchedPeople)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "DirPeopleReply");
            List<Hashtable> results = new List<Hashtable>();
            foreach (DirectoryManager.AgentSearchData person in matchedPeople)
            {
                Hashtable result = new Hashtable();
                result.Add("AgentID", person.AgentID);
                result.Add("FirstName", person.FirstName);
                result.Add("LastName", person.LastName);
                results.Add(result);
            }
            item.Add("Results", results);
            this.pending.Enqueue(item);
        }

        public int GetEventCount()
        {
            return this.pending.Count;
        }

        public string GetPendingJson(SecondLife client)
        {
            StringWriter textWriter = new StringWriter();
            JsonWriter jsonWriter = new JsonWriter(textWriter);
            jsonWriter.WriteStartArray();
            JsonSerializer serializer = new JsonSerializer();
            LLUUIDConverter UUID = new LLUUIDConverter();
            serializer.Converters.Add(UUID);
            this.pending.Enqueue(this.GetFooter(client));
            while (this.pending.Count > 0)
            {
                Hashtable hashtable = this.pending.Dequeue();
                serializer.Serialize(jsonWriter, hashtable);
            }
            jsonWriter.WriteEndArray();
            jsonWriter.Flush();
            string text = textWriter.ToString();
            jsonWriter.Close();
            textWriter.Dispose();
            return text;
        }

        public bool Inventory_OnObjectOffered(LLUUID fromAgentID, string fromAgentName, uint parentEstateID, LLUUID regionID, LLVector3 position, DateTime timestamp, AssetType type, LLUUID objectID, bool fromTask)
        {
            if (!active) return false;
            Hashtable hashtable = new Hashtable();
            hashtable.Add("MessageType", "ObjectOffered");
            hashtable.Add("FromAgentID", fromAgentID);
            hashtable.Add("FromAgentName", fromAgentName);
            hashtable.Add("ParentEstateID", parentEstateID);
            hashtable.Add("RegionID", regionID);
            hashtable.Add("Position", position);
            hashtable.Add("Timestamp", timestamp);
            hashtable.Add("Type", type);
            hashtable.Add("ObjectID", objectID);
            hashtable.Add("FromTask", fromTask);
            this.pending.Enqueue(hashtable);
            return true; // Sigh...
        }

        public void Network_OnDisconnected(NetworkManager.DisconnectType reason, string message)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "Disconnected");
            item.Add("Reason", reason);
            item.Add("Message", message);
            this.pending.Enqueue(item);
        }

        public void Self_OnBalanceUpdated(int balance)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "BalanceUpdated");
            item.Add("Balance", balance);
            this.pending.Enqueue(item);
        }
        public void Self_OnChat(string message, ChatAudibleLevel audible, ChatType type, ChatSourceType sourceType, string fromName, LLUUID id, LLUUID ownerid, LLVector3 position)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "SpatialChat");
            item.Add("Message", message);
            item.Add("Audible", audible);
            item.Add("Type", type);
            item.Add("SourceType", sourceType);
            item.Add("FromName", fromName);
            item.Add("ID", id);
            item.Add("OwnerID", ownerid);
            item.Add("Position", position);
            this.pending.Enqueue(item);
        }
        public void Self_OnInstantMessage(InstantMessage im, Simulator simulator)
        {
            if (!active) return;
            LLUUID fromAgentID = im.FromAgentID;
            string fromAgentName = im.FromAgentName;
            LLUUID toAgentID = im.ToAgentID;
            LLUUID regionID = im.RegionID;
            LLVector3 position = im.Position;
            InstantMessageDialog dialog = im.Dialog;
            bool groupIM = im.GroupIM;
            LLUUID imSessionID = im.IMSessionID;
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
            this.pending.Enqueue(item);
        }

        public void Self_OnMoneyBalanceReplyReceived(LLUUID transactionID, bool transactionSuccess, int balance, int metersCredit, int metersCommitted, string description)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "MoneyBalanceReplyReceived");
            item.Add("TransactionID", transactionID);
            item.Add("TransactionSuccess", transactionSuccess);
            item.Add("Balance", balance);
            item.Add("MetersCredit", metersCredit);
            item.Add("MetersCommitted", metersCommitted);
            item.Add("Description", description);
            this.pending.Enqueue(item);
        }

        public void Self_OnScriptDialog(string message, string objectName, LLUUID imageID, LLUUID objectID, string firstName, string lastName, int chatChannel, List<string> buttons)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "ScriptDialog");
            item.Add("Message", message);
            item.Add("ObjectName", objectName);
            item.Add("ImageID", imageID);
            item.Add("ObjectID", objectID);
            item.Add("FirstName", firstName);
            item.Add("LastName", lastName);
            item.Add("ChatChannel", chatChannel);
            item.Add("Buttons", buttons);
            this.pending.Enqueue(item);
        }

        public void Self_OnScriptQuestion(Simulator simulator, LLUUID taskID, LLUUID itemID, string objectName, string objectOwner, ScriptPermission questions)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "ScriptPermissionRequest");
            item.Add("TaskID", taskID);
            item.Add("ItemID", itemID);
            item.Add("ObjectName", objectName);
            item.Add("ObjectOwner", objectOwner);
            item.Add("Permissions", (int)questions);
            this.pending.Enqueue(item);
        }

        public void Self_OnTeleport(string message, MainAvatar.TeleportStatus status, MainAvatar.TeleportFlags flags)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "Teleport");
            item.Add("Status", status);
            item.Add("Flags", flags); 
            this.pending.Enqueue(item);
        }

        public void Packet_MapBlockReply(Packet packet, Simulator sim)
        {
            if (!active) return;
            MapBlockReplyPacket reply = (MapBlockReplyPacket)packet;
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "MapBlocks");
            Hashtable blocks = new Hashtable();
            foreach (MapBlockReplyPacket.DataBlock data in reply.Data)
            {
                string name = Helpers.FieldToUTF8String(data.Name);
                if (blocks.ContainsKey(name.ToLowerInvariant()))
                {
                    continue;
                }
                Hashtable simhash = new Hashtable();
                simhash.Add("Name", Helpers.FieldToUTF8String(data.Name));
                simhash.Add("Access", data.Access);
                simhash.Add("Agents", data.Agents);
                simhash.Add("X", data.X);
                simhash.Add("Y", data.Y);
                simhash.Add("Flags", data.RegionFlags);
                blocks.Add(Helpers.FieldToUTF8String(data.Name).ToLowerInvariant(), simhash);
            }
            hash.Add("Blocks", blocks);
            this.pending.Enqueue(hash);
        }

        public void Packet_MapItemReply(Packet packet, Simulator sim)
        {
            if (!active) return;
            MapItemReplyPacket reply = (MapItemReplyPacket)packet;
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "MapItems");
            List<Hashtable> items = new List<Hashtable>();
            hash.Add("ItemType", reply.RequestData.ItemType);
            foreach (MapItemReplyPacket.DataBlock data in reply.Data)
            {
                Hashtable itemhash = new Hashtable();
                itemhash.Add("Name", Helpers.FieldToUTF8String(data.Name));
                itemhash.Add("X", data.X);
                itemhash.Add("Y", data.Y);
                itemhash.Add("Extra", data.Extra);
                itemhash.Add("Extra2", data.Extra2);
                itemhash.Add("ID", data.ID);
                items.Add(itemhash);
            }
            hash.Add("Items", items);
            this.pending.Enqueue(hash);
        }

        public void Assets_OnImageReceived(ImageDownload image, AssetTexture asset)
        {
            if (image.NotFound)
            {
                Console.WriteLine("Failed to download " + image.ID.ToStringHyphenated() + " - not found.");
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "ImageDownloaded");
                hash.Add("UUID", image.ID);
                hash.Add("Success", false);
                hash.Add("Error", "Image not found in database.");
                this.pending.Enqueue(hash);
            }
            else if (image.Success)
            {
                string key = image.ID.ToStringHyphenated();
                File.WriteAllBytes(AjaxLife.TEXTURE_CACHE + key + ".j2c", image.AssetData);
                Process process = Process.Start("convert", AjaxLife.TEXTURE_CACHE + key + ".j2c " + AjaxLife.TEXTURE_CACHE + key + ".png");
                process.WaitForExit();
                process.Dispose();
                File.Delete(AjaxLife.TEXTURE_CACHE + key + ".j2c");
                Console.WriteLine("Downloaded image " + key + " - " + image.Size + " bytes.");
                ++AjaxLife.TextureCacheCount;
                AjaxLife.TextureCacheSize += (new FileInfo(AjaxLife.TEXTURE_CACHE + key + ".png")).Length;
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "ImageDownloaded");
                hash.Add("Success", true);
                hash.Add("Size", image.Size);
                hash.Add("UUID", key);
                hash.Add("URL", "textures/" + key + ".png");
                this.pending.Enqueue(hash);
            }
            else
            {
                Console.WriteLine("Failed to download " + image.ID + ".");
                Hashtable hash = new Hashtable();
                hash.Add("MessageType", "ImageDownloaded");
                hash.Add("UUID", image.ID);
                hash.Add("Success", false);
                hash.Add("Error", "Unknown error.");
                this.pending.Enqueue(hash);
            }
        }

        public void Friends_OnFriendshipOffered(LLUUID agentID, string agentName, LLUUID imSessionID)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendshipOffered");
            hash.Add("AgentID", agentID);
            hash.Add("AgentName", agentName);
            hash.Add("IMSessionID", imSessionID);
            this.pending.Enqueue(hash);
        }

        public void Friends_OnFriendRights(FriendsManager.FriendInfo friend)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendRightsChanged");
            hash.Add("Name", friend.Name);
            hash.Add("ID", friend.UUID);
            hash.Add("TheirRights", friend.TheirRightsFlags);
            hash.Add("MyRights", friend.MyRightsFlags);
            hash.Add("Online", friend.IsOnline);
            this.pending.Enqueue(hash);
        }

        public void Friends_OnOnOffline(FriendsManager.FriendInfo friend)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "FriendOnOffline");
            hash.Add("Name", friend.Name);
            hash.Add("ID", friend.UUID);
            hash.Add("TheirRights", friend.TheirRightsFlags);
            hash.Add("MyRights", friend.MyRightsFlags);
            hash.Add("Online", friend.IsOnline);
            this.pending.Enqueue(hash);
        }

        public void AvatarTracker_OnAvatarAdded(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarAdded");
            hash.Add("Name", avatar.Name);
            hash.Add("ID", avatar.ID);
            hash.Add("LocalID", avatar.LocalID);
            hash.Add("Position", avatar.Position);
            hash.Add("Rotation", avatar.Rotation);
            hash.Add("Scale", avatar.Scale);
            hash.Add("GroupName", avatar.GroupName);
            this.pending.Enqueue(hash);
        }

        public void AvatarTracker_OnAvatarRemoved(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarRemoved");
            hash.Add("Name", avatar.Name);
            hash.Add("ID", avatar.ID);
            hash.Add("LocalID", avatar.LocalID);
            this.pending.Enqueue(hash);
        }

        public void AvatarTracker_OnAvatarUpdated(Avatar avatar)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AvatarUpdated");
            hash.Add("ID", avatar.ID);
            hash.Add("Position", avatar.Position);
            hash.Add("Rotation", avatar.Rotation);
            this.pending.Enqueue(hash);
        }

        public void Assets_OnAssetReceived(AssetDownload transfer, Asset asset)
        {
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "AssetReceived");
            //Console.WriteLine(Helpers.FieldToUTF8String(asset.AssetData));
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
                        hash.Add("AssetData", Helpers.FieldToUTF8String(asset.AssetData));
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
            this.pending.Enqueue(hash);
        }

        public void Inventory_OnFolderUpdated(LLUUID folderID)
        {
            List<InventoryBase> contents = Client.Inventory.Store.GetContents(folderID);
            Hashtable roothash = new Hashtable();
            roothash.Add("MessageType", "FolderUpdated");
            roothash.Add("FolderID", folderID);
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
                        hash.Add("OwnerID", folder.OwnerID.ToStringHyphenated());
                        hash.Add("UUID", folder.UUID.ToStringHyphenated());
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
            this.pending.Enqueue(roothash);
        }

        public void Terrain_OnLandPatch(Simulator simulator, int x, int y, int width, float[] data)
        {
            if (x >= 16 || y >= 16)
            {
                Console.WriteLine("Bad patch coordinates, (" + x + ", " + y+")");
                return;
            }

            if (width != 16)
            {
                Console.WriteLine("Unhandled patch size " + width + "x" + width);
                return;
            }
            Hashtable hash = new Hashtable();
            hash.Add("MessageType", "LandPatch");
            hash.Add("OffsetX", x * 16);
            hash.Add("OffsetY", y * 16);
            hash.Add("Region", simulator.Name);
            hash.Add("WaterLevel", simulator.WaterHeight); // Is there anywhere better to put this?
            
            float[,] landscape = new float[16, 16];
            for (int i = 0; i < 16; ++i)
            {
                for (int j = 0; j < 16; ++j)
                {
                    landscape[i, j] = data[i * 16 + j];
                }
            }
            // Ugly hack to fix the JSON encoding.
            Dictionary<int, float[]> resp = new Dictionary<int, float[]>(); // Lists don't maintain element ordering.
            for (int i = 0; i < 16; ++i)
            {
                float[] row = new float[16];
                for (int j = 0; j < 16; ++j)
                {
                    row[j] = landscape[i, j];
                }
                resp.Add(i, row);
            }
            hash.Add("Patch", resp);
            this.pending.Enqueue(hash);
        }

        public void deactivate()
        {
            active = false;
        }

        public void ClearInventory()
        {
            LoadedInventory.Clear();
        }

        public Hashtable GetFooter(SecondLife client)
        {
            Hashtable message = new Hashtable();
            message.Add("MessageType", "UsefulData");
            message.Add("Positions", client.Network.CurrentSim.AvatarPositions);
            message.Add("YourPosition", client.Self.Position);
            message.Add("YourRegion", client.Network.CurrentSim.Name);
            return message;
        }
    }
}