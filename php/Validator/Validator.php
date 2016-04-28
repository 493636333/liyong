<?php

	// 单个数据校验的Validator类
	class Validator {

		// 字段名
		protected $name;

		// 哪些校验规则
		protected $rules = array();

		// 用户设置的错误显示信息
		protected $messages =array();

		// 数据首先过filter
		protected $filter = array();
		
		public function validate($input) {
			$result = new Result();
			foreach ($this->filter as $key => $filter) {
				
			}
		}
		public function addFilter() {
			
		}
		public function setName ($name) {
			$this->name = $name;
		}
		function __call(string $functionName, array $arguments)
		{
			
		}
	}
?>