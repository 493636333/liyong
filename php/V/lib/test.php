<?php
	require 'autoload.php';
	date_default_timezone_set('Asia/Chongqing');

	// echo V::date()->validate('2015-04-05');

	// echo V::birthday()->validate('2016-09-07');

	// echo V::param('a', V::int())
	// 		->param('b',V::equal(':a'))
	// 		 ->validate(array(
	// 	 		'a' => '1',
	// 	 		'b' => 3,
	// 		));

	// echo V::every(
	// 			V::param('a', V::int())
	// 				->param('b',V::tel())
	// 		)
	// 		->validate(
	// 			array(
	// 				array(
	// 			 		'a' => '1',
	// 			 		'b' => '18723349644',
	// 				)
	// 			)
	// 		);

	// var_export(V::param('no', V::equal(0))
	// ->param('data',V::every(
	// 		V::param('id', V::int())
	// ))->debug());


	// array('int','between'=>array(1,2))

	// array(
	// 	'age' =>array('int','email'),
	// 	'frend.*' =>array(
	// 			'age' => '',
	// 			'name' => '',
	// 			'friend.*' => 'int',
	// 		),
	// )

	// V::param('age',V::int()->email())
	// 	->('friend', )


	// echo V::read(array('between',1,2))->validate(3);
	// 
	// 
	// ------------------------------------
	// $a = array('int', array('max',2));

	// $v = V::readParam($a);

	// echo $v->validate(3);

	$a = array(
			'age' => 'int',
			'tel' => 'tel',
			'score.*'=>'int'
		);
	$v = V::readParam($a);

	echo $v->validate(array(
			'age' =>4,
			'tel' =>'18723349644',
			'score'=>array(1,2,'dd'),
		));
?>