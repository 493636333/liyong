<?php
	abstract class AbstractPreRule extends AbstractRule {

		// 要检查这个，提前检查什么,比如检查偶数首先检查是不是整数
		protected $preRules = array();
		protected $preValidator = null;

		public function validate($input) {
			$preResult = null;
			if ($this->buildPreValidator()) {
				$preResult = $this->preValidator->validate($input);
			}
			
			if ($preResult && $this->inspect()) {
				return true;
			}
			return false;
		}

		public function check($input) {
			if ($this->buildPreValidator()) {
				$this->preValidator->check($input);
			}
			parent::check($input);
			return true;
		}

		public function assert($input) {
			// $exception = null;
			// try{
			// 	if ($this->buildPreValidator()){
			// 		$this->preValidator->assert($input);
			// 	}
			// }catch(CommonException $e) {
			// 	$exception = $e;
			// }

			// try{
			// 	parent::assert($input);
			// }catch(CommonException $e) {
			// 	$exception = $exception ? $exception->setRelated($e) : $e; 
			// }

			// if ($exception) {
			// 	throw $exception;
			// }
			// return true;

			return $this->check($input);
		}

		public function inspect($input) {
			throw new Exception('rule must achieve \'inspect\' function');
		}

		public function addPreRule($rule) {
			if (!in_array($rule, $this->preRules)) {
				array_push($this->preRules, $rule); 
			}
		}

		public function setPreValidator($validator) {
			$this->$preValidator = $validator;
			$this->buildPreValidator();
		}
		protected function buildPreValidator() {
			if (count($this->preRules) === 0) {
				return false;
			}

			if (!$this->preValidator) {
				$this->$preValidator = new Validator();
			} else {
				return true;
			}
			
			$this->preValidator->setName($this->getName());

			foreach ($this->preRules as $key => $values) {
				$isArray = is_array($values);
				$ruleName = $isArray ? $values[0] : $values;
				$params = $isArray ? array_splice($values, 1) : null;
				$this->preValidator->addRule($ruleName, $params);
			}

			return true;
		}
		
	}
?>