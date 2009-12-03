AjaxLife = {}
AjaxLife.APIRoot = 'http://ajaxlife.net/client/redirect.php/api/'

// jQTouch init
AjaxLife.jqt = $.jQTouch()

// This is called after a successful login.
AjaxLife.init = function() {
    alert("We logged in! Now what?")
}

$(document).ready(function() {
    AjaxLife.UI.init()
    AjaxLife.Login.init()
})