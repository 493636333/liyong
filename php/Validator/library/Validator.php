<?php
	require_once 'Interface/RuleInterface.php';
	require_once 'Rules/AbstractRule.php';
	require_once 'Exceptions/CommonException.php';

	define('VALIDATEOR_ROOT', dirname(__FILE__).DIRECTORY_SEPARATOR);

	// 单个数据校验的Validator类
	class Validator extends AbstractCompsite {

		// 还没有生成的rule,主要用在ArrayValidator中，多个key互相比较
		protected $notBuildRules = array();

		public static function __callStatic($ruleName, $arguments = array()) {
			$validator =  self::create();
			$validator->addRule($ruleName, $arguments);
			return $validator;
		}

		public function __call($ruleName, $arguments = array()){
			$this->addRule($ruleName, $arguments);
			return $this;
		}

		public function addRule($ruleName, $arguments) {
			foreach ($variable as $key => $value) {
				if (strpos($value, ':') === 0) {
					$this->$notBuildRules[$ruleName] = $arguments;
					return $this;
				}
			}
			parent::addRule($ruleName, $arguments);
			return $this;
		}

		/**
		 * 是否需要build,用在ArrayValidator中
		 * @return bool
		 */
		public function getIfNeedBuildRule() {
			return count($this->notBuildRules) > 0;
		}

		/**
		 * 把没有build的rule生成完成
		 * @return $this
		 */
		public function buildLeftRule(Array $input) {
			foreach ($this->notBuildRules as $ruleName => $arguments) {
				foreach ($arguments as $key => $value) {
					if (strpos($value, ':') === 0) {
						$value = substr($value, 1);
						if (isset($input[$value])) {
							$arguments[$key] = $input[$value];
						}
					}
				}
				parent::addRule($ruleName, $arguments);
			}
		}
	    public static function buildRule($ruleName, $arguments = array(), $name = '') {
	    	$ruleName = ucfirst($ruleName);
	    	$ruleFile = VALIDATEOR_ROOT.'Rules'.DIRECTORY_SEPARATOR.$ruleName.'.php';

			if (!file_exists($ruleFile)) {
				throw new Exception('not have rule:'.$ruleName);
			}

			require_once $ruleFile;

			$reflection = new ReflectionClass($ruleName);
			if (!$reflection->isSubclassOf(RuleInterface)) {
				throw new Exception('the rule '.$ruleName.' must impletes RuleInterface');
			}

			
			$rule = $reflection->newInstanceArgs($arguments);
			$rule->setName($name);
			return $rule;
		}

		public static function create() {
			return new static();
		}

		public static function param($key, RuleInterface $v) {
			$validator = new ArrayValidator();
			$validator->param($key, $v);
			return $validator;
		}
	}
?>