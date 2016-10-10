<?php
	class Equal extends Va_Rule_AbstractInterval {

		// false:可以使用字符串   true:只能使用int
		private $bolForce = false;
		public function __construct($orginInput, $bolForce = false) {
			$this->bolForce = $bolForce;
			$this->interval = $orginInput;
		}
		protected function _validate($input) {
			if ($this->bolForce) {
				return $this->orginInput === $input;
			}

			return $this->filterInterval($input) == $this->filterInterval($this->interval);
		}
	}
?>