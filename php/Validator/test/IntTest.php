<?php
	require '../library/Validator.php';
	print_r(Validator::even()->int()->validate('dd'));



	// interface a{
	// 	public function say();
	// }
	// class b implements a{
	// 	function say(){

	// 	}
	// }

	// echo 'b' instanceof a;
?>