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
using OpenMetaverse;

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

        private GridClient Client;
        private Dictionary<uint, Avatar> avatars = new Dictionary<uint, Avatar>();

        public AvatarTracker(GridClient client)
        {
            this.Client = client;
            this.Client.Objects.AvatarUpdate += new EventHandler<AvatarUpdateEventArgs>(Objects_AvatarUpdate);
            this.Client.Objects.KillObject += new EventHandler<KillObjectEventArgs>(Objects_KillObject);
            this.Client.Self.TeleportProgress += new EventHandler<TeleportEventArgs>(Self_TeleportProgress);
            this.Client.Objects.ObjectUpdate += new EventHandler<PrimEventArgs>(Objects_ObjectUpdate);
        }

        void Self_TeleportProgress(object sender, TeleportEventArgs e)
        {
            if (e.Status == TeleportStatus.Finished)
            {
                this.avatars.Clear();
            }
        }

        void Objects_AvatarUpdate(object sender, AvatarUpdateEventArgs e)
        {
            // Check if we already know about this avatar. If not, add it and announce the callback.
            // Otherwise just update the cache with the new information (e.g. changed position)
            if (!this.avatars.ContainsKey(e.Avatar.LocalID))
            {
                lock (this.avatars) this.avatars.Add(e.Avatar.LocalID, e.Avatar);
                if (OnAvatarAdded != null) OnAvatarAdded(e.Avatar);
            }
            else
            {
                lock (this.avatars) this.avatars[e.Avatar.LocalID] = e.Avatar;
            }
        }

        void Objects_ObjectUpdate(object sender, PrimEventArgs e)
        {
            // If we know of this avatar, update its position and rotation, and send an AvatarUpdated callback.
            if (this.avatars.ContainsKey(e.Prim.LocalID))
            {
                Avatar avatar;
                lock (this.avatars) avatar = this.avatars[e.Prim.LocalID];
                avatar.Position = e.Prim.Position;
                avatar.Rotation = e.Prim.Rotation;
            }
        }

        void Objects_KillObject(object sender, KillObjectEventArgs e)
        {
            // If we know of this avatar, remove it and announce its loss.
            lock (this.avatars)
            {
                if (avatars.ContainsKey(e.ObjectLocalID))
                {
                    Avatar avatar = this.avatars[e.ObjectLocalID];
                    this.avatars.Remove(e.ObjectLocalID);
                    if (OnAvatarRemoved != null) OnAvatarRemoved(avatar);
                }
            }
        }
    }
}
