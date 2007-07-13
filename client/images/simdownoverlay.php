<?php
header("Content-Type: image/png");
$img = imagecreatetruecolor($_GET['size'],$_GET['size']);
imagesavealpha($img, true);
imagefill($img,0,0,imagecolorallocatealpha($img,150,0,0,60));
imagepng($img);
imagedestroy($img)
?>