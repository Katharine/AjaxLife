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
using OpenMetaverse;

namespace AjaxLife.Html
{
    public class Index : IFile
    {
        // Fields
        private string contenttype = "text/html; charset=utf-8";
        #region IFile Members

        public Index(string name, IDirectory parent)
        {
            this.name = name;
            this.parent = parent;
        }

        private string name;
        private IDirectory parent;

        public string ContentType
        {
            get { return "text/html; charset=utf-8"; }
        }

        public void OnFileRequested(HttpRequest request, IDirectory directory)
        {
            request.Response.ResponseContent = new MemoryStream();
            StreamWriter writer = new StreamWriter(request.Response.ResponseContent);
            try{
                Hashtable hash = new Hashtable();
                // Set up the template with useful details and the challenge and public key.
                hash.Add("STATIC_ROOT", AjaxLife.STATIC_ROOT);
                if (AjaxLife.HANDLE_CONTENT_ENCODING)
                {
                    hash.Add("ENCODING", "identity");
                    // S3 doesn't support Accept-Encoding, so we do it ourselves.
                    if (request.Headers["Accept-Encoding"] != null)
                    {
                        string[] accept = request.Headers["Accept-Encoding"].Split(',');
                        foreach (string encoding in accept)
                        {
                            string parsedencoding = encoding.Split(';')[0].Trim();
                            if (parsedencoding == "gzip" || parsedencoding == "*") // Should we really honour "*"? Specs aside, it's never going to be true.
                            {
                                hash["ENCODING"] = "gzip";
                                break;
                            }
                        }
                    }
                }
                Html.Template.Parser parser = new Html.Template.Parser(hash);
                writer.Write(parser.Parse(File.ReadAllText("Html/Templates/index.html")));
            }catch(Exception exception){
                this.contenttype = "text/plain";
                writer.WriteLine("Error: " + exception.Message);
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
