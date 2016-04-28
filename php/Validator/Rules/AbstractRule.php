<?php
	abstract class AbstractRule {

		// 优先级,比如default() 先于boolen()
		public $level;

		// 要检查这个，提前检查什么,比如检查偶数首先检查是不是整数
		public $preCheck = array();

		abstract function validate($input) {
			
		}
	}
?>