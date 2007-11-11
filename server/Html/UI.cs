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
    public class UI : IFile
    {
        #region IFile Members

        public UI(string name, IDirectory parent, Dictionary<Guid, Hashtable> users)
        {
            this.name = name;
            this.parent = parent;
            this.users = users;
        }

        private string name;
        private IDirectory parent;
        private Dictionary<Guid, Hashtable> users;

        public string ContentType
        {
            get { return "text/html; charset=utf-8"; }
        }

        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter writer = new StreamWriter(request.Response.ResponseContent);
            try
            {
                SecondLife client;
                Hashtable user;
                Dictionary<string, string> POST = AjaxLife.PostDecode((new StreamReader(request.PostData)).ReadToEnd());
                Guid sessionid = new Guid(POST["sid"]);
                lock (users)
                {
                    user = users[sessionid];
                    lock (user)
                    {
                        client = (SecondLife)user["SecondLife"];
                        user["LastRequest"] = DateTime.Now;
                        ((Events)user["Events"]).ClearInventory();
                    }
                }
                Hashtable replacements = new Hashtable();
                replacements.Add("STATIC_ROOT", AjaxLife.STATIC_ROOT);
                string param = "";
                param += "\t\t\tvar gRegionCoords = {x: " + Math.Floor(client.Self.GlobalPosition.X / 256) + ", y:" + Math.Floor(client.Self.GlobalPosition.Y / 256) + "};\n";
                param += "\t\t\tvar gRegion = " + AjaxLife.StringToJSON(client.Network.CurrentSim.Name) + ";\n";
                param += "\t\t\tvar gPosition = " + Newtonsoft.Json.JavaScriptConvert.SerializeObject(client.Self.SimPosition) + ";\n";
                param += "\t\t\tvar gMOTD = " + AjaxLife.StringToJSON(client.Network.LoginMessage) + ";\n";
                param += "\t\t\tvar gSessionID = " + AjaxLife.StringToJSON(sessionid.ToString("D")) + ";\n";
                param += "\t\t\tvar gUserName = " + AjaxLife.StringToJSON(client.Self.FirstName + " " + client.Self.LastName) + ";\n";
                param += "\t\t\tvar gLanguageCode = " + AjaxLife.StringToJSON(POST.ContainsKey("lang")?POST["lang"]:"en") + ";\n";
                param += "\t\t\tvar gAgentID = " + AjaxLife.StringToJSON(client.Self.AgentID.ToStringHyphenated()) + ";\n";
                param += "\t\t\tvar gInventoryRoot = " + AjaxLife.StringToJSON(client.Inventory.Store.RootFolder.UUID.ToStringHyphenated()) + ";\n";
                replacements.Add("INIT_PARAMS", param);
                Html.Template.Parser parser = new Html.Template.Parser(replacements);
                writer.Write(parser.Parse(File.ReadAllText("Html/Templates/UI.html")));
            }
            catch (Exception e)
            {
                writer.WriteLine("Error: " + e.Message);
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
