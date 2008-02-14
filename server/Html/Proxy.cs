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
using MiniHttpd;
using System.Net;
using System.IO;

namespace AjaxLife.Html
{
    class Proxy : IFile
    {
        private string ctype = "text/plain";
        private string name;
        private IDirectory parent;
        #region IFile Members

        public Proxy(string name, IDirectory parent)
        {
            this.name = name;
            this.parent = parent;
        }

        public string ContentType
        {
            get { return ctype; }
        }

        // Someone wants differentorigin.kat. This exists to bypass the Same Origin Policy.
        // It was going to be proxy.kat, but my school's filter blocks the word "proxy."
        public void OnFileRequested(MiniHttpd.HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter writer = new StreamWriter(request.Response.ResponseContent);
            // Work out the URL.
            string url = request.Query["url"];
            // Make a Sytem.Net.HttpWebRequest for the URL.
            HttpWebRequest webrequest = (HttpWebRequest)WebRequest.Create(url);
            // If we're meant to be posting it, take the request's postdata and forward it on,
            // with appropriate headers.
            if (request.Method.ToLower() == "post")
            {
                byte[] postdata = Encoding.GetEncoding("utf8").GetBytes((new StreamReader(request.PostData)).ReadToEnd());
                webrequest.ContentLength = postdata.Length;
                Stream poststream = webrequest.GetRequestStream();
                poststream.Write(postdata, 0, postdata.Length);
                poststream.Close();
            }
            // For stats/blocking/identification purposes.
            webrequest.UserAgent = "AjaxLife";
            // Get the response back
            HttpWebResponse response = (HttpWebResponse)webrequest.GetResponse();
            // Read the response's headers.
            StreamReader responsestream = new StreamReader(response.GetResponseStream());
            // Set the headers in our response, except for Transfer-Encoding (which would break things)
            foreach(string header in response.Headers)
            {
                if (header == "Transfer-Encoding") continue;
                request.Response.SetHeader(header, response.Headers[header]);
            }
            // Read the rest of the data
            string output = responsestream.ReadToEnd();
            ctype = response.ContentType;
            // Spit out the data again.
            writer.Write(output);
            // Close everything.
            writer.Flush();
            responsestream.Close();
            response.Close();
            // Voila. Proxy.
        }

        #endregion

        #region IResource Members

        public string Name
        {
            get { return name; }
        }

        public IDirectory Parent
        {
            get { return parent; }
        }

        #endregion

        #region IDisposable Members

        public void Dispose() {}

        #endregion
    }
}
