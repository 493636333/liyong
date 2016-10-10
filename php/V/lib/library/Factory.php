<?php
	class Va_Library_Factory
	{
	    public static $rulePrefixes = array(
	    	'0' => VALIDATEOR_RULE,
	    );
	    const SUFFX = '.php';
	    
	    public static function getRulePrefixes()
	    {
	        return self::$rulePrefixes;
	    }
	    private static function filterRulePrefix($rulePrefix)
	    {
	        $namespaceSeparator = DIRECTORY_SEPARATOR;
	        $rulePrefix = rtrim($rulePrefix, $namespaceSeparator);
	        return $rulePrefix.$namespaceSeparator;
	    }
	    public static function appendRulePrefix($rulePrefix)
	    {
	        array_push($this->rulePrefixes, selef::filterRulePrefix($rulePrefix));
	    }
	    public static function prependRulePrefix($rulePrefix)
	    {
	        array_unshift($this->rulePrefixes, selef::filterRulePrefix($rulePrefix));
	    }
	    public static function rule($ruleName, array $arguments = [], $name = '')
	    {
	        if ($ruleName instanceof Va_Interface_Rule) {
	            return $ruleName;
	        }
	        foreach (self::getRulePrefixes() as $prefix) {
	        	$className = ucfirst($ruleName);
	            $strFile = $prefix.$className.self::SUFFX;
	            if (!file_exists($strFile)) {
	            	continue;
	            }
	            require_once $strFile;
	            if (!class_exists($className)) {
	            	//Bingo_Log::warning('factory rule '.$className.' error,have file,but not have class');
	            	continue;
	            }
	            $reflection = new ReflectionClass($className);
	            if (!$reflection->isSubclassOf('Va_Library_AbstractRule')) {
	                throw new InvalidArgumentException(sprintf('"%s" is not a valid rule, is not subclassof Va_Library_AbstractRule', $className));
	            }
	            $rule = $reflection->newInstanceArgs($arguments);
	            if ('' !== $name) {
	            	$rule->setName($name);
	            }
	            return $rule;
	        }
	        throw new InvalidArgumentException(sprintf('"%s" is not a valid rule name', $ruleName));
	    }
	}
?>