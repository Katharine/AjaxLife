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
using System.IO;
using MiniHttpd;

namespace AjaxLife.Html
{
    public class CreateSession : IFile
    {
        private string name;
        private IDirectory parent;
        private Dictionary<Guid, User> users;

        public CreateSession(string name, IDirectory parent, Dictionary<Guid, User> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
        }

        public void Dispose()
        {
        }

        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter writer = new StreamWriter(request.Response.ResponseContent);
            Guid key = Guid.NewGuid();
            User user = User.CreateUser();
            lock (users) users.Add(key, user);
            Hashtable ret = new Hashtable();
            ret.Add("SessionID", key.ToString("D"));
            ret.Add("Challenge", user.Challenge);
            ret.Add("Exponent", StringHelper.BytesToHexString(AjaxLife.RSAp.Exponent));
            ret.Add("Modulus", StringHelper.BytesToHexString(AjaxLife.RSAp.Modulus));
            ret.Add("Grids", AjaxLife.LOGIN_SERVERS.Keys);
            ret.Add("DefaultGrid", AjaxLife.DEFAULT_LOGIN_SERVER);
            writer.Write(MakeJson.FromHashtable(ret));
            writer.Flush();
        }

        public string ContentType { get { return "application/json"; } }
        public string Name { get { return name; } }
        public IDirectory Parent { get { return parent; } }
    }
}
