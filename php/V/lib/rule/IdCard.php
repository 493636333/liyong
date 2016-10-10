<?php
	/**
	 * 身份证
	 */
	class IdCard extends Va_Library_AbstractPreRule {
		protected $preRules = array(array('Regex','/(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$)/'));
		protected function _validate($input) {
			return true;
		}
	}
?>