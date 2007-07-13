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
using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using libsecondlife;
using MiniHttpd;

namespace AjaxLife
{
    internal class TextureFile : IFile, IResource, IDisposable
    {
        // Fields
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, Hashtable> users;

        // Methods
        public TextureFile(Dictionary<Guid, Hashtable> users, string name, IDirectory parent)
        {
            this.users = users;
            this.name = name;
            this.parent = parent;
        }

        public void Dispose()
        {
        }

        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            if ((this.name.Length == 40) && (Regex.Replace(this.name.Substring(0, 0x24), "/[^a-f0-9-]/", "").Length == 0x24))
            {
                try
                {
                    SecondLife life;
                    Hashtable hashtable;
                    Guid guid = new Guid(request.Query["sid"]);
                    lock (this.users)
                    {
                        hashtable = this.users[guid];
                    }
                    lock (hashtable)
                    {
                        life = (SecondLife)hashtable["SecondLife"];
                    }
                    lock (hashtable)
                    {
                        hashtable["LastRequest"] = DateTime.Now;
                    }
                    if (File.Exists("texturecache/" + this.name))
                    {
                        byte[] buffer = File.ReadAllBytes("texturecache/" + this.name);
                        request.Response.ResponseContent.Write(buffer, 0, buffer.Length);
                    }
                    else
                    {
                        byte[] bytes = life.Images.RequestImage(new LLUUID(this.name.Substring(0, 0x24)));
                        File.WriteAllBytes("texturecache/" + this.name + ".j2c", bytes);
                        Process process = Process.Start("convert", "texturecache/" + this.name + ".j2c texturecache/" + this.name);
                        process.WaitForExit();
                        process.Dispose();
                        File.Delete("texturecache/" + this.name + ".j2c");
                        byte[] buffer3 = File.ReadAllBytes("texturecache/" + this.name);
                        request.Response.ResponseContent.Write(buffer3, 0, buffer3.Length);
                    }
                }
                catch
                {
                }
            }
            request.Response.ResponseContent.Flush();
        }

        // Properties
        public string ContentType
        {
            get
            {
                return "image/png";
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