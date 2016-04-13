# 验证器思路
## 无论在何时，验证都是表单提交必不可少的环节，但是如果你已经为繁杂的if else感到厌烦，那么我们需要一个强大的验证器来帮助我们做这件事, 还有在做mis的时候，最麻烦的就是数据转化

数据转化:
===========
bool转化，前端传过来的是'True','False',转化为 1, 0
设置默认值,如果没有值，设置默认值
前端传过来的可能全是字符串，是否需要转化
图片: 转化为图片

###接口设计

对于整个接口来说:
===========
1. 是否登录
2. 是否tbs校验

对于单个数据来说:
===========
1. 是否是必须
2. 如果有数据才校验，没有数据也算通过

数据的基本类型:
===========
int number string bool

数据的扩展类型
===========
email tel id-card link version date date-time ip...

两个数据比较
=============
required_if()  //当某个字段满足某个值才校验
same  // 是否与某个字段相等，比如输入两次密码
gt    // 是否大于某个值

注释:
可以比较的类型: int number version date date-time ...

new V(array(
    '*name'=>'required|string|length[min(3),max(5)]',
    'xi'=>'required|int|in(1,2,3,6)',
    'friend'=>'array'
    'friend[]' => array(
        'name'=>'required'
    )
),60);

整个接口:tbs校验
        :是否登录
单个数据:required   
         基础类型:int float(0.2f) string bool number array file
         类型:tel email url version date datetime ip
         属性:number->value(min max minq maxq nq eq in between after)  string->length string->byte(min max minq maxq nq) file->size,type() array->length
         条件:required_if(field,value)  same(field)
         
对象(数组):可以递归  可以单个检验  可以统一检验类型和属性
*代表所有这个字段都必须验证这个规则