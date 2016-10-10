<?php
	class Version extends Va_Library_AbstractPreRule {
		protected $preRules = array(array('Regex','/^\d+(\.\d+)*$/'));
		protected function _validate($input) {
			return true;
		}
	}
?>