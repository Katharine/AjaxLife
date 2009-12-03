// jQuery sucks.
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
            // Generate our signature.
            AjaxLife.Signature = Math.random().toString().substr(2);
            AjaxLife.UI.WaitPane.show("Creating session…")
            
            // Add the callback for showing/hiding the "arbitrary" input box
            $('#login_location').change(function() {
                if($('#login_location').val() == 'arbitrary') {
                    $('#login_arbitrary_li').show()
                } else {
                    $('#login_arbitrary_li').hide()
                }
            })
            
            // Set up the session.
            $.getJSON(AjaxLife.APIRoot + 'newsession', function(data) {
                AjaxLife.SessionID = data.SessionID;
                AjaxLife.Challenge = data.Challenge;
                AjaxLife.Exponent = data.Exponent;
                AjaxLife.Modulus = data.Modulus;
                $.each(data.Grids, function() {
                    option = $(document.createElement('option'));
                    option.val(this);
                    text = document.createTextNode(this);
                    option.append(text);
                    if(this == data.DefaultGrid) {
                        option.attr('selected', 'selected');
                    }
                    $('#login_grid').append(option);
                });
                AjaxLife.UI.WaitPane.hide()
            })
            
            $('#login').submit(function() {
                AjaxLife.UI.WaitPane.show("Encrypting login details…")
                var first = $('#login_first').val();
                var last = $('#login_last').val();
                var password = $('#login_password').val();
                var location = $('#login_location').val();
                var sim_name = $('#login_arbitrary').val();
                var grid = $('#login_grid').val();
                login = encrypt_login(AjaxLife.Challenge, AjaxLife.Exponent, AjaxLife.Modulus, first, last, password, AjaxLife.Signature);
                AjaxLife.UI.WaitPane.show("Logging in…")
                $.post(AjaxLife.APIRoot + 'login', {
                    logindata: login,
                    grid: grid,
                    location: location,
                    sim: sim_name,
                    session: AjaxLife.SessionID
                }, function(data) {    
                    AjaxLife.UI.WaitPane.hide()
                    if(data.success) {
                        AjaxLife.init();
                    } else {
                        alert("Login failed:\n" + data.message);
                    }
                }, "json")
            })
        }
    }
}();
