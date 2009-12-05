AjaxLife.WorldMap = function() {
    var map_div = false;
    var map = false;
    var displaying_current_position = true;
    var last_region = false;
    var last_pos = {X: false, Y: false, Z: false};
    
    function handle_map_clicked(thing) {
        AjaxLife.Debug(thing);
    }
    
    function update_position(useful_data) {
        var region = useful_data.YourRegion;
        var pos = {X: Math.round(useful_data.YourPosition.X), Y: Math.round(useful_data.YourPosition.Y), Z: Math.round(useful_data.YourPosition.Z)};
        if(pos.X != last_pos.X || pos.Y != last_pos.Y || pos.Z != last_pos.Z) {
            if(pos.X != last_pos.X) {
                $('#worldmap_x').val(pos.X);
            }
            if(pos.Y != last_pos.Y) {
                $('#worldmap_y').val(pos.Y);
            }
            if(pos.Z != last_pos.Z) {
                $('#worldmap_z').val(pos.Z);
            }
            last_pos = pos;
        }
        if(last_region != region) {
            last_region = region;
            if(displaying_current_position) $('#worldmap_sim').val(region);
        }
    }
    
    return {
        init: function() {
            map_div = $('#worldmap_map');
            map = new SLMap(map_div[0], {
                hasZoomControls: false,
                hasPanningControls: false,
                hasOverviewMapControl: false,
                clickHandler: handle_map_clicked
            });
            map.centerAndZoomAtSLCoord(new XYPoint(
                AjaxLife.InitialRegionCoords.x + (AjaxLife.InitialPosition.X/256),
                AjaxLife.InitialRegionCoords.y + (AjaxLife.InitialPosition.Y/256)), 1);
            AjaxLife.Network.MessageQueue.register_callback('UsefulData', update_position);
        }
    };
}();