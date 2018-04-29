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
using System.Diagnostics;
using MiniHttpd;
using OpenMetaverse;
using OpenMetaverse.Packets;
using Newtonsoft.Json;

namespace AjaxLife.Html
{
    public class BasicStats : IFile
    {
        // Fields
        private string contenttype = "text/plain; charset=utf-8";
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, User> users;
        private DateTime started;
        private PerformanceCounter cpu = new PerformanceCounter("Processor", "% Processor Time");

        // Methods
        public BasicStats(string name, IDirectory parent, Dictionary<Guid, User> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
            this.started = DateTime.UtcNow;
        }

        public void Dispose()
        {
        }

        // Somebody asked for ping.kat.
        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter textWriter = new StreamWriter(request.Response.ResponseContent);
            try
            {
                // Loop through each user and check if they're connected. If so,
                // increment the connected count.
                int usercount = 0;
                foreach (KeyValuePair<Guid, User> pair in users)
                {
                    User user = pair.Value;
                    if (user.Client != null && user.Client.Network.Connected)
                    {
                        ++usercount;
                    }
                }
                // Write out the connected count.
                textWriter.WriteLine(usercount);
                // Work out and write the time running in seconds.
                TimeSpan span = DateTime.UtcNow.Subtract(started);
                textWriter.WriteLine(span.TotalSeconds);
                textWriter.WriteLine(cpu.NextValue());
            }
            catch (Exception exception)
            {
                this.contenttype = "text/plain";
                textWriter.WriteLine(exception.Message);
            }
            textWriter.Flush();
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
