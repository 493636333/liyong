<?php
	class Bool extends Va_Library_AbstractRule
	{
	    public $bolForce = false;
	    public function __construct($bolForce = false) {
	    	$this->bolForce = $bolForce;
	    }
	    protected function _validate($input)
	    {
	        if ($this->bolForce) {
	        	return $this->validateType($input);
	        }
	        return $this->validateVal($input);
	    }

	    protected function validateType($input) {
	    	return is_bool($input);
	    }

	    protected function validateVal($input) {
	    	return is_bool(filter_var($input, FILTER_VALIDATE_BOOLEAN));
	    }
	}
?>