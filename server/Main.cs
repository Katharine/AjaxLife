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
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using OpenMetaverse;
using MiniHttpd;
using Newtonsoft.Json;
using System.Security.Cryptography;

namespace AjaxLife
{
    class AjaxLife
    {
        // All of these are publically available, but read-only. The class itself can set them
        // by setting the references variables.
        public static Dictionary<string, string> LOGIN_SERVERS { get { return LoginServers; } }
        public static string DEFAULT_LOGIN_SERVER { get { return DefaultLoginServer; } }
        public static string TEXTURE_BUCKET { get { return TextureBucket; } }
        public static string TEXTURE_ROOT { get { return TextureRoot; } }
        public static string TEXTURE_CACHE { get { return TextureCache; } }
        public static string STATIC_ROOT { get { return StaticRoot; } }
        public static string API_ROOT { get { return ApiRoot; } }
        public static string MAC_ADDRESS { get { return MacAddress; } }
        public static string ID0 { get { return Id0; } }
        public static string BAN_LIST { get { return BanList; } }
        public static double BAN_UPDATE_TIME { get { return BanUpdateTime; } }
        public static bool USE_S3 { get { return UseS3; } }
        public static bool HANDLE_CONTENT_ENCODING { get { return HandleContentEncoding; } }
        public static bool DEBUG_MODE { get { return DebugMode; } }

        // Constant - the number of seconds before the session times out and logs you off.
        // This handles people losing their internet connection or closing the window without
        // logging off.
        public const double SESSION_TIMEOUT = 600; // Timeout in seconds.

        // These are the private editable versions of the read-only properties above.
        private static string DefaultLoginServer = "";
        private static Dictionary<string, string> LoginServers;
        private static string StaticRoot = "http://static.ajaxlife.net/";
        private static string ApiRoot = "http://localhost:8080/api/";
        private static string TextureBucket = "";
        private static string TextureRoot = "";
        private static string AccessKey = "";
        private static string PrivateAccessKey = "";
        private static string TextureCache = "texturecache/";
        private static string MacAddress = "00:00:00:00:00:00";
        private static string BanList = "";
        private static double BanUpdateTime = 300.0;
        public static string Id0 = "";
        private static bool HandleContentEncoding = false;
        private static bool UseS3 = false;
        private static bool DebugMode = false;

        public static int TextureCacheCount = 0;
        public static long TextureCacheSize = 0;

        // These are used for the RSA encryption. RSAp holds the public and private keys,
        // RSA is the object responsible for decrypting. No encryption is done on the server.
        public static RSAParameters RSAp;
        public static RSACrypto RSA;

        // Marks whether we're meant to be running.
        public static bool Running = true;

        // Stores the S3 login information.
        public static Affirma.ThreeSharp.ThreeSharpConfig S3Config;

        // List of textures we know we have cached. This enables us to avoid looking it up on S3.
        // This is useful because looking things up on S3 costs money and is slightly slower.
        public static List<UUID> CachedTextures = new List<UUID>();

        // Dictionary of users, indexed by session ID.
        public Dictionary<Guid, User> Users;

        // Provides ban list functionality
        public static BanList BannedUsers;

        // Program start. Just launches the real program.
        static void Main(string[] args)
        {
            new AjaxLife(args);
        }

