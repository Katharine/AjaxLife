AjaxLife.UI = function() {
	var notification = false;

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
			addLink('home','chat','Local chat');
			addLink('home','imlist','Current IMs');
			addLink('home', '', 'Log out').onclick = dologout;
			
			// Notification element
			notification = new Element('div', {'class': 'notification'});
			document.body.appendChild(notification);
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
		CreateNewPanel: function(type, id, name, hideBackButton, hideToolbarButton, onShow) {
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
			if(hideToolbarButton)
			{
				opts.hideToolbarButton = 'hideToolbarButton';
			}
			var panel = new Element(element, opts);
			if(onShow)
			{
				panel.onshow = onShow;
			}
			document.body.appendChild(panel);
			return panel;
		},
		AddLink: addLink,
		ShowFatalError: function(title, message) {
			var error = this.CreateNewPanel('panel', 'fatal-error', title, true, true);
			var message = new Element('h2', {align: 'center'}).update(message.escapeHTML().gsub("\n","<br />"));
			error.appendChild(message);
			iui.showPage(error);
		},
		ShowNotification: function(notice, onclick) {
			notification.update(notice.escapeHTML().gsub("\n", "<br />"));
			if(notification.timeout) clearTimeout(notification.timeout);
			// Add the callback, if any. If there isn't any, clear anything that might be there.
			if(onclick) notification.onclick = onclick;
			// One second fade in, two seconds visible. Will be followed by one second fade out.
			// Fading is controlled by CSS (woo!)
			notification.addClassName('visible');
			notification.timeout = setTimeout(function() {
				notification.removeClassName('visible');
				notification.onclick = Prototype.emptyFunction;
			}, 3000);
		}
	};
}();