<?php
	class Regex extends Va_Library_AbstractPreRule {

		protected $preRule = array('FilterVar', FILTER_VALIDATE_REGEXP);
		protected $strReg = null;
		public function __construct($reg) {
			$this->strReg = $reg;
		}
		protected function _validate($input) {
			if (null === $this->strReg) {
				Bingo_Log::warning('Va_Rule_AbstractRegexp must have a strReg prop');
				return false;
			}
			if(!is_string($this->strReg) || !is_string($input)) {
				Bingo_Log::warning('Va_Rule_AbstractRegexp strReg and input must be string');
				return false;
			}
			return preg_match($this->strReg, $input);
		}
	}
?>