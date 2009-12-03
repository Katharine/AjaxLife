AjaxLife.Login = function() {
    return {
        init: function() {
            $('#login').submit(function() {
                var first = $('#login_first').val();
                var last = $('#login_last').val();
                var password = $('#login_password').val();
            })
        }
    }
}();