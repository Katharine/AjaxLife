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
using System.Collections.Generic;
using System.Text;
using OpenMetaverse;

namespace AjaxLife
{
    // This has to be a reference type to avoid things breaking horribly.
    // That means a class, as opposed to a struct.
    public class User
    {
        public GridClient Client;
        public DateTime LastRequest;
        public Events Events;
        public AvatarTracker Avatars;
        public string Challenge;
        public double Rotation;
        public bool LindenGrid;
        public int SignedCallCount = 0;
        public string Signature = "";
        public List<string> RequestedEvents;

        // Useful functions
        // Creates the client if it doesn't already exist.
        public GridClient GetClient()
        {
            if (this.Client != null) return this.Client;
            GridClient client = new GridClient();
            client.Settings.ALWAYS_DECODE_OBJECTS = false;
            client.Settings.ALWAYS_REQUEST_OBJECTS = false;
            client.Settings.MULTIPLE_SIMS = false;
            client.Settings.ENABLE_SIMSTATS = true;
            client.Settings.LOGOUT_TIMEOUT = 20000;
            client.Settings.LOG_RESENDS = false;
            client.Settings.USE_ASSET_CACHE = false;
            client.Throttle.Cloud = 0;
            client.Throttle.Task = 0;
            client.Throttle.Wind = 0;
            client.Throttle.Asset = 50000;
            client.Throttle.Resend = 500000;
            client.Throttle.Texture = 500000;
            this.Client = client;
            return client;
        }

        public void ParseRequestedEvents(string events)
        {
            RequestedEvents = new List<string>();
            string[] list = events.Split(',');
            foreach (string e in list)
            {
                RequestedEvents.Add(e.Trim());
            }
        }

        // Useful static functions.
        public static User CreateUser()
        {
            User user = new User();
            user.LastRequest = DateTime.Now;
            user.Challenge = RSACrypto.CreateChallengeString(AjaxLife.RSAp);
            user.Rotation = -Math.PI;
            return user;
        }
    }
}
