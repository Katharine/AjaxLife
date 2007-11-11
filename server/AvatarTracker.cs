using System;
using System.Collections.Generic;
using System.Text;
using libsecondlife;

namespace AjaxLife
{
    class AvatarTracker
    {
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
            //this.Client.Objects.OnObjectUpdated += new ObjectManager.ObjectUpdatedCallback(Objects_OnObjectUpdated);
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
            if (!this.avatars.ContainsKey(avatar.LocalID))
            {
                lock(this.avatars) this.avatars.Add(avatar.LocalID, avatar);
                //FIXME: This is liable to fail unless some checking happens.
                OnAvatarAdded(avatar);
            }
            else
            {
                lock(this.avatars) this.avatars[avatar.LocalID] = avatar;
            }
        }

        void Objects_OnObjectUpdated(Simulator simulator, ObjectUpdate update, ulong regionHandle, ushort timeDilation)
        {
            if (this.avatars.ContainsKey(update.LocalID))
            {
                Avatar avatar;
                lock (this.avatars) avatar = this.avatars[update.LocalID];
                avatar.Position = update.Position;
                avatar.Rotation = update.Rotation;
                //FIXME: This is liable to fail unless some checking happens.
                OnAvatarUpdated(avatar);
            }
        }

        void Objects_OnObjectKilled(Simulator simulator, uint objectID)
        {
            lock (this.avatars)
            {
                if (avatars.ContainsKey(objectID))
                {
                    Avatar avatar = this.avatars[objectID];
                    this.avatars.Remove(objectID);
                    OnAvatarRemoved(avatar);
                }
            }
        }
    }
}
