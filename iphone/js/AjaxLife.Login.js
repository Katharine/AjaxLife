AjaxLife.Login = function() {
    function base64encode(str) {
    	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    	var base64DecodeChars = new Array(
    	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    	52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    	-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    	15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    	-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    	41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    	var out, i, len;
    	var c1, c2, c3;

    	len = str.length;
    	i = 0;
    	out = "";
    	while(i < len) {
    	c1 = str.charCodeAt(i++) & 0xff;
    	if(i == len)
    	{
    		out += base64EncodeChars.charAt(c1 >> 2);
    		out += base64EncodeChars.charAt((c1 & 0x3) << 4);
    		out += "==";
    		break;
    	}
    	c2 = str.charCodeAt(i++);
    	if(i == len)
    	{
    		out += base64EncodeChars.charAt(c1 >> 2);
    		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    		out += base64EncodeChars.charAt((c2 & 0xF) << 2);
    		out += "=";
    		break;
    	}
    	c3 = str.charCodeAt(i++);
    	out += base64EncodeChars.charAt(c1 >> 2);
    	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    	out += base64EncodeChars.charAt(c3 & 0x3F);
    	}
    	return out;
    }

    function encrypt_login(challenge, e, m, first, last, password, signature)
    {
    	setMaxDigits(131);
    	key = new RSAKeyPair(e, "", m);
    	encrypted = encryptedString(key, challenge + "\\" 
    				+ base64encode(first) + "\\" 
    				+ base64encode(last) + "\\"
    				+ '$1$'+md5(password) + "\\"
    				+ signature);
    	return encrypted;
    }
    return {
        init: function() {
            $('#login').submit(function() {
                var first = $('#login_first').val();
                var last = $('#login_last').val();
                var password = $('#login_password').val();
                alert("Starting")
                encrypt_login('123423', "11", "8C5738386129C7E025A06CB4F2AD7DC9B869CCFE2004306955D692B772472B8DF0744C768664698B4B630260C7E061C3C763D0DDF4BF245B397AAE33891825C0931D5EC41B18FA8805ECC1747829965CCAC2DC9FCFEDF0FA23D74D782D99262507A6AC4AF41D5B4E078A0B4A31B867B03E9E3A09C8BA48FD2D64F36FCD2B9C51", first, last, password, 42)
                alert("Done.")
            })
        }
    }
}();
