<?php
	abstract class AbstractPreRule extends AbstractCompsite {

		// 要检查这个，提前检查什么,比如检查偶数首先检查是不是整数
		protected $preRules = array();

		public function __construct() {
			$this->addRules($this->preRules);
		}
		public function validate($input) {
			if (parent::validate($input) && $this->inspect($input)) {
				return true;
			}
			return false;
		}

		public function check($input) {
			if (parent::check($input)) {
				if ($this->validate($input)) {
					return true;
				} else {
					throw $this->reportError($input, array $extraParams = []);
				}
			}
		}

		abstract public function inspect($input);
		
	}
?>