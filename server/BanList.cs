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
using System.Net;
using System.IO;
using System.Timers;

namespace AjaxLife
{
    public class BanList
    {
        private string[] Bans = {};
        private Timer Time;
        private void UpdateList()
        {
            AjaxLife.Debug("BanList", "Loading ban list from "+AjaxLife.BAN_LIST+"...");
            try
            {
                string sbanlist = "";
                if (AjaxLife.BAN_LIST.StartsWith("http://"))
                {
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(AjaxLife.BAN_LIST);
                    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    StreamReader reader = new System.IO.StreamReader(response.GetResponseStream());
                    sbanlist = reader.ReadToEnd();
                    reader.Close();
                    response.Close();
                }
                else
                {
                    sbanlist = File.ReadAllText(AjaxLife.BAN_LIST);
                }
                char[] newline = {'\n'};
                this.Bans = sbanlist.Split(newline);
                for(int i = 0; i < this.Bans.Length; ++i)
                {
                    this.Bans[i] = this.Bans[i].Trim();
                }
                AjaxLife.Debug("BanList", "Ban list up to date. "+Bans.Length+" banned names.");
            }
            catch(Exception e)
            {
                AjaxLife.Debug("BanList", "Ban list update failed: "+e.Message);
            }
        }
        
        public BanList()
        {
            if(AjaxLife.BAN_LIST != "")
            {
                if(AjaxLife.BAN_UPDATE_TIME > 0)
                {
                    Time = new Timer();
                    Time.Interval = AjaxLife.BAN_UPDATE_TIME * 1000.0;
                    Time.AutoReset = true;
                    Time.Elapsed += new ElapsedEventHandler(TimerElapsed);
                    Time.Start();
                    AjaxLife.Debug("BanList", "Set ban update timer for "+AjaxLife.BAN_UPDATE_TIME+" seconds.");
                }
                else
                {
                    AjaxLife.Debug("BanList", "Ban update timer disabled.");
                }
                UpdateList();
            }
        }
        
        ~BanList()
        {
            Time.Stop();
            Time.Close();
        }
        
        public void TimerElapsed(object obj, ElapsedEventArgs args)
        {
            AjaxLife.Debug("BanList", "Timer elapsed.");
            UpdateList();
        }
        
        public bool IsBanned(string first, string last)
        {
            return IsBanned(first+" "+last);
        }
        
        public bool IsBanned(string name)
        {
            return (Array.IndexOf(this.Bans, name) > -1);
        }
    }
}










