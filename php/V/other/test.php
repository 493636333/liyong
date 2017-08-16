<?php
	require 'autoload.php';

	$arr = array('name'=>1,'age'=>1);
	echo Validator::param('name', Validator::int())
				  ->param('age',  Validator::equal(':name'))
				  ->validate($arr);
?>