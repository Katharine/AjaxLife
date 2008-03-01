<?php
$learnbox = file_get_contents("http://secondlife.com/app/login/_includes/learn_box.php");
$learnbox = str_replace('"/_img/','"http://secondlife.com/_img/',$learnbox);
print $learnbox;
?>