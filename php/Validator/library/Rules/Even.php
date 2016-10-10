<?php
	class Even extends AbstractRule {

		// false:可以使用字符串   true:只能使用int
		protected $preCheckArr = array('int');
		
		public function validate($input) {
			if ($input%2 === 0) {
				return true;
			}
			return false;
		}
	}
?>