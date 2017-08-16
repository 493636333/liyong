<?php
	/**
	 * id校验，必须是自然数
	 */
	class Id extends Va_Library_AbstractPreRule {
		protected $preRules = array('int');
		protected function _validate($input) {
			return $input > 0;
		}
	}
?>