<?php
	class Birthday extends Va_Library_AbstractPreRule {

		// false:可以使用字符串   true:只能使用int
		protected $preRules = array(array('max', 'now', true));
		protected function _validate($input) {
			return true;
		}
	}
?>