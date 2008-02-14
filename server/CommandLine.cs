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
            // E.g. "--port=80" becomes ["port","80"]
            Regex split = new Regex(@"^-{1,2}|^/|=", RegexOptions.Compiled);
            // Removes quotes around things. Yes, this is a hack, but .NET handles this for us anyway.
            // '"some' would become 'some' (omitting single quotes)
            Regex remove = new Regex("^['\"]?(.*?)['\"]?$", RegexOptions.Compiled);

            string parameter = null;
            string[] parts;

            // For each word provided, split it according to the split regex - that is.
            // at "-", "--" or "/" at the start of a line, and "=" in the middle.
            // Note that we leave the blanks in - so "--port=80" becomes ["","port","80"],
            // "--port' becomes ["", "port"] and "80" becomes ["80"].
            // This is used to work out what to do with the parts.
            foreach (string text in args)
            {
                parts = split.Split(text, 3);

                switch (parts.Length)
                {
                    case 1:
                        // If we only have one thing, we aren't starting a new command.
                        // If we were already building something, take this to be the argument
                        // and add it. Otherwise ignore the random string.
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
                        // If we're already building a paramater, and we only have two parts, 
                        // we appear to be adding a new paramater. Add the previous one with a
                        // value of "true" and start building a new one.
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
                        // If we have three parts, and we're already building a paramater, 
                        // set the paramater previous being built to "true" and add it to
                        // the collection.
                        if (parameter != null)
                        {
                            if (!Params.ContainsKey(parameter))
                            {
                                Params.Add(parameter, "true");
                            }
                        }
                        // Add FirstPart => SecondPart, if FirstPart doesn't already exist.
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