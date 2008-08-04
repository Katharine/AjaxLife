AjaxLife.Utils = function() {
	return {
		MakeTimestamp: function(date) {
			if(!date) date = new Date();
			var hours = date.getHours();
			if(hours < 10) hours = '0' + hours.toString();
			var minutes = date.getMinutes();
			if(minutes < 10) minutes = '0' + minutes.toString();
			return hours + ':' + minutes;
		}
	}
}();