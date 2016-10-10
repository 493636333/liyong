<?php
	class ArrayValidator extends AbstractCompsite {

		public function validate(Array $input) {
			$this->buildLeftRule($input);
			return parent::validate($input);
		}

		public function check(Array $input) {
			$this->buildLeftRule($input);
			try {
				parent::check($input);
			} catch(Exception $e) {
				$exception =  new ArrayException();
				$exception->setRelated(array($e));
				throw $exception;
			}
			return true;
		}

		public function assert(Array $input) {
			$this->buildLeftRule($input);
			$rules = $this->getRules();
			$exception = new ArrayException();
			foreach ($rules as $key => $value) {
				try {
					$value->check($input);
				} catch (Exception $e) {
					$exception->setRelated(array($e));
				}
			}
			if ($exception->isError()) {
				throw $exception;
			}
			return true;
		}

		public function param($key, Validator $v) {
			$v->setName($key);
			$this->appendRule($v);
			return $this;
		}

		protected function buildLeftRule($input = array()) {
			foreach ($rules as $key => $value) {
				if ($value->getIfNeedBuildRule()) {
					$value->buildLeftRule($input);
				}
			}
		}

	}
?>