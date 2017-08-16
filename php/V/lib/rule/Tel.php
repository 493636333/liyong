<?php
	/**
	 * 手机号码
	 */
	class Tel extends Va_Library_AbstractPreRule {
		protected $preRules = array(array('Regex','/^[1-9]{1}\d{10}$/'));
		protected function _validate($input) {
			return true;
		}
	}
?>