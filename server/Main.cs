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
using System.Text.RegularExpressions;
using System.IO;
using libsecondlife;    
using MiniHttpd;
using Newtonsoft.Json;

namespace AjaxLife
{
    class AjaxLife
    {
        public const string STATIC_ROOT = "/ajaxlife/";
        public const double SESSION_TIMEOUT = 600; // Timeout in seconds.
        static void Main(string[] args)
        {
            new AjaxLife();
        }

        public Dictionary<Guid, Hashtable> Users;

        public AjaxLife()
        {
            Users = new Dictionary<Guid, Hashtable>();
            HttpWebServer webserver = new HttpWebServer(8080);
            VirtualDirectory root = new VirtualDirectory();
            webserver.Root = root;
            root.AddFile("index.html");
            #region Dynamic file setup
            root.AddFile(new Html.Login("login.kat", root, Users));
            root.AddFile(new Html.Connect("connect.kat", root, Users));
            root.AddFile(new Html.UI("main.kat", root, Users));
            root.AddFile(new Html.Logout("logout.kat", root, Users));
            root.AddFile(new Html.EventQueue("eventqueue.kat", root, Users));
            root.AddFile(new Html.SendMessage("sendmessage.kat", root, Users));
            root.AddDirectory(new TextureDirectory("textures", root, Users));
            #endregion
            webserver.Start();
            System.Timers.Timer timer = new System.Timers.Timer(5000);
            timer.AutoReset = true;
            timer.Elapsed += new System.Timers.ElapsedEventHandler(timecheck);
            // Starting this timer is very important - but it's broken, and probably fundamentally flawed.
            timer.Start();
            string reason = Console.ReadLine();
            timer.Stop();
            timer.Dispose();
            Console.WriteLine("Notifying clients...");
            foreach (KeyValuePair<Guid,Hashtable> entry in Users)
            {
                try
                {
                    Hashtable user = entry.Value;
                    if (user.ContainsKey("Events"))
                    {
                        Events handle = (Events)user["Events"];
                        handle.Network_OnDisconnected(NetworkManager.DisconnectType.ServerInitiated, "The AjaxLife server is shutting down: \n" + reason);
                    }
                }
                catch(Exception e)
                {
                    Console.WriteLine("Failed to transmit a logout notice: "+e.Message);
                }
            }
            Console.WriteLine("Waiting a bit...");
            System.Threading.Thread.Sleep(5000);
            Console.WriteLine("Disconnecting agents...");
            foreach (KeyValuePair<Guid,Hashtable> user in Users)
            {
                try
                {
                    SecondLife sl = (SecondLife)user.Value["SecondLife"];
                    if (sl.Network.Connected)
                    {
                        sl.Network.Logout();
                    }
                }
                catch
                {
                    Console.WriteLine("Failed to log out an agent.");
                }
            }
            webserver.Stop();
        }

        void timecheck(object sender, System.Timers.ElapsedEventArgs e)
        {
            lock (Users)
            {
                Queue<Guid> marked = new Queue<Guid>();
                try
                {
                    foreach (KeyValuePair<Guid,Hashtable> entry in Users)
                    {
                        Hashtable user = entry.Value;
                        Guid session = (Guid)entry.Key;
                        DateTime lastrequest = (DateTime)user["LastRequest"];
                        if (lastrequest.CompareTo(DateTime.Now.AddSeconds(-SESSION_TIMEOUT)) < 0)
                        {
                            marked.Enqueue(session);
                            Console.WriteLine("Marked session ID " + session.ToString("D") + " for deletion.");
                        }
                    }
                    lock (Users)
                    {
                        while (marked.Count > 0)
                        {
                            Guid todie = marked.Dequeue();
                            Hashtable user = (Hashtable)Users[todie];
                            SecondLife client = (SecondLife)user["SecondLife"];
                            if (client.Network.Connected)
                            {
                                if (user.ContainsKey("Events"))
                                {
                                    Events events = (Events)user["Events"];
                                    events.Network_OnDisconnected(NetworkManager.DisconnectType.ServerInitiated, "Your AjaxLife session has timed out.");
                                    Console.WriteLine("Transmitted logout alert to "+client.Self.FirstName+" "+client.Self.LastName+". Waiting...");
                                    System.Threading.Thread.Sleep(1000);
                                    events.deactivate();
                                }
                                Console.WriteLine("Disconnecting " + client.Self.FirstName + " " + client.Self.LastName + "...");
                                client.Network.Logout();
                                System.Threading.Thread.Sleep(2000);
                            }
                            Users.Remove(todie);
                            Console.WriteLine("Deleted " + todie);
                        }
                    }
                }
                catch(Exception exception)
                {
                    Console.WriteLine("Error processing timeouts: " + exception.Message);
                }
            }
        }

        public static Hashtable PostDecode(string qstring)
        {
            //simplify our task
            qstring = qstring + "&";

            Hashtable outc = new Hashtable();

            Regex r = new Regex(@"(?<name>[^=&]+)=(?<value>[^&]+)&", RegexOptions.IgnoreCase | RegexOptions.Compiled);

            IEnumerator _enum = r.Matches(qstring).GetEnumerator();
            while (_enum.MoveNext() && _enum.Current != null)
            {
                outc.Add(System.Web.HttpUtility.UrlDecode(((Match)_enum.Current).Result("${name}")),
                            System.Web.HttpUtility.UrlDecode(((Match)_enum.Current).Result("${value}")));
            }

            return outc;
        }

        public static string StringToJSON(string str)
        {
            str = str.Replace("\\", "\\\\");
            str = str.Replace("/", "\\/");
            str = str.Replace("\"", "\\\"");
            str = str.Replace("'", "\\'");
            str = str.Replace("\n", "\\n");
            return "\""+str+"\"";
        }
    }
}
