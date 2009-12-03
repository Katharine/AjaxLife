AjaxLife = {}
AjaxLife.ServerLookup = '/api/findserver'; // Set to false to disable the lookup and just use the APIRoot as it stands.
AjaxLife.ServerIP = null;
AjaxLife.SameOriginProxy = '/client/proxy.php/';
AjaxLife.APIRoot = '/api/'

// jQTouch init
AjaxLife.jqt = $.jQTouch()

// This is called after a successful login.
AjaxLife.init = function() {
    alert("We logged in! Now what?")
}

AjaxLife.Debug = function(module, text) {
    if(window.console) {
        if(text) {
            console.log(module + ": " + text);
        } else {
            console.log(module);
        }
    }
}

$(document).ready(function() {
    AjaxLife.UI.init()
    AjaxLife.Login.init()
})