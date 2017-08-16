<?php
	class Int extends Va_Library_AbstractRule {

		// false:可以使用字符串   true:只能使用int
		private $bolForce = false;
		public function __construct($bolForce = false) {
			$this->bolForce = $bolForce;
		}
		protected function _validate($input) {
			if (is_int($input)) {
				return true;
			} elseif (!$this->bolForce && (string)(int)($input) === $input) {
				return true;
			}
			return false;
		}
	}
?>