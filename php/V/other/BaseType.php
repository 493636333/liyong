<?
	class BaseType{
		static function required($input) {
			if (!isset($input) || $input === "") {
				return false;
			}
			return true;
		}

		// 由于表单取到的是string，json取到的可能是int,所以先转化
		static function int($input) {
			if (is_int($input)) {
				return true;
			}
			else if (is_string($input) && (string)intval($input) === $input) {
				return true;
			}
			return false;
		}

		// 这里的number包含了int和float
		static function number($input) {
			if (is_float($input) || self::int($input)) {
				return true;
			}
			else if (is_string($input) && (string)float($input) === $input) {
				return true;
			}
			return false;
		}

		// 这里的bool包括 true:false; 1:0; '1':'0'; 'true':'false'
		static function bool($input) {
			if(is_bool($input)){
				return true;
			}
			else if (is_string($input)) {
				if($input === '0' || $input === '1') {
					return true;
				} else {
					$input = strtolower($input);
					if($input === 'true' || $input === 'false') {
						return true;
					}
				}
				
			}
			return false;
		}

		static function string($input) {
			if (is_string($input) && $input !== '') {
				return true;
			}
			return false;
		}

		// 这里的array是值key为数字的array
		static function array($input) {
			if (is_array($input)) {
				foreach ($input as $key => $value) {
					if(!self::int($key)){
						return false;
					}
				}
				return true;
			}
			return false;
		}

		// 这里的object是key不为数字的array
		static function object($input) {
			if (is_array($input)) {
				foreach ($input as $key => $value) {
					if(!self::int($key)){
						return true;
					}
				}
				return false;
			}
			return false;
		}
	}
?>