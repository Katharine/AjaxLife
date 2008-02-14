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

namespace AjaxLife.Html
{
    public class Logout : IFile
    {
        #region IFile Members

        public Logout(string name, IDirectory parent, Dictionary<Guid, User> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
        }

        private string name;
        private IDirectory parent;
        private string contenttype = "text/plain; charset=utf-8";
        private Dictionary<Guid, User> users;

        public string ContentType
        {
            get { return contenttype; }
        }

        // Someone wants logout.kat?
        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter writer = new StreamWriter(request.Response.ResponseContent);
            try
            {
                StreamReader reader = new StreamReader(request.PostData);
                string post = reader.ReadToEnd();
                reader.Dispose();
                // Get the user session and SecondLife object.
                Dictionary<string,string> POST = AjaxLife.PostDecode(post);
                Guid session = new Guid(POST["sid"]);
                SecondLife client;
                User user;
                lock (users)
                {
                    user = users[session];
                    client = user.Client;
                    user.LastRequest = DateTime.Now;
                }
                // If we're connected, request a logout.
                if (client.Network.Connected)
                {
                    client.Network.Logout();
                    System.Threading.Thread.Sleep(2000);
                }
                // Deactivate the event queue.
                if(user.Events != null)
                {
                    user.Events.deactivate();
                }
                // Unset everything for garbage collection purposes.
                user.Events = null;
                user.Client = null;
                client = null;
                user.Avatars = null;
                // Remove the user
                lock (users)
                {
                    users.Remove(session);
                }
                // Announce our success.
                writer.WriteLine("{success: true}");
            }   
            catch (Exception e)
            {
                contenttype = "text/plain";
                writer.WriteLine(e.Message);
            }
            writer.Flush();
        }

        #endregion

        #region IResource Members

        public string Name
        {
            get { return this.name; }
        }

        public IDirectory Parent
        {
            get { return this.parent; }
        }

        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            // Nothing to do here.
        }

        #endregion
    }
}
