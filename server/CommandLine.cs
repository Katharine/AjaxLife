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
using System.Collections.Specialized;
using System.Text.RegularExpressions;

namespace AjaxLife
{
    public class CommandLineArgs
    {
        private StringDictionary Params;

        public CommandLineArgs(string[] args)
        {
            Params = new StringDictionary();
            Regex split = new Regex(@"^-{1,2}|^/|=", RegexOptions.IgnoreCase | RegexOptions.Compiled);
            Regex remove = new Regex(@"^['""]?(.*?)['""]?$", RegexOptions.IgnoreCase | RegexOptions.Compiled);

            string parameter = null;
            string[] parts;

            foreach (string text in args)
            {
                parts = split.Split(text, 3);

                switch (parts.Length)
                {
                    case 1:
                        if (parameter != null)
                        {
                            if (!Params.ContainsKey(parameter))
                            {
                                parts[0] = remove.Replace(parts[0], "$1");

                                Params.Add(parameter, parts[0]);
                            }
                            parameter = null;
                        }
                        break;
                    case 2:
                        if (parameter != null)
                        {
                            if (!Params.ContainsKey(parameter))
                            {
                                Params.Add(parameter, "true");
                            }
                        }
                        parameter = parts[1];
                        break;
                    case 3:
                        if (parameter != null)
                        {
                            if (!Params.ContainsKey(parameter))
                            {
                                Params.Add(parameter, "true");
                            }
                        }
                        parameter = parts[1];
                        if (!Params.ContainsKey(parameter))
                        {
                            parts[2] = remove.Replace(parts[2], "$1");
                            Params.Add(parameter, parts[2]);
                        }

                        parameter = null;
                        break;
                }
            }
            if (parameter != null)
            {
                if (!Params.ContainsKey(parameter))
                {
                    Params.Add(parameter, "true");
                }
            }
        }

        public string this[string Param]
        {
            get
            {
                return (Params[Param]);
            }
        }
    }
}