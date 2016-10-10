<?php
	class Email extends Va_Library_AbstractRule {

		protected function _validate($input) {
			return is_string($input) && filter_var($input, FILTER_VALIDATE_EMAIL);
		}
	}
?>