        public AjaxLife(string[] arg)
        {
            // Parse the command line arguments. See CommandLine.cs.
            CommandLineArgs args = new CommandLineArgs(arg);
            // Set various options if they're specified.
            string gridfile = "Grids.txt";
            if (args["gridfile"] != null)
            {
                gridfile = args["gridfile"];
            }
            // Read in the grids. Loop through the space-separated file, adding them to the dictionary.
            // Since there's no way of maintaining order, we also store the default separately.

            Console.WriteLine("Reading grids from " + gridfile);
            string[] grids = File.ReadAllLines(gridfile);
            LoginServers = new Dictionary<string, string>();
            bool defaulted = false;
            foreach (string grid in grids)
            {
                string[] split = new string[1];
                split[0] = " ";
                string[] griddata = grid.Trim().Split(split, 2, StringSplitOptions.RemoveEmptyEntries);
                LoginServers.Add(griddata[1], griddata[0]);
                if (!defaulted)
                {
                    DefaultLoginServer = griddata[1];
                    defaulted = true;
                }
                Console.WriteLine("Loaded grid " + griddata[1] + " (" + griddata[0] + ")");
            }
            Console.WriteLine("Default grid: " + DEFAULT_LOGIN_SERVER);

            // More fun option setting.
            if (args["root"] != null)
            {
                StaticRoot = args["root"];
            }
            if (!StaticRoot.EndsWith("/"))
            {
                StaticRoot += "/";
            }
            if (args["texturecache"] != null)
            {
                TextureCache = args["texturecache"];
            }
            // TextureCache must end with a forward slash. Make sure it does.
            if (!TextureCache.EndsWith("/"))
            {
                TextureCache += "/";
            }
            if (args["texturebucket"] != null)
            {
                TextureBucket = args["texturebucket"];
            }
            if (args["textureroot"] != null)
            {
                TextureRoot = args["textureroot"];
            }
            if (args["mac"] != null)
            {
                MacAddress = args["mac"];
            }
            Console.WriteLine("Using MAC address: " + MAC_ADDRESS);
            if (args["id0"] != null)
            {
                Id0 = args["id0"];
            }
            Console.WriteLine("Using id0: " + (ID0 == "" ? "[blank]" : ID0));
            if (args["banlist"] != null)
            {
                BanList = args["banlist"];
            }
            if (BanList != "")
            {
                Console.WriteLine("Using banlist at " + BanList);
                if (args["banupdate"] != null)
                {
                    BanUpdateTime = double.Parse(args["banupdate"]);
                }
                if (BanUpdateTime > 0.0)
                {
                    Console.WriteLine("Updating the banlist every " + BanUpdateTime + " seconds.");
                }
                else
                {
                    Console.WriteLine("Banlist updating disabled.");
                }
            }
            else
            {
                Console.WriteLine("Not using ban list.");
            }
            HandleContentEncoding = (args["doencoding"] != null);
            Console.WriteLine("Handling content encoding: " + (HANDLE_CONTENT_ENCODING ? "Yes" : "No"));
            if (args["spamdebug"] != null)
            {
                DebugMode = true;
                Settings.LOG_LEVEL = Helpers.LogLevel.Debug;
            }
            else if (args["debug"] != null)
            {
                DebugMode = true;
                Settings.LOG_LEVEL = Helpers.LogLevel.Info;
            }
            else
            {
                Settings.LOG_LEVEL = Helpers.LogLevel.Error;
            }
            Console.WriteLine("Debug mode: " + (DEBUG_MODE ? "On" : "Off"));
            // Create an empty dictionary for the users. This is defined as public further up.
            Users = new Dictionary<Guid, User>();

            // Make a web server!
            HttpWebServer webserver = new HttpWebServer((args["port"] != null) ? int.Parse(args["port"]) : 8080);

            bool startPrivate = true;

            try
            {
                // If the "private" CLI argument was specified, make it private by making us only
                // listen to the loopback address (127.0.0.0)
                if (startPrivate)
                {
                    webserver.LocalAddress = System.Net.IPAddress.Loopback;
                    Console.WriteLine("Using private mode.");
                }
            }
            catch
            {
                // If we can't make it private, oh well.
            }
            if (args["root"] == null)
            {
                StaticRoot = "http://" + webserver.LocalAddress + (webserver.Port != 80 ? (":" + webserver.Port) : "") + "/client/";
            }
            if (args["httpsapi"] != null)
            {
                ApiRoot = "https://" + args["httpsapi"];
            }
            Console.WriteLine("Static root: " + STATIC_ROOT);

            // Make sure we have a usable texture cache, create it if not.
            // If we're using S3, this is just used for conversions. If we're using
            // our own texture system, we store textures here for client use.
            Console.WriteLine("Checking texture cache...");
            if (!Directory.Exists(TEXTURE_CACHE))
            {
                Console.WriteLine("Not found; Attempting to create texture cache...");
                try
                {
                    Directory.CreateDirectory(TEXTURE_CACHE);
                    Console.WriteLine("Created texture cache.");
                }
                catch
                {
                    Console.WriteLine("Failed to create texture cache at " + TEXTURE_CACHE + "; aborting.");
                    return;
                }
            }

            Console.WriteLine("Initialising RSA service...");
            RSA = new RSACrypto();
            // Create a new RSA keypair with the specified length. 1024 if unspecified.
            RSA.InitCrypto((args["keylength"] == null) ? 1024 : int.Parse(args["keylength"]));
            RSAp = RSA.ExportParameters(true);
            Console.WriteLine("Generated " + ((args["keylength"] == null) ? 1024 : int.Parse(args["keylength"])) + "-bit key.");
            Console.WriteLine("RSA ready.");
            // Grab the S3 details off the command line if available.
            S3Config = new Affirma.ThreeSharp.ThreeSharpConfig();
            S3Config.AwsAccessKeyID = (args["s3key"] == null) ? AccessKey : args["s3key"];
            S3Config.AwsSecretAccessKey = (args["s3secret"] == null) ? PrivateAccessKey : args["s3secret"];
            // Check that, if we're using S3, we have enough information to do so.
            if (TextureBucket != "" && (S3Config.AwsAccessKeyID == "" || S3Config.AwsSecretAccessKey == "" || TextureRoot == ""))
            {
                Console.WriteLine("Error: To use S3 you must set s3key, s3secret, texturebucket and textureroot");
                return;
            }
            UseS3 = (TextureBucket != ""); // We're using S3 if TextureBucket is not blank.
            if (UseS3)
            {
                Console.WriteLine("Texture root: " + TEXTURE_ROOT);
                Console.WriteLine("Using Amazon S3 for textures:");
                Console.WriteLine("\tBucket: " + TEXTURE_BUCKET);
                Console.WriteLine("\tAccess key: " + S3Config.AwsAccessKeyID);
                Console.WriteLine("\tSecret: ".PadRight(S3Config.AwsSecretAccessKey.Length + 10, '*'));
            }
            else
            {
                TextureRoot = "textures/"; // Set the texture root to ourselves if not using S3.
                Console.WriteLine("Using internal server for textures:");
                Console.WriteLine("\tTexture root: " + TEXTURE_ROOT);
            }
            Console.WriteLine("Setting up pages...");
            // Set up the root.
            VirtualDirectory root = new VirtualDirectory();
            webserver.Root = root;
            #region Dynamic file setup
            // Create the virtual files, passing most of them (except index.html and differentorigin.kat,
            // as they don't need to deal with SL) the Users dictionary. Users is a reference object,
            // so changes are reflected in all the pages. The same goes for individual User objects.
            root.AddFile(new Html.MainPage("index.html", root, Users));
            root.AddFile(new Html.Proxy("differentorigin.kat", root));
            root.AddFile(new Html.BasicStats("ping.kat", root, Users));
            root.AddFile(new Html.MakeFile("makefile.kat", root));
            root.AddFile(new Html.iPhone("iphone.kat", root));
            root.AddFile("robots.txt");
            // textures/ is only used if we aren't using S3 for textures.
            if (!UseS3)
            {
                root.AddDirectory(new DriveDirectory("textures", AjaxLife.TEXTURE_CACHE, root));
            }
            root.AddDirectory(new DriveDirectory("client", "client/www-root", root));
            // API stuff.
            VirtualDirectory api = new VirtualDirectory("api", root);
            root.AddDirectory(api);
            api.AddFile(new Html.CreateSession("newsession", api, Users));
            api.AddFile(new Html.SendMessage("send", api, Users));
            api.AddFile(new Html.EventQueue("events", api, Users));
            api.AddFile(new Html.Logout("logout", api, Users));
            api.AddFile(new Html.Connect("login", api, Users));
            api.AddFile(new Html.LoginDetails("sessiondetails", api, Users));
            #endregion
            Console.WriteLine("Loading banlist...");
            BannedUsers = new BanList(); // Create BanList.

            Console.WriteLine("Starting server...");
            // Start the webserver.
            webserver.Start();
            // Set a timer to call timecheck() every five seconds to check for timed out sessions.
            System.Timers.Timer timer = new System.Timers.Timer(5000);
            timer.AutoReset = true;
            timer.Elapsed += new System.Timers.ElapsedEventHandler(timecheck);
            timer.Start();
            // Sleep forever. Note that this means nothing after this line ever gets executed.
            // We do this because no more processing takes place in this thread.
            System.Threading.Thread.Sleep(System.Threading.Timeout.Infinite);
            // We never get past this point, so all code past here has been deleted for now.
        }

