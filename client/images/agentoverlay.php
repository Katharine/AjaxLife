<?php
header("Content-Type: image/png");
$img = imagecreatetruecolor($_GET['size']+10,$_GET['size']+10);
imagesavealpha($img,true);
imagefill($img,0,0,imagecolorallocatealpha($img,255,255,255,127));
if(is_array($_GET['agent']))
{
	$icon = imagecreatetruecolor(7,7);
	imagesavealpha($icon,true);
	imagefill($icon,0,0,imagecolorallocatealpha($icon,255,255,255,127));
	imagefilledellipse($icon,3,3,7,7,imagecolorallocate($icon,0,255,0));
	imageellipse($icon,3,3,7,7,imagecolorallocate($icon,0,0,0));
	foreach($_GET['agent'] as $agent)
	{
		$agent = explode(',',$agent);
		$pos = array(
			'x' => ($agent[0]%256)/256*$_GET['size'],
			'y' => ($agent[1]%256)/256*$_GET['size']
		);
		imagecopy($img, $icon, $pos['x'] - 3 + 5, $_GET['size'] - ($pos['y'] - 3) - 5, 0, 0, 7, 7);
	}
	imagedestroy($icon);
}
imagepng($img);
imagedestroy($img);
?>