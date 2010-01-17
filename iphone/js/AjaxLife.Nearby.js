AjaxLife.Nearby = function() {
    var nearby_list = false;
    var avatars = {};
    var avatar_count = 0;
    
    function add_avatar(data) {
        AjaxLife.NameCache.Add(data.ID, data.Name);
        if(data.ID != AjaxLife.AgentID && !avatars[data.ID]) {
            AjaxLife.Debug("Nearby", "Adding agent " + data.ID + " \""+data.Name+"\" to nearby list.");
            avatars[data.ID] = data.Name;
            var element = $("<li class='arrow'>"+data.Name+"</li>").data("name", data.Name.toLowerCase()).data("id", data.ID);
            // This should sort into alphabetical order. >.>
            var inserted = false;
            nearby_list.children('li').each(function() {
                if(!$(this).data('name')) {
                    $(this).remove();
                    return false;
                }
                if(element.data('name') > $(this).data('name')) {
                    $(this).before(element);
                    inserted = true;
                    return false; // break;
                }
            });
            if(!inserted) nearby_list.append(element);
            ++avatar_count;
        }
    }
    
    function remove_avatar(data) {
        if(data.ID != AjaxLife.AgentID) {
            AjaxLife.Debug("Nearby", "Removing agent " + data.ID + " \""+data.Name+"\" from nearby list.");
            nearby_list.children('li').each(function() {
                if($(this).data('id') == data.ID) {
                    $(this).remove();
                }
            });
            delete avatars[data.ID];
            --avatar_count;
            if(avatar_count == 0) {
                nearby_list.append($('<li>Nobody</li>'));
            }
        }
    }
    
    function clear_list(data) {
        nearby_list.empty();
        avatars = {};
    }
    
    return {
        init: function() {
            nearby_list = $('#nearby_list');
            AjaxLife.Network.MessageQueue.register_callback('AvatarAdded', add_avatar);
            AjaxLife.Network.MessageQueue.register_callback('AvatarRemoved', remove_avatar);
            AjaxLife.Network.MessageQueue.register_callback('Teleport', clear_list);
        }
    };
}();