        // Loop through each user and mark them for deletion if they haven't made a request
        // for SESSION_TIMEOUT seconds. Then log them out, sending a nice message in case they
        // come back. Note that this will only be fired if the remote computer is disconnected.
        void timecheck(object sender, System.Timers.ElapsedEventArgs e)
        {
            lock (Users)
            {
                Queue<Guid> marked = new Queue<Guid>();
                try
                {
                    foreach (KeyValuePair<Guid, User> entry in Users)
                    {
                        User user = entry.Value;
                        Guid session = (Guid)entry.Key;
                        DateTime lastrequest = user.LastRequest;
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
                            User user = Users[todie];
                            if (user.Client != null && user.Client.Network.Connected)
                            {
                                if (user.Events != null)
                                {
                                    user.Events.Network_Disconnected(this, new DisconnectedEventArgs(NetworkManager.DisconnectType.ServerInitiated, "Your AjaxLife session has timed out."));
                                    Console.WriteLine("Transmitted logout alert to " + user.Client.Self.FirstName + " " + user.Client.Self.LastName + ". Waiting...");
                                    System.Threading.Thread.Sleep(1000);
                                    user.Events.deactivate();
                                }
                                Console.WriteLine("Disconnecting " + user.Client.Self.FirstName + " " + user.Client.Self.LastName + "...");
                                user.Client.Network.Logout();
                                System.Threading.Thread.Sleep(2000);
                            }
                            Users.Remove(todie);
                            Console.WriteLine("Deleted " + todie);
                        }
                    }
                }
                catch (Exception exception)
                {
                    Console.WriteLine("Error processing timeouts: " + exception.Message);
                }
            }
        }

