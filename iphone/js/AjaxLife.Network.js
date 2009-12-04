//TODO: Error handling, message signing, ...
AjaxLife.Network = function() {
    return {
        Connected: false,
        init: function() {
            AjaxLife.Network.MessageQueue.init();
            AjaxLife.Network.Connected = true;
        },
        send: function(message, callback, arguments, sign) {
            arguments.sid = AjaxLife.SessionID;
            $.post(AjaxLife.APIRoot + 'send', arguments, callback, "json");
        }
    };
}();

AjaxLife.Network.MessageQueue = function() {
    var requesting = false;
    var callbacks = {};
    var interval = false;
    var lastmessage = false;
    var deadserverwarned = false;
    
    function process_queue(queue) {
        $.each(queue, function() {
            var handled = false;
            var item = this;
            if(callbacks[item.MessageType]) {
                try {
                    $.each(callbacks[item.MessageType], function() {
                        if(this && typeof this == 'function') {
                            this(item);
                        } else if(typeof callback != 'boolean') {
                            alert("Error: non-function callback for "+item.MessageType+". WTF!?");
                        }
                    });
                } catch(e) {
                    AjaxLife.Debug("Network", "Caught an exception in process_queue:");
                    AjaxLife.Debug(e);
                }
            }
        });
    }
    
    function handle_incoming(queue) {
        //lastmessage = new Date();
        deadserverwarned = false;
        if(!AjaxLife.Network.Connected) return;
        try {
            process_queue(queue);
        } catch(e) {
            alert("ERROR ERROR ERROR!\nEvent queue failure!");
        }
        requesting = false;
        if(AjaxLife.Network.Connected) request_queue();
    }
    
    function request_queue(queue) {
        if(requesting) return;
        requesting = true;
        $.post(AjaxLife.APIRoot + 'events', {sid: AjaxLife.SessionID}, handle_incoming);
    }
    
    return {
        init: function() {
            AjaxLife.Network.Connected = true;
            request_queue();
        },
        shutdown: function() {
            requesting = false;
            AjaxLife.Network.Connected = false;
        },
        register_callback: function(message, callback) {
            if(!callbacks[message]) {
                callbacks[message] = [];
            }
            var num = callbacks[message].length;
            callbacks[message][num] = callback;
            return num;
        },
        unregister_callback: function(message, callback) {
            if(callbacks[message] && callbacks[message][callback]) {
                callbacks[message][callback] = false;
            }
        }
    }
}();