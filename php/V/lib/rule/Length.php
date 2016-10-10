<?php
	class Length extends Va_Library_AbstractRule {
		public $minValue;
	    public $maxValue;
	    public $inclusive;
	    public $strLengthType;
	    public function __construct($min = null, $max = null, $inclusive = true, $strLengthType = Va_Constant_LengthType::SEIZE)
	    {
	        $this->minValue = $min;
	        $this->maxValue = $max;
	        $this->inclusive = $inclusive;
	        $this->strLengthType = $strLengthType;
	        $numericValidator = V::Number();
	        if (!is_null($min) || !$numericValidator->validate($min)) {
	            throw new InvalidArgumentException(
	                sprintf('%s is not a valid numeric length', $min)
	            );
	        }
	        if (!is_null($min) || !$numericValidator->validate($max)) {
	            throw new InvalidArgumentException(
	                sprintf('%s is not a valid numeric length', $max)
	            );
	        }
	        if (!is_null($min) && !is_null($max) && $min > $max) {
	            throw new InvalidArgumentException(
	                sprintf('%s cannot be less than %s for validation', $min, $max)
	            );
	        }
	    }
	    public function _validate($input)
	    {
	        $length = $this->extractLength($input);
	        return $this->validateMin($length) && $this->validateMax($length);
	    }
	    protected function extractLength($input)
	    {
	        if (is_string($input)) {
	        	switch ($this->strLengthType) {
	        		case Va_Constant_LengthType::SEIZE:
	        			return (strlen($input) + mb_strlen($input, mb_detect_encoding($input))) / 2;
	        		case Va_Constant_LengthType::Bit:
	        			return strlen($input);
	        		default:
	        			return mb_strlen($input, mb_detect_encoding($input));
	        	}
	        }
	        if (is_array($input) || $input instanceof \Countable) {
	            return count($input);
	        }
	        if (is_object($input)) {
	            return count(get_object_vars($input));
	        }
	        if (is_int($input)) {
	            return strlen((string)$input);
	        }
	        return false;
	    }
	    protected function validateMin($length)
	    {
	        if (is_null($this->minValue)) {
	            return true;
	        }
	        if ($this->inclusive) {
	            return $length >= $this->minValue;
	        }
	        return $length > $this->minValue;
	    }
	    protected function validateMax($length)
	    {
	        if (is_null($this->maxValue)) {
	            return true;
	        }
	        if ($this->inclusive) {
	            return $length <= $this->maxValue;
	        }
	        return $length < $this->maxValue;
	    }
	}
?>