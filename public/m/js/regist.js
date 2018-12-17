$(function () {
    /**1 注册功能 
     *      1 获取表单中的内容 进行非空判断（mui验证代码）
     *      2 有很多个表单 如果挨个判断会很麻烦从而 获取所有表单 循环变量 只要有一个为空表示有错 提示用户输入
     *      3 获取用户输入所有信息
     *          验证手机是否合法等
     *      4 发送请求传入参数
     */
    //1 给注册添加点击事件
    var vCode = '';

    $(".btn-regist").on("tap", function () {
        //进行非空判断 从而获取表单元素中的数据
        var check = true;
        mui("#input_example input").each(function () {
            //若当前input为空，则alert提醒 

            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        }); //校验通过，继续执行业务逻辑 
        if (check) {
            // mui.alert('验证通过!')
            //获取表单元素 查看用户输入的信息是否合法等
            // 手机号
            var mobile = $('.mobile').val();
            /*^1 第一个位是1 
            [34578] 第二位是 3 4 5 7 8 中的一个
            \d{9}$ 9个数字 结尾*/
            if (!(/^1[34578]\d{9}$/.test(mobile))) {
                mui.alert("用户手机不合法!");
                return false;
            }
            // 获取用户名
            var username = $('.username').val();
            // 用户长度大于10 就不合法
            if (username.length > 10) {
                mui.alert("你的用户名太长了(要小于10位)!");
                return false;
            }
            // 获取密码和确认密码
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if (password1 != password2) {
                mui.alert("两次密码不一致!");
                return false;
            }
            // 获取当前输入的验证码  小写的vcode是当前用户的输入  全局变量大写vCode按钮获取
            var verify = $('.verify').val();
            console.log(verify);
            console.log(vCode);
            
            // 判断2个验证码不一致表示输入错误
            if (vCode != verify) {
                mui.alert("验证码输入有误!");
                return false;
            }
            // 发送请求 传入参数
            $.ajax({
                url: "/user/register",
                type: "post",
                data: { username: username, password: password1, mobile: mobile, vCode: vCode },
                success: function (data) {
                   if(data.success){
                       // 注册成功 提示用户注册成功 
            			mui.toast('注册成功');
            			// 如果注册成功就跳转到登录  希望登录成功去跳转到个人中心
            			location = 'login.html?returnUrl=userInfo.html';
                   }else {
                     mui.toast(data.message,{ duration:'long', type:'div' }) 
                   }

                }
            })

        }

    });


    //2 获取验证码功能
    //1 给获取验证码添加点击事件
    //2 发送请求,将获得的验证码直接渲染着在页面上
    //给获取验证码添加点击事件
    $(".btn-verify").on('tap', function () {
        //2 发送请求 获取传递过来的数据
        $.ajax({
            url: "/user/vCode",
            success: function (data) {
                // console.log(data);
                //将数据渲染在页面上
               $(".verify").val(data.vCode)
               vCode= data.vCode;
            }
        })
    });

})