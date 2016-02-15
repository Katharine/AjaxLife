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

AjaxLife.Stats = function() {
  // Private:
  var win = false;
  var fpsfield = false;
  var tdfield = false;
  var objectfield = false;
  var scriptfield = false;
  var agentfield = false;
  var childagentfield = false;
  var alsessionsfield = false;
  var pingsim = false;
  var bandwidth_in = false;
  var bandwidth_out = false;
  var timer = false;

  // Polls the stats data.
  //TODO: put this in the UsefulData message, but only when this window is open.
  function fetchdata()
  {
    AjaxLife.Network.Send('GetStats', {callback: update});
  }

  // Updates the information in the window using the provided data,
  // then requests another set in five seconds, if the window's still open.
  function update(data)
  {
    fpsfield.update(Math.round(data.FPS));
    tdfield.update(Math.round(data.TimeDilation*100)/100);
    objectfield.update(data.Objects);
    scriptfield.update(data.ActiveScripts);
    agentfield.update(data.Agents);
    childagentfield.update(data.ChildAgents);
    alsessionsfield.update(data.AjaxLifeSessions);
    droppedpackets.update(data.DroppedPackets);
    pingsim.update(data.PingSim + " ms");
    bandwidth_in.update(Math.round(data.IncomingBPS / 128) + " kbps");
    bandwidth_out.update(Math.round(data.OutgoingBPS / 128) + " kbps");
    if(win.isVisible())
    {
      timer = setTimeout(function() {
        fetchdata();
      },5000);
    }
  }
  return {
    // Public:
    init: function() {
      // Builds a window containing a table with stats in it.
      win = new Ext.BasicDialog("dlg_stats", {
        width: '250px',
        height: '280px',
        modal: false,
        shadow: true,
        autoCreate: true,
        title: _("Stats.WindowTitle"),
        proxyDrag: !AjaxLife.Fancy
      });
      // Create table
      var table = $(document.createElement('table'));
      win.body.dom.appendChild(table);
      // "Region" section title.
      var row = $(document.createElement('tr'));
      row.addClassName('titlerow');
      table.appendChild(row);
      var el = document.createElement('th');
      el.setAttribute('colspan',2);
      el.appendChild(document.createTextNode(_("Stats.Region")));
      row.appendChild(el);
      // Ping sim
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.PingSim")));
      row.appendChild(el);
      pingsim = $(document.createElement('td'));
      pingsim.appendChild(document.createTextNode('Loading...'));
      row.appendChild(pingsim);
      // FPS
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.FPS")));
      row.appendChild(el);
      fpsfield = $(document.createElement('td'));
      fpsfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(fpsfield);
      // Time Dilation
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.TD")));
      row.appendChild(el);
      tdfield = $(document.createElement('td'));
      tdfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(tdfield);
      // Objects
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.Objects")));
      row.appendChild(el);
      objectfield = $(document.createElement('td'));
      objectfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(objectfield);
      // Active Scripts
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.Scripts")));
      row.appendChild(el);
      scriptfield = $(document.createElement('td'));
      scriptfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(scriptfield);
      // Agents
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.Agents")));
      row.appendChild(el);
      agentfield = $(document.createElement('td'));
      agentfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(agentfield);
      // Child Agents
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.ChildAgents")));
      row.appendChild(el);
      childagentfield = $(document.createElement('td'));
      childagentfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(childagentfield);
      // Bandwidth in
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.BandwidthIn")));
      row.appendChild(el);
      bandwidth_in = $(document.createElement('td'));
      bandwidth_in.appendChild(document.createTextNode('Loading...'));
      row.appendChild(bandwidth_in);
      // Bandwidth out
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.BandwidthOut")));
      row.appendChild(el);
      bandwidth_out = $(document.createElement('td'));
      bandwidth_out.appendChild(document.createTextNode('Loading...'));
      row.appendChild(bandwidth_out);
      // Dropped packets
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.DroppedPackets")));
      row.appendChild(el);
      droppedpackets = $(document.createElement('td'));
      droppedpackets.appendChild(document.createTextNode('Loading...'));
      row.appendChild(droppedpackets);
      // "AjaxLife Server" section title
      row = $(document.createElement('tr'));
      row.addClassName('titlerow');
      table.appendChild(row);
      el = document.createElement('th');
      el.setAttribute('colspan',2);
      el.appendChild(document.createTextNode(_("Stats.ALServer")));
      row.appendChild(el);
      // Sessions
      row = $(document.createElement('tr'));
      table.appendChild(row);
      el = document.createElement('th');
      el.appendChild(document.createTextNode(_("Stats.Sessions")));
      row.appendChild(el);
      alsessionsfield = $(document.createElement('td'));
      alsessionsfield.appendChild(document.createTextNode('Loading...'));
      row.appendChild(alsessionsfield);
      win.on('show', function() {
        clearTimeout(timer);
        fetchdata();
      });

      fetchdata();
    },
    open: function(opener) {
      if(opener)
      {
        win.show(opener);
      }
      else
      {
        win.show();
      }
    },
    close: function() {
      win.hide();
    },
    toggle: function(opener) {
      if(!win.isVisible())
      {
        this.open(opener);
      }
      else
      {
        this.close();
      }
    }
  };
}();
