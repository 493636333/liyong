<?php
	class Between extends Va_Library_AbstractRules {
		public $minValue;
	    public $maxValue;
	    public function __construct($min = null, $max = null, $inclusive = true)
	    {
	        $this->minValue = $min;
	        $this->maxValue = $max;
	        if (!is_null($min) && !is_null($max) && $min > $max) {
	            throw new InvalidArgumentException(sprintf('%s cannot be less than  %s for validation', $min, $max));
	        }
	        if (!is_null($min)) {
	            $this->appendRule(V::min($min, $inclusive));
	        }
	        if (!is_null($max)) {
	            $this->appendRule(V::max($max, $inclusive));
	        }
	    }

	    protected function _validate($input) {
	    	return $this->_validateRulesNoInterrupt($input);
	    }
	}
?>