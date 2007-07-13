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
using libsecondlife.InventorySystem;
using Newtonsoft.Json;

namespace AjaxLife
{
    internal class Events
    {
        // Fields
        private Queue<Hashtable> pending = new Queue<Hashtable>();
        private bool active = true;

        // Methods
        public void Avatars_OnAvatarGroups(LLUUID avatarID, AvatarGroupsReplyPacket.GroupDataBlock[] groups)
        {
            if (!active) return;
            List<Hashtable> list = new List<Hashtable>();
            foreach (AvatarGroupsReplyPacket.GroupDataBlock block in groups)
            {
                Hashtable hashtable = new Hashtable();
                hashtable.Add("GroupID", block.GroupID.ToStringHyphenated());
                hashtable.Add("GroupInsigniaID", block.GroupInsigniaID.ToStringHyphenated());
                hashtable.Add("GroupName", Helpers.FieldToUTF8String(block.GroupName));
                hashtable.Add("GroupTitle", Helpers.FieldToUTF8String(block.GroupTitle));
                hashtable.Add("GroupPowers", block.GroupPowers);
                hashtable.Add("AcceptNotices", block.AcceptNotices);
                list.Add(hashtable);
            }
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarGroups");
            item.Add("AvatarID", avatarID.ToStringHyphenated());
            item.Add("Groups", list);
            this.pending.Enqueue(item);
        }

