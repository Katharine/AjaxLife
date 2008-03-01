function bgImgRotate() 
{
	// Note: These images don't exist in svn. Find your own images.
	var images = Array( "login_screens/log_01.jpg", "login_screens/log_02.jpg", "login_screens/log_03.jpg", "login_screens/log_04.jpg"); 
	var myDate = new Date();
	var hour = myDate.getHours(); 
	var index; 
	if (hour < 5) 
	{ 
		index = 3; 
	} 
	else if (hour < 10) 
	{ 
		index = 0; 
	} 
	else if (hour < 18) 
	{ 
		index = 1; 
	} 
	else if (hour < 21) 
	{ 
		index = 2; 
	} 
	else if (hour < 24) 
	{ 
		index = 3; 
	} 
	else 
	{ 
		index = 1; 
	}
	document.getElementById('mainImage').src = images[index]; 
} 
