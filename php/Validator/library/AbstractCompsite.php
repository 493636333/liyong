<?php
	class AbstractCompsite extends AbstractRules {
		public function check() {
			$rules = $this->getRules();
			foreach ($rules as $key => $value) {
				$value->check($input);
			}
			return true;
		}
		public function assert($input) {
			return $this->check($input);
		}
	}
?>