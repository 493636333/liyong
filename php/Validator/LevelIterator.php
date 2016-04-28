<?
	/**
	 * @file 优先级迭代器，优先级高的先被执行到
	 * @author liyong(493636333@qq.com)
	 * @date 2014-04-19
	 */
	
	require_once 'Interface/LevelInterface';
	class LevelIterator {

		// 当前位置
		protected $position;
		
		// 传入数组的长度
		protected $count;

		// 构造函数传入的数组
		protected $arr;

		public function __construct($array){
		    $this->arr = $array;
		    $this->count = count($array);
			$this->postion = 0;

		    usort($this->arr, array($this, 'mySort'));
		}
		public function rewind(){
		    $this->position = 0;
		}
		public function valid(){
		    return $this->position <= $count;
		}
		public function key(){
		    return $this->position;
		}
		public function current(){
			return $this->arr[$this->position];
		}
		public function next(){
		    return ++$this->position;
		}
		public function mySort($a, $b) {
			if ($a instanceof LevelInterface && $b instanceof LevelInterface) {
				return $a->getLevel() > $b->getLevel() ? 1 : -1;
			} else {
				throw new Exception('LevelIterator need a array that every element implements LevelInterface'); 
			}
		}
	}
?>

1 5 7 5