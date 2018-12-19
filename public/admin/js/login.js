$(function () {
    /**1 登录页面验证
     *      1 点击登录获取表单中输入的内容
     *      2 传入参数，发送API请求
     */
    //给登录按钮添加点击事件
    $(".btn-login").on("click", function () {
        var check = true;
        mui(".login-form input").each(function () {
            //若当前input为空，则alert提醒 
        if (!this.value || this.value.trim() == "") {
               
                // 1.3 获取输入框上一个兄弟span元素
                var span = this.previousElementSibling;
                // 1.4 把label元素里面的文字拼接到提示框里面
                alert(span.innerText + "不允许为空");
                // 1.5 有为空 表示未通过 把 check变成false
                check = false;
                return false;
            }
        });
        if (check) {
            //校验通过，继续执行业务逻辑 
            var userName = $(".userName").val().trim();
            var password = $(".password").val().trim();
            // console.log(userName,password);

         //3 发送请求
            $.ajax({
                url: "/employee/employeeLogin",
                data:{
                    username:userName,password:password,
                },
                type:"post",
                success: function (data) {
                    console.log(data);

                }
            })
            }

    })
})