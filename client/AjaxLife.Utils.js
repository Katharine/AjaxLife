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
		// Generates a random UUID by picking 32 entries from this list.
		// Inserts dashes in the appropriate places.
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
		// Merges two UUIDs such that you always get the same output when given the same input.
		// This function essentially implements binary XOR on 32 character hex strings.
		Combine: function(uuid1, uuid2) {
			var binary = {
				'0': '0000',
				'1': '0001',
				'2': '0010',
				'3': '0011',
				'4': '0100',
				'5': '0101',
				'6': '0110',
				'7': '0111',
				'8': '1000',
				'9': '1001',
				'a': '1010',
				'b': '1011',
				'c': '1100',
				'd': '1101',
				'e': '1110',
				'f': '1111'
			};
			var hex = {
				'0000': '0',
				'0001': '1',
				'0010': '2',
				'0011': '3',
				'0100': '4',
				'0101': '5',
				'0110': '6',
				'0111': '7',
				'1000': '8',
				'1001': '9',
				'1010': 'a',
				'1011': 'b',
				'1100': 'c',
				'1101': 'd',
				'1110': 'e',
				'1111': 'f'
			};
			uuid1 = uuid1.gsub('-','');
			uuid2 = uuid2.gsub('-','');
			var bin1 = '';
			var bin2 = '';
			for(var i = 0; i < 32; ++i)
			{
				bin1 += binary[uuid1.charAt(i)];
				bin2 += binary[uuid2.charAt(i)];
			}
			var mergedbin = '';
			for(var i = 0; i < 128; ++i)
			{
				if(bin1.charAt(i) == '1' || bin2.charAt(i) == '1')
				{
					if(bin1.charAt(i) == '1' && bin2.charAt(i) == '1')
					{
						mergedbin += '0';
					}
					else
					{
						mergedbin += '1';
					}
				}
				else
				{
					mergedbin += '0';
				}
			}
			var mergeduuid = '';
			for(var i = 0; i < 128; i += 4)
			{
				mergeduuid += hex[mergedbin.substr(i,4)];
			}
			mergeduuid = mergeduuid.substr(0,8) + "-" + mergeduuid.substr(8,4) + "-" + mergeduuid.substr(12,4) + "-" + mergeduuid.substr(16,4) + "-" + mergeduuid.substr(20,12);
			return mergeduuid;
		},
		// NULL_KEY
		Zero: '00000000-0000-0000-0000-000000000000'
	};
}();

// Makes plaintext suitable for HTML use.
AjaxLife.Utils.FixText = function(text) {
	return text.escapeHTML().gsub('  ',' &nbsp;').gsub('\n','<br />');
};

// Deep clone on an object.
AjaxLife.Utils.Clone = function(myObj) {
	if(typeof(myObj) != 'object') return myObj;
	if(myObj == null) return myObj;

	var myNewObj = new Object();

	for(var i in myObj)
		myNewObj[i] = AjaxLife.Utils.Clone(myObj[i]);

	return myNewObj;
}

// Formats a number.
AjaxLife.Utils.FormatNumber = function(number) {
	number = '' + number;
	var comma = _("Number.ThousandSeparator");
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

AjaxLife.Utils.LinkURLs = function(text) {
	// Make URLs into links
	text = text.gsub(/(http:\/\/[a-zA-Z0-9.-]+(\/[^ ;)"]*)?)/,'<a href="#{1}" target="_blank" class="loglink">#{1}</a>');
	// Catch SLurl™ links.
	text = text.gsub(/<a href="(http:\/\/t?slurl\.com\/secondlife\/([^'\\]+?)\/([0-9.]+)\/([0-9.]+)\/?([0-9.]+)?)"/, '<a href="#{1}" onclick="AjaxLife.Map.HandleLink(\'#{2}\',\'#{3}\',\'#{4}\',\'#{5}\',this);return false"');
	// Make secondlife:/// links clickable.
	text = text.gsub(/(secondlife:\/\/\/?([^'\/"]+)\/([0-9.]+)\/([0-9.]+)\/?([0-9.]+)?)/, '<a href="#{1}" onclick="AjaxLife.Map.HandleLink(\'#{2}\',\'#{3}\',\'#{4}\',\'#{5}\',this);return false" target="_blank" class="loglink">#{1}</a>');
	return text;
}

AjaxLife.Utils.LinkifyText = function(text) {
	text = text.gsub('<','&lt;').gsub('>','&gt;');
	text = AjaxLife.Utils.LinkURLs(text);
	text = text.gsub('&','&amp;').gsub(/&amp;(lt|gt)/,'&#{1}');
	return text;
}