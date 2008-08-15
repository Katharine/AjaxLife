AjaxLife = function() {
	function completeinit()
	{
		AjaxLife.Network.Connected = true;
		AjaxLife.UI.init();
		AjaxLife.InstantMessages.init();
		AjaxLife.Friends.init();
		AjaxLife.Chat.init();
		AjaxLife.World.init();
		AjaxLife.Network.init();
	}
	
	function loadsession()
	{
		new Ajax.Request('api/sessiondetails', {
			method: 'post',
			parameters: {
				sid: AjaxLife.SessionID
			},
			onSuccess: function(xhr) {
				if(!xhr.responseJSON)
				{
					AjaxLife.UI.ShowFatalError("Fatal error", "Unable to load session data.\n\n"+xhr.responseText);
					return;
				}
				for(var i in xhr.responseJSON)
				{
					AjaxLife[i] = xhr.responseJSON[i];
				}
				completeinit();
			},
			onFailure: function(xhr) {
				AjaxLife.UI.ShowFatalError("Fatal error", "Unable to load session data.");
			}
		});
	}

	return {
		init: function() {
			// We need this timeout to prevent the loading bar from showing indefinitely.
			// Shorter may work, but this has worked over GPRS and Wi-Fi, so...
			setTimeout(loadsession, 1000);
		}
	};
}();