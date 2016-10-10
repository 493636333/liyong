<?php
	/**
	 * @file 数据校验类，对外提供的统一类
	 * @author liyong
	 * @date 2016-8-26
	 */

	define('VALIDATEOR_ROOT', dirname(__FILE__).DIRECTORY_SEPARATOR);
	define('VALIDATEOR_RULE', VALIDATEOR_ROOT.'rule'.DIRECTORY_SEPARATOR);
	class V {
		public static function addRulePath($path) {
			Va_Library_Factory::prependRulePrefix($path);
		}
		public static function __callStatic($ruleName, $arguments = array()) {
			$validator = new Va_Library_Validator();
			$validator ->addRule($ruleName, $arguments);
			return $validator;
		}

		public static function readParam() {
			$arrRules = array();
			$args = func_get_args();
			$argsCount = count($args);
			if ($argsCount > 1) {
				$arrRules = $args;
			} elseif (1 === $argsCount) {
				if (is_string($args[0])) {
					$arrRules = array($args[0]);
				} else {
					$arrRules = $args[0];
				}
			} else {
				throw new Exception("readParam arguments error", 1);
			}

			$validator = new Va_Library_Validator();

			foreach ($arrRules as $key => $value) {

				// 如果已经到具体的策略了
				if (is_int($key)) {
					return $validator->addRules($arrRules);
				}
				// 如果是every和param
				$arrKeys = explode('.', $key);
				$countKeys = count($arrKeys);

				$firstKey = array_shift($arrKeys);
				if ($countKeys > 1) {
					if('*' === $firstKey) {
						$validator->every(self::_readParam(implode('.', $arrKeys), $value));
					} else {
						$validator->param($firstKey, self::_readParam(implode('.', $arrKeys), $value));
					}
				} elseif (1 === $countKeys) {
					if('*' === $firstKey) {
						$validator->every(self::readParam($value));
					} else {
						$validator->param($firstKey, self::readParam($value));
					}
				}
			}

			return $validator;
		}

		public static function _readParam($key, $value) {
			$arrKeys = explode('.', $key);
			$countKeys = count($arrKeys);
			$validator = new Va_Library_Validator();
			$firstKey = array_shift($arrKeys);
			if ($countKeys > 1) {
				if('*' === $firstKey) {
					$validator->every(self::_readParam(implode('.', $arrKeys), $value));
				} else {
					$validator->param($firstKey, self::_readParam(implode('.', $arrKeys), $value));
				}
			} elseif (1 === $countKeys) {
				if('*' === $firstKey) {
					$validator->every(self::readParam($value));
				} else {
					$validator->param($firstKey, self::readParam($value));
				}
			}
			return $validator;
		}
	}
?>