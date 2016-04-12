<?php
	/**
	 * @file 最基本的校验
	 * @author liyong 493636333@qq.com
	 * @date 2016-4-12
	 */
	class Base {

		// 验证是否是空
		static function required($input) {
			if(empty($input)) {
				return false;
			}
			return true;
		}

		
		static function sometimes($input) {

		}
	}
?>