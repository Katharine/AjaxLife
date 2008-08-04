AjaxLife.Friends = function() {
	var friends = {};
	var friendlist = false;
	
	function statuschange(friend)
	{
		if(!friends[friend.ID] || friends[friend.ID].Online !== friend.Online)
		{
			friends[friend.ID].Online = friend.Online;
			insertalphabetical(friend.Online ? 'online' : 'offline', friend);
		}
	}
	
	function insertalphabetical(list, friend)
	{
		if(!friends[friend.ID].Node)
		{
			friends[friend.ID].Node = makefrienditem(friend);
		}
		var thisitem = $('friends-group-'+list).next();
		var lowername = friend.Name.toLowerCase();
		while(thisitem && !thisitem.hasClassName('group') && friends[thisitem.getAttribute('friendid')].Name.toLowerCase() < lowername)
		{
			thisitem = thisitem.next();
		}
		if(thisitem)
		{
			friendlist.insertBefore(friends[friend.ID].Node, thisitem);
		}
		else
		{
			friendlist.appendChild(friends[friend.ID].Node);
		}
	}
	
	function makefrienditem(friend)
	{
		var a = new Element('a', {onclick: 'AjaxLife.InstantMessages.Start("'+friend.ID+'","'+friend.Name+'")'}).update(friend.Name);
		var li = new Element('li', {friendid: friend.ID});
		li.appendChild(a);
		return li;
	}
	
	function dofriendlist()
	{
		friendlist.descendants().invoke('remove');
		var online = [];
		var offline = [];
		for(var i in friends)
		{
			var friend = friends[i];
			if(friend.Online)
			{
				online.push(friend);
			}
			else
			{
				offline.push(friend);
			}
		}
		
		friendlist.appendChild(new Element('li', {'class': 'group', id: 'friends-group-online'}).update("Online"));
		online.sortBy(function(s) {
			return s.Name.toLowerCase();
		}).each(function(friend) {
			var node = friends[friend.ID].Node = makefrienditem(friend)
			friendlist.appendChild(node);
		});
		
		friendlist.appendChild(new Element('li', {'class': 'group', id: 'friends-group-offline'}).update("Offline"));
		offline.sortBy(function(s) {
			return s.Name.toLowerCase();
		}).each(function(friend) {
			var node = friends[friend.ID].Node = makefrienditem(friend)
			friendlist.appendChild(node);
		});
	}
	
	return {
		init: function() {
			friendlist = AjaxLife.UI.CreateNewPanel('list', 'friends', 'Friend List');
			AjaxLife.Network.MessageQueue.RegisterCallback('FriendOnOffline', statuschange);
			AjaxLife.Network.Send('GetFriendList', {
				callback: function(data) {
					if(!data.each) return;
					data.each(function(friend) {
						friends[friend.ID] = friend;
					});
					dofriendlist();
				}
			});
		}
	};
}();