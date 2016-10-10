<?
	class Number extends Va_Library_AbstractRule {
		private $bolForce = false;
		public function __construct($bolForce = false) {
			$this->bolForce = $bolForce;
		}
		protected function _validate($input) {
			if (is_numeric($input) {
				return true;
			} elseif (!$this->bolForce && is_string($input) && (string)((float)$input) === rtrim($input, '0')) {
				return true;
			}
			return false;
		}
	}
?>