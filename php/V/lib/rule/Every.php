<?php
	class Every extends Va_Library_AbstractAppendSelfRules {
		public function _beforeValidate($input) {
			if (!is_array($input)) {
				return false;
			}
			return true;
		}
		
		public function _validate($input) {
			foreach ($input as $key => $item) {
				$result = $this->_validateRulesNoInterrupt($item);
				if (false === $result) {
					return false;
				}
			}
			return true;
		}

		public function config(Va_Interface_Rule $v) {
			$this->appendRule($v);
		}
	}
?>