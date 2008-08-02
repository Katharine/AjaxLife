function disablefields()
{
	$('first').disable();
	$('last').disable();
	$('pass').disable();
}

function enablefields()
{
	$('first').enable();
	$('last').enable();
	$('pass').enable();
}

function startspinner()
{
	$('spinner').setStyle({
		visibility: 'visible',
		WebkitAnimationPlayState: 'running'
	});
}

function stopspinner()
{
	$('spinner').setStyle({
		visibility: 'hidden',
		WebkitAnimationPlayState: 'paused'
	});
}

function loginfailed(reason)
{
	stopspinner();
	enablefields();
	alert("Login failed:\n\n"+reason.gsub("\n"," ").gsub(/\s+/,' '));
	loggingin = false;
}

var loggingin = false;

function dologin()
{
	if(loggingin) return;
	loggingin = true;
	var spinner = $('spinner');
	spinner.style.visibility = 'visible';
    spinner.style.webkitAnimationPlayState = "running";
    disablefields();
    startspinner();
    var first = $('first').value;
    var last = $('last').value;
    var pass = '$1$'+md5($('pass').value);
    new Ajax.Request('login.php', {
    	method: 'post',
    	parameters: {
    		first: first,
    		last: last,
    		pass: pass
    	},
    	onSuccess: function(xhr) {
    		if(!xhr.responseJSON)
    		{
    			loginfailed("The server did not pass back valid JSON data.\n\n"+xhr.responseText);
    			return;
    		}
    		if(xhr.responseJSON.success)
    		{
    			var next = xhr.responseJSON.next;
    			var sid = xhr.responseJSON.sid;
    			var form = new Element('form', {
    				action: next,
    				method: 'post',
    			});
    			var input = new Element('input', {
    				type: 'hidden',
    				name: 'sid',
    				value: sid
    			});
    			form.appendChild(input);
    			form.submit();
    		}
    		else
    		{
    			loginfailed(xhr.responseJSON.message);
    			return;
    		}
    	},
    	onFailure: function(xhr) {
			loginfailed("Could not communicate with the server.");
    	}
    });
}

