<?php
define('AJAXLIFE_SERVER', 'http://ajaxlife.net:8080');
header("Content-Type: application/json");
require_once('RSA.php');
$details = @file_get_contents(AJAXLIFE_SERVER.'/api/newsession');
if($details === false)
{
	die(json_encode(array('success' => false, 'message' => 'Could not connect to AjaxLife server.')));
}
$details = json_decode($details);
$toencrypt = $details->Challenge.'\\'.
				base64_encode($_POST['first']).'\\'.
				base64_encode($_POST['last']).'\\'.
				$_POST['pass'].'\\'.
				rand();
$encrypted = rsa_encrypt($toencrypt, base2dec($details->Exponent,16), base2dec($details->Modulus,16), 1024);
$encrypted = dec2base($encrypted,16);
$curl = curl_init(AJAXLIFE_SERVER.'/api/login');
curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HEADER => false,
	CURLOPT_POST => true
));
$post = array(
	'session' => $details->SessionID,
	'logindata' => $encrypted,
	'location' => 'last',
	'grid' => $details->DefaultGrid,
	'events' => 'FriendOnOffline,Disconnected,InstantMessage,SpatialChat'
);
$post = http_build_query($post, '_', '&');
curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
$return = curl_exec($curl);
curl_close($curl);
$json = json_decode(trim($return));
if($json->success)
{
	print json_encode(array('success' => true, 'next' => AJAXLIFE_SERVER.'/iphone.kat', 'sid' => $details->SessionID));
}
else
{
	print $return;
}
?>
