<?php
	/**
	 * 奇数校验
	 */
	class Odd extends Va_Library_AbstractPreRule {
		
		public function __construct($bolIntForce = false) {
			$this->addPreRule(array('int', $bolIntForce));
		}

		protected function _validate($input) {
			if ($input % 2 === 0) {
				return false;
			}
			return true;
		}
	}
?>