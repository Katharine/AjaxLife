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
using MiniHttpd;
using OpenMetaverse;

namespace AjaxLife
{
    class TextureDirectory : IDirectory
    {
        private string name;
        private IDirectory parent;

        public TextureDirectory(string name, IDirectory parent)
        {
            this.name = name;
            this.parent = parent;
        }

        #region IDirectory Members

        public System.Collections.ICollection GetDirectories()
        {
            return new List<IDirectory>();
        }

        public IDirectory GetDirectory(string dir)
        {
            return null;
        }

        public IFile GetFile(string filename)
        {
            try
            {
                if (!filename.EndsWith(".png")) return null;
                UUID key = new UUID(filename.Substring(0, filename.Length - 4));
                if (System.IO.File.Exists(AjaxLife.TEXTURE_CACHE + key + ".png"))
                {
                    return new DriveFile(AjaxLife.TEXTURE_CACHE + key + ".png", this);
                }
                return null;
            }
            catch
            {
                // Should put an error messsage here.
                return null;
            }
        }

        public System.Collections.ICollection GetFiles()
        {
            return new List<IFile>();
        }

        public IResource GetResource(string name)
        {
            IFile file = GetFile(name);
            if (file == null)
            {
                return null;
            }
            else
            {
                return file;
            }
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

        public void Dispose()
        {
            // 
        }

        #endregion
    }
}
