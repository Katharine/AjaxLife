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
 
AjaxLife.Parcel = function() {
	var lastpos = false;
	var sequenceid = 0;
	var localid = -1;
	var properties = {};
	var callbacks = [];
	
	function updateid(pos)
	{
		AjaxLife.Network.Send('GetParcelID', {
			X: pos.X,
			Y: pos.Y,
			Z: pos.Z,
			callback: function(data) {
				if(localid != data.LocalID)
				{
					localid = data.LocalID;
					fetchdata(localid);
				}
			}
		});
	}
	
	function fetchdata(localid)
	{
		AjaxLife.Network.Send('RequestParcelProperties', {
			LocalID: localid,
			SequenceID: ++sequenceid
		});
	}
	
	function callcallbacks()
	{
		callbacks.each(function(fn) {
			try
			{
				fn(properties);
			}
			catch(e)
			{
				//
			}
		});
	}
	
	return {
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('UsefulData', function(data) {
				if(data.YourPosition != lastpos)
				{
					lastpos = data.YourPosition;
					updateid(data.YourPosition);
				}
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('ParcelProperties', function(data) {
				if(data.SequenceID == sequenceid)
				{
					properties = data;
					callcallbacks();
				}
				else
				{
					AjaxLife.Debug("Parcel: Received out-of-order data for parcel ID#"+data.LocalID+". Got "+data.SequenceID+", expecting "+sequenceid);
				}
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('ParcelPropertiesFailed', function(data) {
				AjaxLife.Debug("Parcel: Update failed. SeqID#"+data.SequenceID+" LocalID#"+data.LocalID);
			});
		},
		GetParcelName: function() {
			return properties.Name ? properties.Name : '';
		},
		OnParcelChange: function(fn) {
			callbacks.push(fn);
			AjaxLife.Debug("Parcel: OnParcelChange callback registered.");
		}
	};
}();
