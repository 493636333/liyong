<?php
	class Int extends AbstractRule {

		// false:可以使用字符串   true:只能使用int
		private $bolForce = false;
		public function __construct($bolForce = false) {
			$this->bolForce = $bolForce;
		}
		public function inspect($input) {
			if (is_int($input)) {
				return true;
			} elseif (!$this->bolForce && is_string($input) && (string)(int)($input) === $input) {
				return true;
			}
			return false;
		}
	}
?>