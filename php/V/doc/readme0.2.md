v::number()->between(1,2)->validate($input);

$userValidator = v::attribute('name', v::stringType()->length(1,32))
                  ->attribute('birthdate', v::date()->age(18))
                  ->attribute('friends', v::array()->length(5)->attribute('name'))



1. 单个validator: v::int()->between(1,5)
   assert: array('name must be int')
   check: array('name must be int')
   validate: true  false
2. 带前置校验的validator: v::even()->between(4,10)
	assert: array('name must be int')
	check: array('name must be int')
3. 带param的校验器: v::param('age', v::int()->between(3, 7))
					->param('name', v::username())
	assert: array(
				'age'=>'age must be int'
				'name'=> 'name must be username'
			)
	check: array(
				'age'=>'age must be int'
			)
	validate: true  false