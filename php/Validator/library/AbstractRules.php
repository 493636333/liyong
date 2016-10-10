<?php
	/**
	 * @file 多条rule可以合并成一条
	 * @author liyong18
	 * @date 2016-07-29
	 */
	abstract class AbstractRules extends AbstractRule {

		protected $rules = array();
		
		/**
		 * 设置校验数据的key
		 * @param [string] $name
		 */
		public function setName($name) {
			$parentName = $this->getName();
			foreach ($this->rules as $key => $rule) {
				$name = $rule->getName();
				if($name && $parentName != $name) {
					continue;
				}
				$rule->setName($name);
			}
			return $this;
		}

		/**
		 * 加一条rule
		 * @param [string|RuleInterface] $rule
		 * @param array  $arguments [需要用到的参数]
		 */
		public function addRule($rule, $arguments = array()) {
			if(!$rule instanceof RuleInterface) {
				$this->appendRule(Validator::buildRule($rule, $arguments));
			} else {
				$this->appendRule($rule);
			}
			return $this;
		}

		/**
		 * 内部使用的加rule的方法，会为rule设置name
		 * @param  RuleInterface $rule
		 * @return [AbstractRules]
		 */
		protected function appendRule(RuleInterface $rule) {
			if (!$rule->getName() && $this->getName()) {
				$rule->setName($this->getName());
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
				if ($value instanceof RuleInterface) {
	                $this->appendRule($value);
	            } elseif (is_numeric($key) && is_array($value)) {
	                $this->addRule($value[0], array_slice($value, 1));
	            } elseif (is_numeric($key) && is_string($value)) {
	            	$this->addRule($key);
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

		public function validate($input) {
			$rules = $this->getRules();
			foreach ($rules as $key => $value) {
				if (!$value->validate($input)) {
					return false;
				}
			}
			return true;
		}
	}
?>