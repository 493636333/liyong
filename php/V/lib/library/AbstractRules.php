<?php
	/**
	 * @file 多条rule可以合并成一条
	 * @author liyong18
	 * @date 2016-07-29
	 */
	
	abstract class Va_Library_AbstractRules extends Va_Library_AbstractRule {
		protected $appendSelf = false;
		protected $rules = array();
		
		/**
		 * 设置校验数据的key
		 * @param [string] $name
		 */
		public function setName($name) {
			if ($this->name) {
				return $this;
			}
			parent::setName($name);
			return $this;
		}

		protected function _beforeAddRule($rule, $arguments = array()) {
			return true;
		}

		/**
		 * 加一条rule
		 * @param [string|RuleInterface] $rule
		 * @param array  $arguments [需要用到的参数]
		 */
		public function addRule($rule, $arguments = array()) {
			if (!$this->_beforeAddRule($rule, $arguments)) {
				return $this;
			}
			$objRule = Va_Library_Factory::rule($rule, $arguments);
			$this->appendRule($objRule);

			$this->_afterAddRule($rule, $arguments, $objRule);
			return $this;
		}

		protected function _afterAddRule($strRule, $arguments = array(), $objRule) {
			return true;
		}

		/**
		 * 内部使用的加rule的方法，会为rule设置name
		 * @param  RuleInterface $rule
		 * @return [AbstractRules]
		 */
		protected function appendRule(Va_Interface_Rule $rule) {
			// if (!$rule->getName() && $this->getName()) {
			// 	$rule->setName($this->getName());
			// }

			$intLevel = $rule->getLevel();
			$rules = $this->getRules();
			foreach ($rules as $idx => $curRule) {
				if ($curRule->getLevel() >= $intLevel) {
					array_splice($this->rules, $idx, 0, array($rule));
					return $this;
				}
			}
			$this->rules[] = $rule;
			return $this;
		}

		/**
		 * 加多个rule
		 * @param array $validators [description]
		 * 1.可以直接是实现RuleInterface的对象array(RuleInterface)
		 * 2.可以是array(array('between',1,3))
		 * 3.可以是array('int')
		 */
		public function addRules(array $validators) {
			foreach ($validators as $key => $value) {
				if ($value instanceof Va_Interface_Rule) {
	                $this->appendRule($value);
	            } elseif (is_numeric($key) && is_array($value)) {
	                $this->addRule($value[0], array_slice($value, 1));
	            } elseif (is_numeric($key) && is_string($value)) {
	            	$this->addRule($value);
	            }
			}
			return $this;
		}

		public function removeRules() {
			$this->rules = array();
			return $this;
		}

		public function getRules() {
			return $this->rules;
		}

		public function getIsFind() {
			return $this->isFind;
		}

		protected function _validateRules($input) {
			$rules = $this->getRules();
			foreach ($rules as $key => $value) {
				$result = $value->validate($input);
				switch ($result) {
					case Va_Constant_RuleResult::RETURN_TRUE_CONTINUE:
						continue;
						break;
					case Va_Constant_RuleResult::RETURN_TRUE:
						return true;
					default:
						return false;
				}
			}
			return true;
		}

		protected function _validateRulesNoInterrupt($input) {
			$rules = $this->getRules();
			foreach ($rules as $key => $value) {
				$result = $value->validate($input);
				if (false === $result) {
					return false;
				}
			}
			return true;
		}

		protected function _validate($input) {
			return $this->_validateRulesNoInterrupt($input);
		}

		public function __call($ruleName, $arguments) {
			$this ->addRule($ruleName, $arguments);
			return $this;
		}

		public function debug() {
			$arr = array();
			$class = get_class($this);
			foreach ($this->rules as $key => $rule) {
				$arr[$class.',name:'.$this->name][] = $rule->debug();
			}

			return $arr;
		}
	}
?>