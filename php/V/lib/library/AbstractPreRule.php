<?php
	abstract class Va_Library_AbstractPreRule extends Va_Library_AbstractRules {

		/**
		 * 要检查这个，提前检查什么,比如检查偶数首先检查是不是整数
		 * 三种输入形式
		 * 1.array('int')
		 * 2.array(array('between',1,4))
		 * 3.array(RuleInterface $v)
		 */
		protected $preRules = array();

		public function __construct() {
			$this->addRules($this->preRules);
		}

		protected function _beforeValidate($input) {
			return $this->_validateRules($input);
		}

		protected function addPreRule($rule) {
			$preRules = $this->preRules;
			$preRules[] = $rule;
			$this->addRules(array($rule));
		}
	}
?>