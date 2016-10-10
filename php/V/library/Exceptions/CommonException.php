<?php
	class CommonException extends InvalidArgumentException {

		// rulename
		protected $ruleName = '';

		// key
		protected $name;

		// 一些input
		protected $params = array();

		// 使用哪个模板
		protected $template = 0;

		// 是否是强制选择的模板
		protected $forceTemplate = false;

		// 默认模板
		protected $defaultTemplates = [
	        'the {{name}} input:{{input}} does\'t pass the rule {{ruleName}}',
	    ];
		
		public function getMessages() {
			$this->buildParams();
			$this->buildTemplate();

			$templateStr = $this->defaultTemplates[$this->template];
			return self::display($templateStr, $this->params);
		}

		protected function buildTemplate() {
			if (!$this->forceTemplate) {
				$this->choseTemplate();
			}
		}
		public static function display($str, $params) {
			$patterns = array();
			$replaces = array();
			foreach ($params as $key => $value) {
				$patterns[] = '/'.'{{'.$key.'}}'.'/';
				$replaces = $value;
			}
			return preg_replace($patterns, $replaces, $str);
		}
		public function config($name, $params) {
			$this->name = $name;
			$this->params = $params;
		}

		public function setTemplate($template) {
			$this->template = $template;
			$this->forceTemplate = true;
		}
		protected function choseTemplate() {

		}
		public function setRuleName($ruleName) {
			$this->ruleName = $ruleName;
		}
		protected function buildParams() {
			$this->params['name'] = $name;
			$this->params['ruleName'] = $ruleName;
		}
		public function getName() {
			return $this->name;
		}
	}
?>