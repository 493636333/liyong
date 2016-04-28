<?php
	public function validate($input);
	public function showError($input);
	public function setName($name);
	public function getName();
	public function setTemplate($template);
?>
v::number()->between(1,2)->validate($input);

$userValidator = v::attribute('name', v::stringType()->length(1,32))
                  ->attribute('birthdate', v::date()->age(18))
                  ->attribute('friends', v::array()->length(5)->attribute('name'))