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

AjaxLife.MiniMap = function() {
	var height = 256;
	var width = 256;
	var canvas;
	var context;
	var buffer;
	var bufferc;
	var marks = {};
	var pos = {sim: '', x: 0, y: 0, z: 0};
	var scale = 1.0;
	var selfimg = new Image();
	var imgloaded = false;
	var water = 20;
	var active = true;
	
	var heights = {};
	heights[0] = {red: 0, green: 0, blue: 128};
	heights[water*0.75] = {red: 0, green: 0, blue: 255};
	heights[water] = {red: 0, green: 128, blue: 255};
	heights[water+1] = {red: 240, green: 240, blue: 64};
	heights[24] = {red: 32, green: 160, blue: 0};
	//heights[70] = {red: 244, green: 244, blue: 0};
	heights[100] = {red: 128, green: 127, blue: 128};
	heights[120] = {red: 255, green: 255, blue: 255};
	var available = [0,water*0.75,water,water+1,24/*,70*/,100,120];
	var count = available.length;
	
	var heightcache = [];
	var redrawdelay = new Ext.util.DelayedTask(redraw);

	function interpolate(heights)
	{
		var newheight = [];
		for(var i = 0; i < 64; ++i)
		{
			newheight[i*4] = [];
			for(var j = 0; j < 64; ++j)
			{
				var height = heights[i][j];
				newheight[i*4][j*4] = height;
				var next = heights[i][j+1];
				if(next === null || next === undefined)
				{
					next = height;
				}
				var step = (next-height)/4;
				newheight[i*4][j*4+1] = height+step;
				newheight[i*4][j*4+2] = height+step*2;
				newheight[i*4][j*4+3] = height+step*3;
			}
		}
		for(var i = 0; i < 64; ++i)
		{
			newheight[i*4+1] = [];
			newheight[i*4+2] = [];
			newheight[i*4+3] = [];
			for(var j = 0; j < 256; ++j)
			{
				var height = newheight[i*4][j];
				var next = 0;
				if(!newheight[(i+1)*4])
				{
					next = height;
				}
				else
				{
					next = newheight[(i+1)*4][j];
				}
				var step = (next-height)/4;
				newheight[i*4+1][j] = height+step;
				newheight[i*4+2][j] = height+step*2;
				newheight[i*4+3][j] = height+step*3;
			}
		}
		return newheight;
	}
	
	function drawLandscape()
	{
		// Copy the image from the buffer.
		context.drawImage(buffer,0,0,256,256);
	}
	
	function drawPatch(c, x, y, patch)
	{
		c.save();
		c.translate(x,255-y);
		c.translate(8,8);
		c.rotate(Math.PI/2);
		c.translate(-8,-8);
		var i = 0;
		var j = 0;
		for(var i = 0; i < 16; i += 2)
		{
			for(var j = 0; j < 16; j += 2)
			{
				var height = patch[15-i][15-j];
				if(!heightcache[height])
				{
					var pick = 0;
					// Find the colour closest to, but not greater than, our own.
					for(var k = 0; k < count; ++k)
					{
						if(!heights[available[k]]) continue;
						if(available[k] > height)
						{
							break;
						}
						pick = k;
					}
					var colour = {};
					var next;
					var last;
					if(heights[height] || pick == count - 1)
					{
						colour = heights[available[pick]];
					}
					else
					{
						last = heights[available[pick]];
						next = heights[available[pick+1]];
						if(!last || !next) continue; // We should never encounter this one...
						var x = (available[pick+1]-available[pick]);
						var y = (height - available[pick]);
						var colour = {
							red: last.red+(next.red-last.red)/x*y,
							green: last.green+(next.green-last.green)/x*y,
							blue: last.blue+(next.blue-last.blue)/x*y
						};
					}
					heightcache[height] = "rgb("+Math.round(colour.red)+", "+Math.round(colour.green)+", "+Math.round(colour.blue)+")";
				}
				c.fillStyle = heightcache[height];
				c.fillRect(i,j,2,2);
			}
		}
		c.restore();
	}
	
	function drawObjects()
	{
		// Do something here.
	}
	
	function drawMark(mark)
	{
		context.strokeStyle = "rgb(0,255,0)";
		context.fillStyle = "rgb(0,255,0)";
		var diff = mark.Z - pos.z;
		if(Math.round(pos.x) == mark.X && Math.round(pos.y) == mark.Y && Math.round(pos.z) == mark.Z) return;
		if(!mark.Z) return;
		if(diff < -2.5)
		{
			context.save();
			context.translate(mark.X,255-mark.Y);
			context.beginPath();
			context.moveTo(+0.5 / /* / */ scale, -3.5/scale);
			context.lineTo(+0.5 / /* / */ scale, +2.5/scale);
			context.moveTo(-2.5 / /* / */ scale, +2.5/scale);
			context.lineTo(+3.5 / /* / */ scale, +2.5/scale);
			context.stroke();
			context.restore();
		}
		else if(diff > 2.5)
		{
			context.save();
			context.translate(mark.X,255-mark.Y);
			context.beginPath();
			context.moveTo(+0.5 / /* / */ scale, -3.5/scale);
			context.lineTo(+0.5 / /* / */ scale, +2.5/scale);
			context.moveTo(-2.5 / /* / */ scale, -3.5/scale);
			context.lineTo(+3.5 / /* / */ scale, -3.5/scale);
			context.stroke();
			context.restore();
		}
		else
		{
			context.beginPath();
			context.arc(mark.X-1.5,255-(mark.Y-1.5),3/scale,0,Math.PI*2,true);
			context.fill();
			context.stroke();
		}
	}
	
	function drawSelf()
	{
		if(!imgloaded) return;
		context.drawImage(selfimg, pos.x, 256-pos.y, 8/scale,8/scale);
	}
	
	function redraw()
	{
		//console.log("Redrawing...");
		context.clearRect(0,0,width,height);
		drawLandscape();
		drawObjects();
		for(var i in marks)
		{
			drawMark(marks[i]);
		}
		drawSelf();
	}
	
	function emptyland()
	{
		bufferc.fillStyle = 'rgb(0,0,128)';
		bufferc.fillRect(0,0,256,256);
		return [];
	}
	
	function addpatch(region, ox, oy, patch)
	{
		////console.log(pos);
		if(region != pos.sim) // Changed sim.
		{
			pos.sim = region;
			////console.log("Changed sim. Clearing...");
			emptyland();
		}
		drawPatch(bufferc,ox,oy,patch);
		redrawdelay.delay(500);
		//console.log("Waiting 0.5 seconds before redrawing...");
		//redraw();
	}
	
	return {
		Mark: function(id, pos, wait) {
			if(!active) return;
			var draw = !!marks[id];
			marks[id] = pos;
			if(draw)
			{
				if(!wait) redraw();
				return false;
			}
			else
			{
				drawMark(pos);
				return true;
			}
		},
		Resize: function(size) {
			if(!active) return;
			canvas.style.width = size+'px';
			canvas.style.height = size+'px';
			scale = size/256;
			redraw();
		},
		SetPos: function(position) {
			if(!active) return;
			if(position.sim != pos.sim)
			{
				emptyland();
			}
			pos = position;
			redraw();
		},
		PersonUpdate: function(people) {
			if(!active) return;
			marks = {};
			for(var i in people)
			{
				this.Mark(i,people[i], true);
			}
			redraw();
		},
		init: function(canvasid, bufferid) {	
			canvas = $(canvasid);
			if(!canvas.getContext || !canvas.getContext('2d')) // No canvas support.
			{
				active = false;
				return;
			}
			context = canvas.getContext('2d');
			buffer = $(bufferid);
			bufferc = buffer.getContext('2d');
			selfimg.onload = function() {
				imgloaded = true;
				drawSelf();
			};
			selfimg.src = AjaxLife.STATIC_ROOT+'/images/map_marker_you.png';
			pos = {sim: gRegion, x: gPosition.X, y: gPosition.Y, z: gPosition.Z};
			// Setup callback
			AjaxLife.Network.MessageQueue.RegisterCallback('LandPatch', function(data) {
				if(water != data.WaterLevel)
				{
					heights[water] = false;
					heights[water*0.75] = false;
					heights[water+1] = false;
					water = data.WaterLevel;
					heights[water*0.75] = {red: 0, green: 0, blue: 255};
					heights[water] = {red: 0, green: 128, blue: 255};
					heights[water+1] = {red: 240, green: 240, blue: 64};
					available = [0,water*0.75,water,water+1,24/*,70*/,100,120];
					heightcache = []; // We could probably do a more selective clean on this.
				}
				var land = [];
				var ldata = data.Patch;
				for(var i in ldata)
				{
					land[land.length] = ldata[i];
				}
				////console.log("Reconstructed patch.");
				addpatch(data.Region, data.OffsetX, data.OffsetY, land);
				////console.log("Completed addpatch.");
			});
			AjaxLife.Network.MessageQueue.RegisterCallback('UsefulData', function(data) {
				AjaxLife.MiniMap.PersonUpdate(data.Positions);
			});
			emptyland();
			this.Resize(150);	
		}
	};
}();