        public static Dictionary<string, string> PostDecode(string qstring)
        {
            // Make a nice dictionary of data from a standard postdata input.
            qstring = qstring + "&";

            Dictionary<string, string> outc = new Dictionary<string, string>();
            // The splitter.
            Regex r = new Regex(@"(?<name>[^=&]+)=(?<value>[^&]*)&", RegexOptions.IgnoreCase | RegexOptions.Compiled);

            IEnumerator _enum = r.Matches(qstring).GetEnumerator();
            while (_enum.MoveNext() && _enum.Current != null)
            {   // Decode the URLencoding, and add it to the dictionary.
                outc.Add(System.Web.HttpUtility.UrlDecode(((Match)_enum.Current).Result("${name}")),
                            System.Web.HttpUtility.UrlDecode(((Match)_enum.Current).Result("${value}")));
            }

            return outc;
        }

        // Basic JSON escaping, to save on loading the whole JSON encoder.
        // This is actually rarely used in actual JSON, but instead in JavaScript.
        public static string StringToJSON(string str)
        {
            str = str.Replace("\\", "\\\\");
            str = str.Replace("/", "\\/");
            str = str.Replace("\"", "\\\"");
            str = str.Replace("'", "\\'");
            str = str.Replace("\n", "\\n");
            return "\"" + str + "\"";
        }

        public static void Debug(string module, string message)
        {
            if (AjaxLife.DEBUG_MODE)
            {
                Console.WriteLine("DEBUG [" + module + "]: " + message);
            }
        }
    }
}
