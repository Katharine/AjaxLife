AjaxLife.World = function() {
	return {
		init: function() {
			AjaxLife.Network.MessageQueue.RegisterCallback('InstantMessage', function(data) {
				if(data.Dialog == AjaxLife.Constants.MainAvatar.InstantMessageDialog.RequestTeleport)
				{
					var accept = !!confirm(data.FromAgentName + " has offered you a teleport to their location:\n\n"+data.Message);
					AjaxLife.Network.Send("TeleportLureRespond",{
							SessionID: data.IMSessionID,
							RequesterID: data.FromAgentID,
							Accept: accept
					});
					if(accept)
					{
						AjaxLife.UI.ShowNotification("Teleporting...");
					}
					else
					{
						AjaxLife.UI.ShowNotification("Teleport declined.");
					}
				}
			});
			
			AjaxLife.Network.MessageQueue.RegisterCallback('Teleport', function(data) {
				if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Finished)
				{
					AjaxLife.UI.ShowNotification("Teleport completed.");
				}
				else if(data.Status == AjaxLife.Constants.MainAvatar.TeleportStatus.Failed)
				{
					AJaxLife.UI.ShowNotification("Teleport failed. :(");
				}
			});
		}
	};
}();