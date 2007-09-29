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

AjaxLife.Utils.UUID = function() {
	return {
		Random: function() {
			var valid = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
			var ret = '';
			for(var i = 0; i < 32; ++i)
			{
				ret += valid[Math.floor(Math.random()*valid.length)];
				if(i == 7 || i == 11 || i == 15 || i == 19)
				{
					ret += '-';
				}	
			}
			return ret;
		},
		Combine: function(uuid1, uuid2) {
			var uuid = '';
			for(var i = 0; i < 36; ++i)
			{
				if(i%2)
				{
					uuid += uuid1.substr(i,1);
				}
				else
				{
					uuid += uuid2.substr(i,1);
				}
			}
			return uuid;
		},
		Zero: '00000000-0000-0000-0000-000000000000'
	};
}();

AjaxLife.Utils.FixText = function(text) {
	return text.escapeHTML().gsub('  ',' &nbsp;').gsub('\n','<br />');
};

AjaxLife.Utils.Clone = function(myObj) {
	if(typeof(myObj) != 'object') return myObj;
	if(myObj == null) return myObj;

	var myNewObj = new Object();

	for(var i in myObj)
		myNewObj[i] = clone(myObj[i]);

	return myNewObj;
}

AjaxLife.Utils.FormatNumber = function(number) {
	number = '' + number;
	var comma = _("Number.Separator");
	if (number.length > 3)
	{
		var mod = number.length % 3;
		var output = (mod > 0 ? (number.substring(0,mod)) : '');
		for (i=0 ; i < Math.floor(number.length / 3); i++)
		{
			if ((mod == 0) && (i == 0))
				output += number.substring(mod+ 3 * i, mod + 3 * i + 3);
			else
				output+= comma + number.substring(mod + 3 * i, mod + 3 * i + 3);
		}
		return (output);
	}
	else return number;
}