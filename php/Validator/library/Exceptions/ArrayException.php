<?php
	class ArrayException extends InvalidArgumentException{
		protected $exceptions = array();

		public function setRelated(Array $array) {
			$this->exceptions = array_merge($this->exceptions, $array);
		}

		public function getMessages() {
			$messages = array();
			foreach ($this->exceptions as $key => $value) {
				$messages[$value->getName()] = $value->getMessages();
			}
			return $messages;
		}
		public function isError() {
			return count($this->exceptions) > 0;
		}
	}
?>