<?php
abstract class Va_Rule_AbstractInterval extends Va_Library_AbstractRule
{
    public $interval;
    public $inclusive;
    public function __construct($interval, $inclusive = true)
    {
        $this->interval = $interval;
        $this->inclusive = $inclusive;
    }
    protected function filterInterval($value)
    {
        if (!is_string($value) || is_numeric($value) || empty($value)) {
            return $value;
        }
        if (strlen($value) == 1) {
            return $value;
        }
        try {
            return new DateTime($value);
        } catch (Exception $e) {
        }
        return $value;
    }
}
?>