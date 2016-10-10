<?
	class Json extends Va_Library_AbstractRule {
		protected function _validate($input) {
			if(!is_string($input)) {
				return false;
			}
			return !is_null(json_decode($input));
		}
	}
?>