// Taken from AjaxLife.Libs.js
function md5(R){var U=0;var W=8;function N(A,F){A[F>>5]|=128<<((F)%32);A[(((F+64)>>>9)<<4)+14]=F;var B=1732584193;var C=-271733879;var D=-1732584194;var E=271733878;for(var I=0;I<A.length;I+=16){var G=B;var H=C;var J=D;var K=E;B=X(B,C,D,E,A[I+0],7,-680876936);E=X(E,B,C,D,A[I+1],12,-389564586);D=X(D,E,B,C,A[I+2],17,606105819);C=X(C,D,E,B,A[I+3],22,-1044525330);B=X(B,C,D,E,A[I+4],7,-176418897);E=X(E,B,C,D,A[I+5],12,1200080426);D=X(D,E,B,C,A[I+6],17,-1473231341);C=X(C,D,E,B,A[I+7],22,-45705983);B=X(B,C,D,E,A[I+8],7,1770035416);E=X(E,B,C,D,A[I+9],12,-1958414417);D=X(D,E,B,C,A[I+10],17,-42063);C=X(C,D,E,B,A[I+11],22,-1990404162);B=X(B,C,D,E,A[I+12],7,1804603682);E=X(E,B,C,D,A[I+13],12,-40341101);D=X(D,E,B,C,A[I+14],17,-1502002290);C=X(C,D,E,B,A[I+15],22,1236535329);B=O(B,C,D,E,A[I+1],5,-165796510);E=O(E,B,C,D,A[I+6],9,-1069501632);D=O(D,E,B,C,A[I+11],14,643717713);C=O(C,D,E,B,A[I+0],20,-373897302);B=O(B,C,D,E,A[I+5],5,-701558691);E=O(E,B,C,D,A[I+10],9,38016083);D=O(D,E,B,C,A[I+15],14,-660478335);C=O(C,D,E,B,A[I+4],20,-405537848);B=O(B,C,D,E,A[I+9],5,568446438);E=O(E,B,C,D,A[I+14],9,-1019803690);D=O(D,E,B,C,A[I+3],14,-187363961);C=O(C,D,E,B,A[I+8],20,1163531501);B=O(B,C,D,E,A[I+13],5,-1444681467);E=O(E,B,C,D,A[I+2],9,-51403784);D=O(D,E,B,C,A[I+7],14,1735328473);C=O(C,D,E,B,A[I+12],20,-1926607734);B=T(B,C,D,E,A[I+5],4,-378558);E=T(E,B,C,D,A[I+8],11,-2022574463);D=T(D,E,B,C,A[I+11],16,1839030562);C=T(C,D,E,B,A[I+14],23,-35309556);B=T(B,C,D,E,A[I+1],4,-1530992060);E=T(E,B,C,D,A[I+4],11,1272893353);D=T(D,E,B,C,A[I+7],16,-155497632);C=T(C,D,E,B,A[I+10],23,-1094730640);B=T(B,C,D,E,A[I+13],4,681279174);E=T(E,B,C,D,A[I+0],11,-358537222);D=T(D,E,B,C,A[I+3],16,-722521979);C=T(C,D,E,B,A[I+6],23,76029189);B=T(B,C,D,E,A[I+9],4,-640364487);E=T(E,B,C,D,A[I+12],11,-421815835);D=T(D,E,B,C,A[I+15],16,530742520);C=T(C,D,E,B,A[I+2],23,-995338651);B=Z(B,C,D,E,A[I+0],6,-198630844);E=Z(E,B,C,D,A[I+7],10,1126891415);D=Z(D,E,B,C,A[I+14],15,-1416354905);C=Z(C,D,E,B,A[I+5],21,-57434055);B=Z(B,C,D,E,A[I+12],6,1700485571);E=Z(E,B,C,D,A[I+3],10,-1894986606);D=Z(D,E,B,C,A[I+10],15,-1051523);C=Z(C,D,E,B,A[I+1],21,-2054922799);B=Z(B,C,D,E,A[I+8],6,1873313359);E=Z(E,B,C,D,A[I+15],10,-30611744);D=Z(D,E,B,C,A[I+6],15,-1560198380);C=Z(C,D,E,B,A[I+13],21,1309151649);B=Z(B,C,D,E,A[I+4],6,-145523070);E=Z(E,B,C,D,A[I+11],10,-1120210379);D=Z(D,E,B,C,A[I+2],15,718787259);C=Z(C,D,E,B,A[I+9],21,-343485551);B=Y(B,G);C=Y(C,H);D=Y(D,J);E=Y(E,K)}return Array(B,C,D,E)}function P(A,D,E,F,B,C){return Y(V(Y(Y(D,A),Y(F,C)),B),E)}function X(E,F,A,B,G,C,D){return P((F&A)|((~F)&B),E,F,G,C,D)}function O(E,F,A,B,G,C,D){return P((F&B)|(A&(~B)),E,F,G,C,D)}function T(E,F,A,B,G,C,D){return P(F^A^B,E,F,G,C,D)}function Z(E,F,A,B,G,C,D){return P(A^(F|(~B)),E,F,G,C,D)}function Y(D,A){var B=(D&65535)+(A&65535);var C=(D>>16)+(A>>16)+(B>>16);return(C<<16)|(B&65535)}function V(B,A){return(B<<A)|(B>>>(32-A))}function Q(A){var B=Array();var D=(1<<W)-1;for(var C=0;C<A.length*W;C+=W){B[C>>5]|=(A.charCodeAt(C/W)&D)<<(C%32)}return B}function S(B){var C=U?"0123456789ABCDEF":"0123456789abcdef";var A="";for(var D=0;D<B.length*4;D++){A+=C.charAt((B[D>>2]>>((D%4)*8+4))&15)+C.charAt((B[D>>2]>>((D%4)*8))&15)}return A}return S(N(Q(R),R.length*W))}