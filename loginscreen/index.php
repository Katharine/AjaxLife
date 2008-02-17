<?php
/* Copyright (c) 2008, Katharine Berry
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Katharine Berry nor the names of any contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY KATHARINE BERRY ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KATHARINE BERRY BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/

// Place a Google Analytics tracking code of your choice here.
// Leave blank to disable.
define('GOOGLE_ANALYTICS', '');

@$screen = file_get_contents('https://secondlife.com/app/login/splash.php');
if($screen === false || strpos($screen,'<H2>The requested URL could not be retrieved</H2>') !== false)
{
	header("Content-Type: text/plain");
	die(<<<EOF
Linden Lab's webservers are broken again, so no fancy login screen here.

This unofficial viewer connects to the MAIN LIVE GRID. All user information, L$, content, land and other transactions are REAL!

You can use a safe preview environment by selecting "Beta Grid (Linden Lab)" for "Grid".
EOF
	);
}
$screen = preg_replace("/.*need_new_version.*/",<<<EOF
<script type="text/javascript">
<!-- 
var os, version, DEFAULT_CHANNEL, reChannelVersion, reChannelVersionOld;
var channel = "ajaxlife";
function getVersion()
{
	document.getElementById('learn_box').style.display = "block";
};
// -->
</script>
EOF
,$screen);
$screen = preg_replace("/.*bgImgRotate.js.*/",'<script type="text/javascript" src="login_screens/bgImgRotate.js"></script>',$screen);
$screen = str_replace('/app/login/_css/main.css','css.php',$screen);
$screen = preg_replace('~src="/app/login/_img/app_login_logo_horz.png".*?>~',<<<EOF
src="login_ajaxlife.png">
<br/>
						<table cellpadding="0" cellspacing="0" border="0" width="298px" valign="top">
							<tr>
								<td align="center" valign="top">
									<table cellspacing="0" cellpadding="0" border="0" width="100%" valign="top">
										<tr>
											<td class="box_black_tl"><img src="/_img/spacer.gif" width="5" height="5"></td>
											<td class="box_black_t"><img src="/_img/spacer.gif" width="5" height="5"></td>
											<td class="box_black_tr"><img src="/_img/spacer.gif" width="5" height="5"></td>
										</tr>
										<tr>
											<td class="box_black_l"></td>
											<td class="infobox_black_content" valign="top" align="left">
												<img src="/app/login/_img/alert.png" align="absmiddle">&nbsp;<span class="gridstatus_OFFLINE">Unofficial Viewer: AjaxLife</span>
												<div id="DEFAULT_content_divider" style="margin:3px 0 0 0;"><img src="/_img/spacer.gif" width="1" height="1"></div>
												<table cellspacing="0" cellpadding="0"><tr><td>
												<div id="statusmsg">
													<strong>This unofficial viewer is connected to the MAIN LIVE GRID.</strong><br /> 
													This is NOT a preview environment.<br /> 
													All user information, L$, content, land and other transactions are REAL!
												</div>
												</td></tr></table>
											</td>
											<td class="box_black_r"></td>
										</tr>
											<td class="box_black_bl"></td>
											<td class="box_black_b"></td>
											<td class="box_black_br"></td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
EOF
,$screen);
$screen = str_replace('/app/login/','https://secure-web'.rand(0,13).'.secondlife.com/app/login/',$screen);
$screen = str_replace('"/_img/','"https://secondlife.com/_img/',$screen);
if(!defined('GOOGLE_ANALYTICS') || GOOGLE_ANALYTICS == '')
{
	$screen = str_replace('document.write','//document.write',$screen);
	$screen = preg_replace('~(.*pageTracker.*)~','//$1',$screen);
}
else
{
	$screen = preg_replace('~_gat\._getTracker\("UA-[0-9]+-[0-9]+"\)~','_gat._getTracker("'.GOOGLE_ANALYTICS.'")',$screen);
}
print $screen;
?>
