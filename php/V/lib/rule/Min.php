<?php
	class Min extends Va_Rule_AbstractInterval {

		// false:可以使用字符串   true:只能使用int
		protected function _validate($input) {
			if ($this->inclusive) {
	            return $this->filterInterval($input) >= $this->filterInterval($this->interval);
	        }
	        return $this->filterInterval($input) > $this->filterInterval($this->interval);		
    	}
	}
?>