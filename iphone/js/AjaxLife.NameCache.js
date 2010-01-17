// Key2name
AjaxLife.NameCache = function () {
	var namekeys = {};
	var groupkeys = {};
	var pending_names = [];
	var pending_groups = [];
	
	function addname(id, name)	{
		if(!namekeys[id]) {
			namekeys[id] = name;
			if(pending_names[id]) {
				$.each(pending_names[id], function() {
					this(name);
				});
			}
			delete pending_names[id];
		}
	};
	
	
	function addgroup(id, name) {
		if(!groupkeys[id]) {
			groupkeys[id] = name;
			if(pending_groups[id]) {
				$.each(pending_groups[id], function() {
					this(name);
				});
			}
		}
	}
	
	function dolookup(needle, haystack, pending, callback, message) {
		if(haystack[needle]) {
			callback(haystack[needle]);
		} else {
			AjaxLife.Debug("NameCache", "Performing "+message+" lookup for "+needle);
			if(!pending[needle]) {
				pending[needle] = [];
			}
			pending[needle][pending[needle].length] = callback;
			AjaxLife.Network.Send(message, { ID: needle });
		}
	}
	
	return {
		Find: function(id, callbackf) {
			dolookup(id, namekeys, pending_names, callbackf, "NameLookup");
		},
		FindGroup: function(id, callbackf) {
			dolookup(id, groupkeys, pending_groups, callbackf, "RequestGroupName");
		},
		// Manually add a new keypair.
		Add: function(id, name) {
			addname(id, name);
		},
		AddGroup: function(id, name) {
			addgroup(id, name);
		},
		init: function() {
			AjaxLife.Network.MessageQueue.register_callback('AvatarNames', function(data) {
				$.each(data.Names, function(key, name) {
					AjaxLife.Debug("NameCache: Received key/name pair "+key+" => "+name);
					addname(key, name);
				});
			});
			AjaxLife.Network.MessageQueue.register_callback('GroupNames', function(data) {
				$.each(data.Names, function(key, name) {
					AjaxLife.Debug("NameCache: Received key/group name pair "+key+" => "+name);
					addgroup(key, name);
				});
			});
		}
	};
}();