        public void Avatars_OnAvatarInterests(LLUUID avatarID, Avatar.Interests interests)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "AvatarInterests");
            item.Add("AvatarID", avatarID.ToStringHyphenated());
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
            item.Add("Names", names);
            this.pending.Enqueue(item);
        }

        public void Avatars_OnAvatarProperties(Packet packet, Simulator sim)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            AvatarPropertiesReplyPacket reply = (AvatarPropertiesReplyPacket)packet;
            item.Add("MessageType",     "AvatarProperties");
            item.Add("AvatarID",        reply.AgentData.AvatarID.ToStringHyphenated());
            item.Add("PartnerID",       reply.PropertiesData.PartnerID.ToStringHyphenated());
            item.Add("AboutText",       Helpers.FieldToUTF8String(reply.PropertiesData.AboutText));
            item.Add("FirstLifeText",   Helpers.FieldToUTF8String(reply.PropertiesData.FLAboutText));
            item.Add("FirstLifeImage",  reply.PropertiesData.FLImageID.ToStringHyphenated());
            item.Add("ProfileImage",    reply.PropertiesData.ImageID.ToStringHyphenated());
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
            item.Add("AgentID", agentID.ToStringHyphenated());
            item.Add("Online", online);
            this.pending.Enqueue(item);
        }

        public void Directory_OnDirPeopleReply(LLUUID queryID, List<DirectoryManager.AgentSearchData> matchedPeople)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "DirPeopleReply");
            item.Add("MatchedPeople", matchedPeople);
            this.pending.Enqueue(item);
        }

        public int GetEventCount()
        {
            return this.pending.Count;
        }

        public string GetPendingJson()
        {
            StringWriter textWriter = new StringWriter();
            JsonWriter jsonWriter = new JsonWriter(textWriter);
            jsonWriter.WriteStartArray();
            JsonSerializer serializer = new JsonSerializer();
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

        public void Inventory_OnInventoryFolderReceived(LLUUID fromAgentID, string fromAgentName, uint parentEstateID, LLUUID regionID, LLVector3 position, DateTime timestamp, InventoryFolder folder)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "InventoryFolderReceived");
            item.Add("FromAgentID", fromAgentID.ToStringHyphenated());
            item.Add("FromAgentName", fromAgentName);
            item.Add("ParentEstateID", parentEstateID);
            item.Add("RegionID", regionID.ToStringHyphenated());
            item.Add("Position", position);
            item.Add("Timestamp", timestamp);
            item.Add("Name", folder.Name);
            item.Add("FolderID", folder.FolderID.ToStringHyphenated());
            this.pending.Enqueue(item);
        }

        public void Inventory_OnInventoryItemReceived(LLUUID fromAgentID, string fromAgentName, uint parentEstateID, LLUUID regionID, LLVector3 position, DateTime timestamp, InventoryItem item)
        {
            if (!active) return;
            Hashtable hashtable = new Hashtable();
            hashtable.Add("MessageType", "InventoryItemRecieved");
            hashtable.Add("FromAgentID", fromAgentID.ToStringHyphenated());
            hashtable.Add("FromAgentName", fromAgentName);
            hashtable.Add("ParentEstateID", parentEstateID);
            hashtable.Add("RegionID", regionID.ToStringHyphenated());
            hashtable.Add("Position", position);
            hashtable.Add("Timestamp", timestamp);
            hashtable.Add("ItemID", item.AssetID.ToStringHyphenated());
            hashtable.Add("BaseMask", item.BaseMask);
            hashtable.Add("Description", item.Description);
            hashtable.Add("InvType", item.InvType);
            hashtable.Add("Name", item.Name);
            hashtable.Add("ItemID", item.ItemID.ToStringHyphenated());
            hashtable.Add("CreationDate", item.CreationDate);
            hashtable.Add("CreatorID", item.CreatorID.ToStringHyphenated());
            hashtable.Add("Type", item.Type);
            hashtable.Add("NextOwnerMask", item.NextOwnerMask);
            this.pending.Enqueue(hashtable);
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

        public void Self_OnChat(string message, MainAvatar.ChatAudibleLevel audible, MainAvatar.ChatType type, MainAvatar.ChatSourceType sourceType, string fromName, LLUUID id, LLUUID ownerid, LLVector3 position)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "SpatialChat");
            item.Add("Message", message);
            item.Add("Audible", audible);
            item.Add("Type", type);
            item.Add("SourceType", sourceType);
            item.Add("FromName", fromName);
            item.Add("ID", id.ToStringHyphenated());
            item.Add("OwnerID", ownerid.ToStringHyphenated());
            item.Add("Position", position);
            this.pending.Enqueue(item);
        }

        public void Self_OnInstantMessage(LLUUID fromAgentID, string fromAgentName, LLUUID toAgentID, uint parentEstateID, LLUUID regionID, LLVector3 position, MainAvatar.InstantMessageDialog dialog, bool groupIM, LLUUID imSessionID, DateTime timestamp, string message, MainAvatar.InstantMessageOnline offline, byte[] binaryBucket)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "InstantMessage");
            item.Add("FromAgentID", fromAgentID.ToStringHyphenated());
            item.Add("FromAgentName", fromAgentName);
            item.Add("ParentEstateID", parentEstateID.ToString());
            item.Add("RegionID", regionID.ToStringHyphenated());
            item.Add("Position", position);
            item.Add("Dialog", dialog);
            item.Add("GroupIM", groupIM);
            item.Add("IMSessionID", imSessionID.ToStringHyphenated());
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
            item.Add("TransactionID", transactionID.ToStringHyphenated());
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
            item.Add("ImageID", imageID.ToStringHyphenated());
            item.Add("ObjectID", objectID.ToStringHyphenated());
            item.Add("FirstName", firstName);
            item.Add("LastName", lastName);
            item.Add("ChatChannel", chatChannel);
            item.Add("Buttons", buttons);
            this.pending.Enqueue(item);
        }

        public void Self_OnScriptQuestion(LLUUID taskID, LLUUID itemID, string objectName, string objectOwner, MainAvatar.ScriptPermission questions)
        {
            if (!active) return;
            Hashtable item = new Hashtable();
            item.Add("MessageType", "ScriptPermissionRequest");
            item.Add("TaskID", taskID.ToStringHyphenated());
            item.Add("ItemID", itemID.ToStringHyphenated());
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
                itemhash.Add("ID", data.ID.ToStringHyphenated());
                items.Add(itemhash);
            }
            hash.Add("Items", items);
            this.pending.Enqueue(hash);
        }

        public void deactivate()
        {
            active = false;
        }
    }
}