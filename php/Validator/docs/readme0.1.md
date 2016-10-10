单个数据:
v::int()->between(1,2).validate(4)  // 返回true或者Exception

// 多个数据，array

v::rules(array(
	'name' => v::required() -> string() -> length(0, 1) -> deep(),
	'friends' => v::array()->length(5) ->deep() -> rules (
					'names' -> true,
					'friends' -> true
				)
),v::filter(
	'sex' => v::boolen()
	''
),array)


// 整个接口校验, 默认校验到错误就不往后校验，可以设置全部校验
v::page()->tabs(10)->login()->request(
	array(
		'name' => v::string()->length(1)->filter()->default('4'),
		'sex' => v::boolen(1)->filter()->parse(1)
		'friends' => v::array()->length(4)->one(
			array(
				'name' -> true
			)
		) 
	)
);

// 一个array校验,指对象
var a = v::param(
	array(
		'name' => v::string()->length(1)->filter()->default('4'),
		'sex' => v::boolen(1)->filter()->parse(1),
		'age' => v::int()->gt('param', 1)
		'friends' => v::array()->length(4)->one(
			array(
				'name' -> true
			)
		) 
	)
).validate($arr);

// 结果只可能有两个
a.result = true / false

// 如果为true,返回一个转化后的array
a.getParseResult()

// 如果为false,返回一个错误信息的array
//错误信息的模式:
1.只返回一个错误信息,string
2.每个字段返回一个错误信息，一维数组
3.所有错误信息全部返回
a.getMessages()