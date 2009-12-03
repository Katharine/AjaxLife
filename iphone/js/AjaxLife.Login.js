// jQuery sucks.
AjaxLife.Login = function() {
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
