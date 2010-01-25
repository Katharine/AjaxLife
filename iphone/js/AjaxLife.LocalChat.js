AjaxLife.LocalChat = function() {
    var history_panel = false;
    var chat_input = false;
    var callbacks = [];
    
    function add_to_log(text, type) {
        var time = new Date();
        var timestamp = "[" + time.getHours() + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : time.getMinutes()) + "]";
        history_panel.append($("<p class='"+type+"'><span class='timestamp'>"+timestamp+"</span> "+text+"</p>"));
		history_panel.scrollTop(history_panel.attr('scrollHeight')); // Scrolls to bottom.
		$.each(callbacks, function(this) {
		    this(sender, text, type);
		});
    }
    
    function send_chat(text) {
        AjaxLife.Network.send('SpatialChat', {
            Message: text,
            Channel: 0,
            Type: 1 // Normal chat
        });
    }
    
    function incoming_line(name, message, source, type) {
        if(message == '') return;
        if(source != 0) { // Not system message
            if(message.substr(0,3) == "/me") {
				message = name+message.substr(3);
			} else {
    			var you = (name == AjaxLife.UserName && source == 1); // source == agent
    			if(you) name = 'You';
    			if(type == 0) {
    			    message = name + (you ? ' whisper: ' : ' whispers: ') + message;
    			} else if (type == 1 || type == 8) {
    			    message = name + ': ' + message;
    			} else if (type == 2) {
    			    message = name + (you ? ' shout: ' : ' shouts: ') + message;
    			}
    		}
        }
        var message_type = 'agent';
        if(source == 0) message_type = 'system';
        if(source == 2) message_type = 'object';
        if(type == 8) message_type = 'ownersay';
        add_to_log(message, message_type);
    }
    
    return {
        init: function() {
            history_panel = $('#localchat_history');
            chat_input = $('#localchat_input');
            $('#localchat > form').submit(function(e) {
                e.preventDefault();
                send_chat(chat_input.val());
            	chat_input.val('');
                return false;
            });
            
            AjaxLife.Network.MessageQueue.register_callback('SpatialChat', function(data) {
                if(data.Audible > -1) {
                    if(data.Type <= 2 || data.Type == 8) { // Whisper, Normal, Shout, OwnerSay
                        incoming_line(data.FromName, data.Message, data.SourceType, data.Type);
                    }
                }
            });
            
            AjaxLife.Network.MessageQueue.register_callback('InstantMessage', function(data) {
				if(data.Dialog == 19) { // MessageFromObject
				    incoming_line(data.FromAgentName, data.Message, 2, 8); // Object, OwnerSay (a lie, but oh well.)
				}
			});
        },
        add_callback: function(callback) {
            callbacks.push(callback);
        }
    };
}();