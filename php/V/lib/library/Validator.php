<?php
	/**
	 * @file 单个数据的校验类
	 * @author liyong
	 * @date 2016-8-26
	 */
	
	class Va_Library_Validator extends Va_Library_AbstractRules {

		// 还没有生成的rule,主要用在Param中，多个key互相比较
		protected $notBuildRules = array();

		// 保存appendSelf==false的validator,然后来了的rule放在对应的validator中
		protected $appendValidators = array();

		public function __call($ruleName, $arguments = array()){
			$this->addRule($ruleName, $arguments);
			return $this;
		}

		protected function _beforeAddRule($rule, $arguments = array()) {
			if($this->appendValidators[$rule]) {
				$this->appendValidators[$rule]->addSelfRule($arguments);
				return false;
			}
			
			foreach ($arguments as $key => $value) {
				if (is_string($value) && strpos($value, ':') === 0) {
					$this->notBuildRules[$rule] = $arguments;
					return false;
				}
			}

			return true;
		}

		protected function _afterAddRule($strRule, $arguments = array(), $objRule) {
			if ($objRule instanceof Va_Library_AbstractAppendSelfRules && !isset($this->appendValidators[$strRule])) {
				$this->appendValidators[$strRule] = $objRule;
			}
			return true;
		}

		protected function _beforeValidate($input) {
			if (count($this->notBuildRules) > 0 && is_array($input)) {
				$this->_buildLeftRule($input);
			}
			return true;
		}

		protected function _validate($input) {
			if (is_array($input) && !empty($this->name)) {
				$input = $input[$this->name];
			}
			return $this->_validateRules($input);
		}
		
		/**
		 * 把没有build的rule生成完成
		 * @param  [Array] 校验的array
		 * @return $this
		 */
		protected function _buildLeftRule(Array $input) {
			foreach ($this->notBuildRules as $ruleName => $arguments) {
				foreach ($arguments as $key => $value) {
					if (strpos($value, ':') === 0) {
						$value = substr($value, 1);
						if (isset($input[$value])) {
							$arguments[$key] = $input[$value];
						}
					}
				}
				parent::addRule($ruleName, $arguments);
			}
		}
	}
?>