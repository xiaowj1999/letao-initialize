$(function () {
    /*1 实现登录功能
        1 给登录按钮添加点击事件，同时获取表单中的用户名和密码，
        2 非空判断，判断用户名和密码是否输入完整
        3 发送请求判断用户名和密码是否存在
    */
    // 1 给登录按钮添加点击事件
    $(".btn-login").on("tap",function () {
        var userName = $(".userName").val().trim();
        var password = $(".password").val().trim();
        // console.log(userName,password);
        
        // 2 非空判断，判断用户名和密码是否输入完整
        if(!userName){
            mui.alert( "请正确输入用户名", "温馨提示","知道了");
            return false;
        }
        if(!password){
            mui.alert( "请正确输入密码", "温馨提示","知道了" );
            return false;
        }

        //3 发送请求，判断用户名和密码是否输入正确
        $.ajax({
            url:"/user/login",
            type:"post",
            data:{username:userName,password:password},
            success:function (data) {
                //4 判断用户是否登录
                if(data.success){
                   //成功返回到上一页去购买
                //    history.back();
                    //登录成功返回一个指定的页面 从哪里跳转的我不关心 我只关心我登录后跳转去哪里
                   // 6.1 接收当前登录成功需要返回的地址
                   var returnUrl = getQueryString('returnUrl');
                   // 6.2 接收了当前需要返回的地址后 手动跳到这个地址
                   // location = 'http://localhost:3000/m/detail.html?id=2';
                   location = returnUrl;

                }else {
                    //失败提示用户失败的原因
                    mui.toast(data.message, { duration: 'long', type: 'div' })
                }
                
                
            }
        })
    })


    /*2 如果还没有用户名和密码，那么点击注册获得用户名和密码
        1 点击注册按钮，则跳转页面到注册页面
        
    */
    // 1 点击注册按钮，则跳转页面到注册页面
    $(".btn-regist").on("tap",function () {
        location="regist.html";
    })
    

    
     // 根据url参数名取值
     function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
})