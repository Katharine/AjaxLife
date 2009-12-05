AjaxLife.UI = {};

AjaxLife.UI.init = function() {
    AjaxLife.UI.WaitPane.init()
}

AjaxLife.UI.WaitPane = function() {
    var displayed = true; // The pane is visible when the page loads.
    var pane = null;
    
    return {
        init: function() {
            pane = $('#waitpane');
        },
        show: function(text, html) {
            if(html) {
                pane.html(text);
            } else {
                pane.text(text);
            }
            if(!displayed) {
                displayed = true;
                pane.show();
                // If we don't wait, it won't fade. Grr.
                setTimeout(function() { pane.css({'opacity': 1.0}) }, 10);
            }
        },
        hide: function() {
            if(displayed) {
                pane.css({opacity: 0.0});
                setTimeout(function() {pane.hide()}, 350);
                displayed = false;
            }
        }
    }
}();