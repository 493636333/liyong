<?php
	/**
	* 
	*/
	class AbstractFilter
	{
		// filter优先级,从1开始，越大优先级越小
		public $level; 

		// 执行方法，返回转化后的值
		public function filter($input) {

		}
	}
?>