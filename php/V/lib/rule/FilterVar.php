<?php
	class FilterVar extends Va_Library_AbstractRule
	{
	    $filter = null;
	    public function __construct()
	    {
	        $arguments = func_get_args();
	        if (!isset($arguments[0])) {
	            throw new InvalidArgumentException('Cannot validate without filter flag');
	        }
	        if (!$this->isValidFilter($arguments[0])) {
	            throw new InvalidArgumentException('Cannot accept the given filter');
	        }
	        $filter = $arguments[0];
	    }

	    public function _validate($input) {
	    	return filter_var($input, $this->$filter) !== false;
	    }

	    protected function isValidFilter($filter)
	    {
	        return in_array(
	            $filter,
	            [
	                FILTER_VALIDATE_BOOLEAN,
	                FILTER_VALIDATE_EMAIL,
	                FILTER_VALIDATE_FLOAT,
	                FILTER_VALIDATE_INT,
	                FILTER_VALIDATE_IP,
	                FILTER_VALIDATE_REGEXP,
	                FILTER_VALIDATE_URL,
	            ]
	        );
	    }
	}
?>