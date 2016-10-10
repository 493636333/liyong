<?php

	abstract class AbstractRule implements  RuleInterface {
		// 使用哪个模板
		protected $template;

		// 字段名
		protected $name;

		public function assert($input) {
			return self::check($input);
		}

		public function check($input) {
			if ($this->validate($input)) {
				return true;
			}
			throw $this->reportError($input, array $extraParams = []);
		}
		
		public function setTemplate($template) {
			$this->template = $template;
			return $this;
		}

		public function reportError($input, $extraParams) {
			$exception = $this->createException();
			$params = array_merge(
					get_class_vars(__CLASS__),
					get_object_vars($this),
					$extraParams,
					compact($input)
				);
			$exception->config($this->getName(), $params);
			return $exception;
		}

		protected function createException() {
			$exceptionFile = VALIDATEOR_ROOT.'Exception'.DIRECTORY_SEPARATOR.get_called_class().'Exception.php';
			if (!file_exists($exceptionFile)) {
				$exception = new CommonException();
			} else {
				require_once exceptionFile;
				$exceptionClass = get_called_class().'Exception';
				$exception = new $exceptionClass();
				$exception->setRuleName(get_called_class());
			}

			if (!is_null($this->template)) {
				$exception->setTemplate($this->template);
			}
			return $exception;
		}

		public function setName($name) {
			$this->name = $name;

			return $this;
		}
		
		public function getName() {
			return $this->name;
		}
		
	}
?>