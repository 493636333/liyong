<?php
	/**
	 * @file 取得基本数据类型的属性
	 * @date 2016-2-29
	 * @author liyong18
	 */
	require_once 'BaseType.php';
	class Property{
		static function value($input,$type) {

			// 可以取得值的数据类型
			$can_get_value_arr = array('int','string','int','number','bool');

			if(!is_string($type) || !in_array($type, $can_get_value_arr)){
				throw new Exception("type error in class Property::value", 1);
			}
			// 检验数据类型
			$res = call_user_func('BaseType::'.$type,$input);
			if (!$res) {
				
			}
		}
	}
?>