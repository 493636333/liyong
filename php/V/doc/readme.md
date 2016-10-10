
# V验证库介绍

## 项目介绍

### 背景
#### 例子1：
### 存在问题
1.  基本属于刀耕火种
2. 开发效率低
3. 验证效果差
### 场景模拟1
#### 栗子
验证一个用户名，不包含特殊字符，并且长度6-8
#### V解决方案1
```
	$v = V::noSpecial()->length(6,8);
	$v->validate($a)
```
#### V解决方案2
```
	$v = V::readParam('noSpecial', array('length', 6, 8));
	$v->validate($a)
```
### 场景模拟2
#### 栗子
有一个用户表单填写:
name: string,长度6-8，不能含有特殊字符
birthday:日期格式'y-m-d',最大不能超过今天
email:邮箱
portrait：用户头像，一个有效的url
tel: 电话号码，一个11位的数字
password: 密码，英文加数字,5到6位
passwordC:确认密码，必须与password相等
graduationDate: 毕业日期，不能小于出生日期,也不能比今天大
#### V解决方案1:
```	
$config = array(
		'name'=>array('string', array('length', 6, 8), 'nonSpecial'),
		'birthday'=>'birthday',
		'email'=>'email',
		'portrait'=>'url',
		'tel'=>'tel',
		'password'=> array('nonSpecial', array('length', 5, 6)),
		'passwordC'=>array('equal',':password'),
		'graduationDate' => array('birthday', array('min',':birthday'))
	)
	$v = V::readParam($config);
	$v->validate($arr1);
	$v->validate($arr2);
```
#### V解决方案2:
```
	$v = 
	V::param('name'=>V::string()->length(6,8)->nonSpecial())
	 ->param('birthday'=>V::birthday())
	 ->param('email'=>V::email())
	 ->param('portrait'=>V::url())
	 ->param('tel', V::tel())
	 ->param('password', V::nonSpecial()->length(5,6))
	 ->param('passwordC', V::equal(':password'))
	 ->param('graduationDate', V::birthday()->min(':birthday'));
	$v->validate($arr1);
	$v->validate($arr2);
```
##### 每次都写，太麻烦
自定义类型
```
	class People extends Va_Library_AbstractRules {
		public function __construct(){
			$v = .....;
			$this->appendRule($v);
		}
	}
	$v = V::people();
	$v->validate($arr1);
```
### 场景模拟3
#### 栗子
与场景2一样，但是10个用户
#### V解决方案1:
```
	$tempConfig = array(
		'name'=>array('string', array('length', 6, 8), 'nonSpecial'),
		'birthday'=>'birthday',
		'email'=>'email',
		'portrait'=>'url',
		'tel'=>'tel',
		'password'=> array('nonSpecial', array('length', 5, 6)),
		'passwordC'=>array('equal',':password'),
		'graduationDate' => array('birthday', array('min',':birthday'))
	);
	$conig = array(
		array('length', 10, 10), 
		array('*' => $tempConfig),
	);
	$v = V::readParam($config);
	$v->validate($arr1);
	$v->validate($arr2);
```
#### V解决方案2:
```
	$tempV = 
	V::param('name'=>V::string()->length(6,8)->nonSpecial())
	 ->param('birthday'=>V::birthday())
	 ->param('email'=>V::email())
	 ->param('portrait'=>V::url())
	 ->param('tel', V::tel())
	 ->param('password', V::nonSpecial()->length(5,6))
	 ->param('passwordC', V::equal(':password'))
	 ->param('graduationDate', V::birthday()->min(':birthday'));
	$v = V::every(tempV)->length(10,10);
	$v->validate($arr1);
	$v->validate($arr2);
```
### 不仅如此

```
	V::param(
		'name'=>V::noSpecial(),
		'age'=>V::naturalNum(),
		'friends'=>V::length(10,10)
		'friends'=>V::param(
			'name'=>V::noSpecial(),
			'age'=>V::naturalNum(),
			'friends'=>V::param(
				'name'=>V::noSpecial(),
				'age'=>V::naturalNum(),
			)
		)
	)
```
任何数据结构都能校验
```
	$array = array(
		'friends' =>array(
			array('name'=>'a', 'age'=>11)
			array('name'=>'b', 'age'=>12)
		),
		'address'=>array(
			'home' => '西二旗',
			'scholl'=>'西三旗'
		)
	);
	$config = array(
		'friends.*.name'=>V::noSpecial(),
		'address.home'=>
		'address.school'=>
	)
```
### 还想做什么
1. 继续完善数据类型，把所有基础的数据类型全部收敛
2. 自动转化数据类型，校验后直接拿到转化后的数据，比如字符截取等
3. 自定义错误信息，哪里校验没通过，会返回错误信息
4.  与action结合，参数错误直接返回，拿到的都是转化后的数据，可以放心用，不用再做数据校验。
5. action会定义许多其它的全局校验，比如tbs校验，登录校验等

### 预期效果

1. 将大大减少代码量
2. 并且校验相对较严格
3. 减少脏数据
4. 减少数据库压力