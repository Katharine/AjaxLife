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

AjaxLife.MiniMap = function() {
	var height = 256;
	var width = 256;
	var canvas;
	var context;
	var buffer;
	var bufferc;
	var marks = {};
	var pos = {sim: '', x: 0, y: 0, z: 0};
	var target = false;
	var scale = 1.0;
	var selfimg = new Image();
	var imgloaded = false;
	var water = 20;
	var active = true;
	
	// Here's a nice set of colours. Largely gathered by trial and error, and not great.
	// Some of them are altered later.
	var heights = {};
	heights[0] = {red: 0, green: 0, blue: 128};
	heights[water*0.75] = {red: 0, green: 0, blue: 255};
	heights[water] = {red: 0, green: 128, blue: 255};
	heights[water+1] = {red: 240, green: 240, blue: 64};
	heights[24] = {red: 32, green: 160, blue: 0};
	heights[100] = {red: 128, green: 127, blue: 128};
	heights[120] = {red: 255, green: 255, blue: 255};
	var available = [0,water*0.75,water,water+1,24,100,120];
	var count = available.length;
	
	var heightcache = [];
	// Sets up the redraw delay - used to ensure we don't waste time redrawing excessively.
	var redrawdelay = new Ext.util.DelayedTask(redraw);
	
	// This turns our 64x64 grid of heights into a 256x256 grid of heights,
	// smoothly interpolating this missing values.
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
	
	// This draws the landscape on the visible canvas.
	function drawLandscape()
	{
		// Copy the image from the buffer.
		context.drawImage(buffer,0,0,256,256);
	}
	
	// This is used draw a 16x16m patch of land data to a specified position in the buffer.
	// We also rotate it 90 degrees to compensate for receiving the data the wrong way up.
	function drawPatch(c, x, y, patch)
	{
		c.save();
		c.translate(x,255-(y+16));
		c.translate(8,8);
		c.rotate(Math.PI/2);
		c.translate(-8,-8);
		var i = 0;
		var j = 0;
		// Once we're drawing in the right place, we draw the 256 pixels by interpolating the
		// required colours.
		// We're actually drawing 2x2 blocks of same-coloured pixels, as the difference is 
		// insignificant, and it takes a quarter of the time to render.
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
		// We don't support object data. If we ever do, this function should be used
		// to render them.
	}
	
	// This draws the position of others in the sim.
	// They're drawn as circles if they're within five metres of us, otherwise
	// pointing in the right direction.
	function drawMark(mark,r,g,b)
	{
		// If no colour is specified, assume green.
		if(!b && b !== 0)
		{
			// Green.
			context.strokeStyle = "rgb(0,255,0)";
			context.fillStyle = "rgb(0,255,0)";
		}
		else
		{
			context.strokeStyle = "rgb("+r+","+g+","+b+")";
			context.fillStyle = "rgb("+r+","+g+","+b+")";
		}
		// Difference between our height and the other person's height.
		var diff = mark.Z - pos.z;
		// Don't draw a green mark for ourselves.
		if(Math.round(pos.x) == mark.X && Math.round(pos.y) == mark.Y) return;
		if(!mark.Z) return;
		// Everything is divided by scale to compensate for any resizing that has taken place.
		// Draw the down-pointing version for more than 2.5m below us.
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
		// Up-pointing for more than 2.5m above us.
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
		// If they're within five metres, we draw a circle.
		else
		{
			context.beginPath();
			context.arc(mark.X-1.5,255-(mark.Y-1.5),3/scale,0,Math.PI*2,true);
			context.fill();
			context.stroke();
		}
	}
	
	// Draw ourselves on the map.
	function drawSelf()
	{
		if(!imgloaded) return;
		context.drawImage(selfimg, pos.x, 256-pos.y, 8/scale,8/scale);
	}
	
	// Draw our target, if any, on the map.
	function drawTarget()
	{
		if(target && target.sim == pos.sim)
		{
			drawMark({X: target.x, Y: target.y, Z: target.z}, 255, 0, 0);
		}
	}
	
	// Wipe the canvas and draw the whole map on it.
	function redraw()
	{
		context.clearRect(0,0,width,height);
		drawLandscape();
		drawObjects();
		for(var i in marks)
		{
			drawMark(marks[i]);
		}
		drawTarget();
		drawSelf();
	}
	
	// Wipe the buffer and fill it with water.
	function emptyland()
	{
		bufferc.fillStyle = 'rgb(0,0,128)';
		bufferc.fillRect(0,0,256,256);
		return [];
	}
	
	// Adds a patch of land to the buffer, and sets the redraw to
	// happen in 0.5 seconds' time. The buffer is cleared if we're
	// in another sim now.
	function addpatch(region, ox, oy, patch)
	{
		if(region != pos.sim) // Changed sim.
		{
			pos.sim = region;
			emptyland();
		}
		drawPatch(bufferc,ox,oy,patch);
		redrawdelay.delay(500);
	}
	
	return {
		// Draws a mark on the map. If it's a new mark, we just add it,
		// otherwise it has to be added and then the map redrawn.
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
		// Scales and redraws the map.
		Resize: function(size) {
			if(!active) return;
			canvas.style.width = size+'px';
			canvas.style.height = size+'px';
			scale = size/256;
			redraw();
		},
		// Changes our position on the map and redraws it.
		// If we're in a different sim, wipes the buffer.
		SetPos: function(position) {
			if(!active) return;
			if(position.sim != pos.sim)
			{
				emptyland();
			}
			pos = position;
			redraw();
		},
		// Draw a new set of marks, after wiping the old one.
		// Forces a redraw.
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
			// Set up the canvas.
			canvas = $(canvasid);
			// Bail out if we can't do them. I'm looking at you, Microsoft.
			// We can't use an emulation layer for IE here for performance reasons - 
			// IE only supports vector images, whilst we're performing heavy operations
			// with pixels. The DOM formed would be horrible.
			if(!canvas.getContext || !canvas.getContext('2d')) // No canvas support.
			{
				active = false;
				AjaxLife.Network.MessageQueue.RegisterCallback('LandPatch',Prototype.emptyFunction); // Suppress "Unhandled message" notices.
				return;
			}
			// Set everything up nicely.
			context = canvas.getContext('2d');
			buffer = $(bufferid);
			bufferc = buffer.getContext('2d');
			// Set the picture of ourselves to appear once loaded.
			selfimg.onload = function() {
				imgloaded = true;
				drawSelf();
			};
			selfimg.src = AjaxLife.STATIC_ROOT+'images/map_marker_you.png';
			pos = {sim: gRegion, x: gPosition.X, y: gPosition.Y, z: gPosition.Z};
			// Setup callback
			// This will be called when we have land data. If the water level has changed,
			// the water-related colour heights are recalculated and the heightcache purged.
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
					available = [0,water*0.75,water,water+1,24,100,120];
					heightcache = []; // We could probably do a more selective clean on this.
				}
				var land = [];
				var ldata = data.Patch;
				for(var i in ldata)
				{
					land[land.length] = ldata[i];
				}
				addpatch(data.Region, data.OffsetX, data.OffsetY, land);
			});
			// Update our position on the map whenever we receiving our position.
			AjaxLife.Network.MessageQueue.RegisterCallback('UsefulData', function(data) {
				AjaxLife.MiniMap.PersonUpdate(data.Positions);
			});
			AjaxLife.Map.OnMarkChanged(function(newmark) {
				target = newmark;
				redraw();
			});
			emptyland();
			// Use a size of 150x150 by default.
			this.Resize(150);	
		}
	};
}();
