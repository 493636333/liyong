<?php
	class Param extends Va_Library_AbstractAppendSelfRules {
		public function config($key, Va_Interface_Rule $v) {
			$v->setName($key);
			$this->appendRule($v);
			return $this;
		}
		public function _beforeValidate($input) {
			if (!is_array($input)) {
				return false;
			}
			return true;
		}

		public function _validate($input) {
			$bolRes = $this->_validateRulesNoInterrupt($input);
			return $this->_validateRulesNoInterrupt($input);
		}
	}
?>