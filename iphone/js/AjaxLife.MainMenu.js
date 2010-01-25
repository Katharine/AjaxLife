AjaxLife.MainMenu = function() {
    var last_region = false;
    var last_pos = false;
    var last_nearby_count = 0;
    var unread_local_chat = 0;
    function update_position(useful_data) {
        var region = useful_data.YourRegion;
        var pos = {X: Math.round(useful_data.YourPosition.X), Y: Math.round(useful_data.YourPosition.Y), Z: Math.round(useful_data.YourPosition.Z)};
        if(pos.X != last_pos.X || pos.Y != last_pos.Y || pos.Z != last_pos.Z || last_region != region) {
            last_pos = pos;
            last_region = region;
            $('#mainmenu_worldmap').text(region + ' (' + pos.X + ', ' + pos.Y + ', ' + pos.Z + ')');
        }
        
        var nearby_count = useful_data.Positions.length - 1;
        if(nearby_count != last_nearby_count) {
            last_nearby_count = nearby_count;
            if(nearby_count > 0) {
                $('#menu_nearby > small').text(nearby_count).css('display', '');
            } else {
                $('#menu_nearby > small').css('display', 'none !important');
            }
        }
    }
    return {
        init: function() {
            $('#menu_logout').click(function() {
                AjaxLife.UI.WaitPane.show('Logging out...');
                AjaxLife.Network.logout();
            });
            update_position({YourRegion: AjaxLife.InitialRegionName, YourPosition: AjaxLife.InitialPosition, Positions: []});
            AjaxLife.Network.MessageQueue.register_callback('UsefulData', update_position);
            AjaxLife.LocalChat.register_callback(function() {
                $('#menu_localchat > small').text(++unread_local_chat).css('display', '');
            })
            
            $('#menu_localchat').click(function() {
                unread_local_chat = 0;
                $('#menu_localchat > small').css('display', 'none !important');
            });
        }
    };
}();