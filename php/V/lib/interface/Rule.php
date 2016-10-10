<?
	/**
	 * @file 优先级迭代器接口
	 * @author liyong18(liyong18@baidu.com)
	 * @date 2016-07-107
	 */
	
	interface Va_Interface_Rule {
		public function validate($input);

		// level越小，级别越高
		public function getLevel();

		// 非严格校验，会返回过滤之后的值
		public function validateNotStrict($input);
	}
?>