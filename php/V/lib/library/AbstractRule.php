<?php
	abstract class Va_Library_AbstractRule implements  Va_Interface_Rule {
		protected $intLevel = 100;
		// 字段名
		protected $name;

		public function setName($name) {
			$this->name = $name;
			return $this;
		}
		
		public function getName() {
			return $this->name;
		}
		
		public function getLevel() {
			return $this->intLevel;
		}

		protected function _beforeValidate() {
			return true;
		}

		public function validate($input) {
			
			if (!$this->_beforeValidate($input)) {
				return false;
			}

			if (!$this->_validate($input)) {
				return false;
			}
			
			return $this->_afterValidate($input);
		}

		protected function _afterValidate() {
			return true;
		}

		abstract protected function _validate($input);

		public function validateNotStrict($input) {
			if($this->validate($input)) {
				return new Va_Library_Result(0, '', $input);
			}
			return new Va_Library_Result(1);
		}
		// 调试用
		public function debug() {
			return get_class($this).'name:'.$this->name;
		}

	}
?>