AjaxLife = function() {
	return {
		init: function() {
			setTimeout(function() {
				AjaxLife.Network.Connected = true;
				AjaxLife.UI.init();
				AjaxLife.Friends.init();
				AjaxLife.Network.init();
			}, 1000);
		}
	};
}();