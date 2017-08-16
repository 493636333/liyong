<?
	/**
	 * 请注意，子类必须实现config方法
	 */
	abstract class Va_Library_AbstractAppendSelfRules extends Va_Library_AbstractRules {
		public function __construct() {
			$this->addSelfRule(func_get_args());
		}
		public function addSelfRule($arrParam) {
			if(!method_exists($this, 'config')) {
				throw new Exception(get_class(). 'must have config method', 1);
			}

			call_user_method_array('config', $this, $arrParam);
		}

	}
?>