<?php
	class Va_Library_Result {
		public $no = 0;
		public $error = '';
		public $data = '';

		public function __construct($no = 0, $error = '', $data = '') {
			$this->no = $no;
			$this->error = $error;
			$this->data = $data;
		}
	}
?>