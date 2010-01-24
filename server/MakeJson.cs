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
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Collections;
using System.Text;
using System.IO;
using AjaxLife.Converters;

namespace AjaxLife
{
    class MakeJson
    {
        public static string FromObject(object obj)
        {
            StringWriter textWriter = new StringWriter();
            JsonWriter jsonWriter = new JsonWriter(textWriter);
            JsonSerializer serializer = new JsonSerializer();
            UUIDConverter UUID = new UUIDConverter();
            serializer.Converters.Add(UUID);
            serializer.Serialize(jsonWriter, obj);
            jsonWriter.Flush();
            string text = textWriter.ToString();
            jsonWriter.Close();
            textWriter.Dispose();
            return text;
        }

        public static string FromHashtable(Hashtable hash)
        {
            return FromObject(hash);
        }

        public static string FromHashtableQueue(Queue<Hashtable> queue)
        {
            StringWriter textWriter = new StringWriter();
            JsonWriter jsonWriter = new JsonWriter(textWriter);
            jsonWriter.WriteStartArray();
            JsonSerializer serializer = new JsonSerializer();
            UUIDConverter UUID = new UUIDConverter();
            serializer.Converters.Add(UUID);
            while (queue.Count > 0)
            {
                try
                {
                    Hashtable hashtable = queue.Dequeue();
                    serializer.Serialize(jsonWriter, hashtable);
                }
                catch(Exception e)
                {
                    AjaxLife.Debug("MakeJson.FromHashTable", e.Message);
                }
            }
            jsonWriter.WriteEndArray();
            jsonWriter.Flush();
            string text = textWriter.ToString();
            jsonWriter.Close();
            textWriter.Dispose();
            return text;
        }
    }
}
