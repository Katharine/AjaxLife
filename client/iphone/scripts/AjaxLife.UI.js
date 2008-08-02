AjaxLife.UI = function() {
	function addLink(menu, target, text)
	{
		var opts = {};
		var li = new Element('li', opts);
		if(target != '')
		{
			var link = new Element('a', {href: '#'+target, id: menu+'-to-'+target}).update(text);
			li.appendChild(link);
		}
		else
		{
			li.update(text);
		}
		$(menu).appendChild(li);
		return li;
	}
	
	function dologout()
	{
		AjaxLife.Network.Logout();
	}
	
	return {
		init: function() {
			// Clear "(loading)"
			$('home').removeChild($('home').firstDescendant());
			// Add a button to the toolbar.
			$('top_toolbar').appendChild(new Element('a', {href: '#imlist', 'class': 'button', id: 'top-toolbar-button'}).update('Open IMs'));
			addLink('home','friends','Friend List');
			addLink('home','groups','Groups');
			addLink('home','imlist','Current IMs');
			addLink('home', '', 'Log out').onclick = dologout;
		},
		SetIMCount: function(count) {
			if(count == 0)
			{
				$('home-to-imlist').update('Current IMs');
				$('top-toolbar-button').update('Open IMs');
			}
			else
			{
				$('home-to-imlist').update('Current IMs ('+count+')');
				$('top-toolbar-button').update('Open IMs ('+count+')');
			}
		},
		CreateNewPanel: function(type, id, name, hideBackButton) {
			var element = 'ul';
			var opts = {id: id, title: name};
			if(type == 'panel')
			{
				element = 'div';
				opts['class'] = 'panel';
			}
			if(hideBackButton)
			{
				opts.hideBackButton = 'hideBackButton';
			}
			var panel = new Element(element, opts);
			document.body.appendChild(panel);
			return panel;
		},
		AddLink: addLink
	};
}();