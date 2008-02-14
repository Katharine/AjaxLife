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
using System.Collections.Generic;
using System.Text;
using libsecondlife;

namespace AjaxLife
{
    public class AvatarTracker
    {
	// These define the events that are called when avatar-related events occur.
        public delegate void Added(Avatar avatar);
        public event Added OnAvatarAdded;
        public delegate void Removed(Avatar avatar);
        public event Removed OnAvatarRemoved;
        public delegate void Updated(Avatar avatar);
        public event Updated OnAvatarUpdated;
        public Dictionary<uint, Avatar> Avatars { get { return this.avatars; } }

        private SecondLife Client;
        private Dictionary<uint, Avatar> avatars = new Dictionary<uint, Avatar>();

        public AvatarTracker(SecondLife client)
        {
            this.Client = client;
            this.Client.Objects.OnNewAvatar += new ObjectManager.NewAvatarCallback(Objects_OnNewAvatar);
            this.Client.Objects.OnObjectKilled += new ObjectManager.KillObjectCallback(Objects_OnObjectKilled);
            this.Client.Self.OnTeleport += new AgentManager.TeleportCallback(Self_OnTeleport);
            // The below is disabled because it generates excessive traffic, and a handler was never written for it
            // anyway.
            // this.Client.Objects.OnObjectUpdated += new ObjectManager.ObjectUpdatedCallback(Objects_OnObjectUpdated);
        }

        void Self_OnTeleport(string message, AgentManager.TeleportStatus status, AgentManager.TeleportFlags flags)
        {
            if (status == AgentManager.TeleportStatus.Finished)
            {
                this.avatars.Clear();
            }
        }

        void Objects_OnNewAvatar(Simulator simulator, Avatar avatar, ulong regionHandle, ushort timeDilation)
        {
            // Check if we already know about this avatar. If not, add it and announce the callback.
            // Otherwise just update the cache with the new information (e.g. changed position)
            if (!this.avatars.ContainsKey(avatar.LocalID))
            {
                lock(this.avatars) this.avatars.Add(avatar.LocalID, avatar);
                if(OnAvatarAdded != null) OnAvatarAdded(avatar);
            }
            else
            {
                lock(this.avatars) this.avatars[avatar.LocalID] = avatar;
            }
        }

		/*
        void Objects_OnObjectUpdated(Simulator simulator, ObjectUpdate update, ulong regionHandle, ushort timeDilation)
        {
            // If we know of this avatar, update its position and rotation, and send an AvatarUpdated callback.
            if (this.avatars.ContainsKey(update.LocalID))
            {
                Avatar avatar;
                lock (this.avatars) avatar = this.avatars[update.LocalID];
                avatar.Position = update.Position;
                avatar.Rotation = update.Rotation;
                if(OnAvatarUpdated != null) OnAvatarUpdated(avatar);
            }
        }
		*/
		
        void Objects_OnObjectKilled(Simulator simulator, uint objectID)
        {
            // If we know of this avatar, remove it and announce its loss.
            lock (this.avatars)
            {
                if (avatars.ContainsKey(objectID))
                {
                    Avatar avatar = this.avatars[objectID];
                    this.avatars.Remove(objectID);
                    if(OnAvatarRemoved != null) OnAvatarRemoved(avatar);
                }
            }
        }
    }
}
