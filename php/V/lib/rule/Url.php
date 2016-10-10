<?php
	class Url extends Va_Library_AbstractPreRule {
		$preRule = array('FilterVal', FILTER_VALIDATE_URL);
		protected function _validate($input) {
			return true;
		}
	}
?>