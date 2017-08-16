<?php
	class Date extends Va_Library_AbstractRule
	{
	    public $formatType;
	    public $strFormat;
	    public function __construct($formatType = Va_Constant_Date::AUTO, $strFormat = '') {
	    	$this->formatType = $formatType;
	    	$this->strFormat = $strFormat;
	    }
	    protected function _validate($input)
	    {
	        try {
	        	$date = new DateTime($input);
		        switch ($this->formatType) {
		        	// 时间戳
		        	case Va_Constant_Date::TIMESTAMP:
		        		return $date == $input;
		        	case Va_Constant_Date::FORMAT_LINE:
		        		$this->strFormat = 'Y-m-d';
		        		break;
		        	case Va_Constant_Date::FORMAT_SLANT:
		        		$this->strFormat = 'Y/m/d';
		        		break;
		        	case Va_Constant_Date::PERSONAL:
		        		break;
		        	case Va_Constant_Date::AUTO:
		        		return true;
		        	default:
		        		return false;
		        }
		        if (is_string($this->strFormat) && '' !== $this->strFormat) {
		        	return date($this->strFormat, $date) == $input;
		        }
		        return false;

	    	} catch(Exception $e) {
	    		return false;
	    	}
	    }
	}
?>