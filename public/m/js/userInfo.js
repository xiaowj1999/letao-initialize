$(function () {
    /* 
	1 查询用户的信息 更新用户名和手机号
		1. 页面加载的时候马上请求查询用户信息的API
		2. 查询成功就渲染到用户名和手机号的里面
    */
    $.ajax({
        url:'/user/queryUserMessage',
        success:function (data) {
            console.log(data);
			// 拿到数据后判断是否成功 
			if(data.error){
				// 如果失败就表示未登录 跳转到登录页面 当登录完成后返回当前页面
				// 登录拦截 我通过一些API请求 拿到结果 
				// 结果里面有报错 提示未登录的 不让用户在继续加载当前页面 而是跳转到登录页面去登录
				location = 'login.html?returnUrl='+location.href;
			}else{
				// 没有失败就表示成功 成功就渲染用户名和手机号
				$('.username').html(data.username);
				$('.mobile').html(data.mobile);
			}
        }
    });

    /*
    2 给退出按钮添加点击事件 */
    $(".btn-back").on("tap",function () {
        $.ajax({
            url:"/user/logout",
            success:function (data) {
                // console.log(data);
                if(data.success){
                   // location.href 就是当前个人中心页面的url
					location = 'login.html?returnUrl='+location.href;
                }
                
            }
        })
    })
})