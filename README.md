# get activites list
request params: 
userId: 用户ID
start: YYYYMM (选填)
end: YYYYMM(选填)

response: 请求参数为空，则返回最近三个月的活动。否则返回请求参数中时间范围内的活动。
[{
  id: '0',
  name: 'activity0ddddddddddddddddddddddddddddddddddddddddddddddd',
  address: '上海市黄浦区中山南路318号东方国际金融广场',
  start: '20180327',
  end: "20180327",
  enroll: "185",
  status: 0
},
...
]

# get one activity
request params:
id: 活动唯一标识符
userId: 用户ID

response:
{
	id: '0',
	name: 'activity0ddddddddddddddddddddddddddddddddddddddddddddddd',
	location: '东方国际金融广场',
	contact: '13817134049',
	address: '上海市黄浦区中山南路318号',
	start: '20180327',
	end: "20180327",
	enroll: "185",
	status: 0, // 0: 去参加 1：已报名 2：已结束 3：审核中
	desc: "策略会",
	content: Image, // image format
}

# apply activity
request params:
id: 活动唯一标识符,
userId: 用户ID

response:
{
	statusCode: 0成功，1失败，或其他错误码
}

# cancel application
request params:
id: 活动唯一标识符,
userId: 用户ID

response:
{
	statusCode: 0成功，1失败，或其他错误码
}

<!-- # confirm application
request params:
id: 活动唯一标识符,
userId: 用户ID

response:
{
	statusCode: 0成功，1失败，或其他错误码
} -->

# get 不同类别的活动
request params:
userId: 用户ID
start: YYYYMM (选填)
end: YYYYMM(选填)

response: start和end为空，则返回最近6个月参加的活动。否则返回请求参数中时间范围内的活动。
{
	<!-- 已报名 -->
	applied: [{
      id: '0',
      name: 'activity0ddddddddddddddddddddddddddddddddddddddddddddddd',
      address: '上海市黄浦区中山南路318号东方国际金融广场',
      start: '20180327',
      end: "20180327",
      enroll: "185",
      status: 1
	}],
	<!-- 已结束 -->
	ended: [{
      id: '0',
      name: 'activity0ddddddddddddddddddddddddddddddddddddddddddddddd',
      address: '上海市黄浦区中山南路318号东方国际金融广场',
      start: '20180327',
      end: "20180327",
      enroll: "185",
      status: 2
	}]
}

# 绑定个人信息
request params:
name: 姓名
comp: 公司
title: 职务
phone: 电话
userId: 第一次绑定为空

response: 
{
	code: 0提交成功，1提交失败
	userId，
}

# get 个人信息
request params:
userId

response: 
{
	name: 姓名
	comp: 公司
	title: 职务
	phone: 电话
	status: 个人信息审核状态
	total: 我的活动数量
}
#   d f y j - s p  
 