<?
	/**
	 * @file 优先级迭代器接口
	 * @author liyong18(liyong18@baidu.com)
	 * @date 2016-07-107
	 */
	
	interface RuleInterface {

		// 抛出所有错误
		public function assert();
		
		// 抛出一个错误
		public function check($input);

		// 返回true or false
		public function validate($input);

		// rule如果不通过，用哪个错误模板
		public function setTemplate($template);

		// rule如果不通过，调用这个方法来输出错误
		public function reportError($input, array $extraParams = []);

		// templte中需要指明当前field的字段名，才能报错
		public function setName($name);
		
		public function getName();
	}
?>