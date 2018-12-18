$(function () {
    //1 查询购物车带分页 动态添加商品信息
    getQuery()


    //2 下拉刷新和上拉加载初始化
    //定义一个变量
    var page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            //初始化下拉
            down: {
                
                callback: function () {
                    //模拟请求网络延迟
                    setTimeout(function () {
                        //下拉刷新发送请求
                        getQuery();
                        //注意，加载完新数据后，必须执行如下代码，注意：若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;

                    }, 1000)   
                }
            },
            up: {
                callback: function () {
                    setTimeout(function () {
                        page++;
                        //请求page后 获得更多的数据
                        $.ajax({
                            url: "/cart/queryCartPaging",
                            data: { page: page, pageSize: 4 },
                            success: function (data) {
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    // 注意页面刚刚加载请求数据 可能没有数据 也要把数据处理成一个对象 
                                    console.log(data instanceof Array);
                                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('carbuyTpl', data);
                                        // 渲染到购物车列表的容器里面
                                        $('.cart-list').append(html);

                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {

                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);

                                    }
                                    // console.log(data);

                                }
                            }
                        })
                    }, 1000)
                }
            }
        }
    });


    // 计算价格，给每个复选框添加change事件,由于是动态添加我们需要用到事件委托;
    $(".cart-list").on("change", ".choose", function () {
        //遍历被选择的复选框 获取数量与价格
        var sum = 0;
        $(".choose:checked").each(function (index, value) {
            var price = $(this).data("price");
            var num = $(this).data("num");
            //计算价格将数据渲染在页面上
            var count = price * num;
            sum += count;
        })
        // 利用js代码计算 现将数值x100，然后取整，在除以100从而渲染在页面上
        sum = parseInt(sum * 100) / 100;
        // console.log(sum);
        $(".order-total span").html(sum);
    })

    //点击删除按钮显示提示框
    $(".cart-list").on("tap", ".btn-delete", function () {
        var that = this;
        mui.confirm("你确定要将它移除你的购物车吗？", "温馨提示", ["确认", "取消"], function (e) {
            // console.log(e);
            if (e.index == 0) {
                //当点击确认时 我们需要获取参数id 同时发送请求
                var id = $(that).data("id");
                //发送请求
                $.ajax({
                    url: "/cart/deleteCart",
                    data: { id: id },
                    success: function (data) {
                        if (data.success) {
                            //删除成功则刷新当前页重新调用请求
                            getQuery()
                        } else {
                            //如果点击取消 那么他会恢复原状
                            mui.swipeoutClose($(that).parent().parent()[0]);
                        }
                    }
                })
            } else if (e.index == 1) {
                // console.log($(that).parent().parent()[0]);

                //如果点击取消 那么他会恢复原状
                mui.swipeoutClose($(that).parent().parent()[0]);
            }

        })
    })

    //点击编辑按钮显示提示框
    $(".cart-list").on("tap",".btn-edit",function () {
        var that = this;
        //1 创建模板 将模板渲染在提示框上
            var product = $(this).data("product");//将所有的信息存储在编辑按钮上，从而使用data()方法取出来
            //2 遍历所有的尺寸 将尺寸以数组的方式展现出来
            var min = product.productSize.split("-")[0]-0;
            var max = product.productSize.split("-")[1]-0;
            // console.log(min,max);
            product.productSize =[];
            for(var i = min ;i<=max;i++){
                product.productSize.push(i);
            }
        //3 调用生成模板
        var html= template("editTpl",product);
            //因为生成的模板中存在空格以及换行 所以我们在渲染上去时应该先去掉空格以及换行
            html = html.replace(/[\r\n]/g,""); 
        
            mui.confirm(html, "编辑", ["确认", "取消"], function (e) {
                //当我们点击确认时 我们需要发送请求 同时传入参数id 尺寸 和数量
               if(e.index == 0){
                var id = $(that).data("id");
                //发送请求
                $.ajax({
                    url:'/cart/updateCart',
                    type:"post",
                    data:{
                        id:id,
                        size:$(".btn-size.active").data("size"),
                        num:  mui(".mui-numbox").numbox().getValue(product.num)
                    },
                    success:function (data) {
                        // console.log(data);
                        //如果编辑成功就刷新页面，则重新调用函数发送请求
                        getQuery()
                        
                    }
                });
               }else {
                   //如果点击取消则恢复原来样式
                   mui.swipeoutClose($(that).parent().parent()[0]);
               }
            })
        
        //4 渲染模板完成后 我们需要对进行初始化,同时设置原有选择数量
             mui(".mui-numbox").numbox().setValue(product.num);  

        //5 给每个尺寸添加点击事件
        $(".btn-size").on("tap",function () {
            
             $(this).addClass("active").siblings().removeClass("active");
        })
    })


    function getQuery() {
        $.ajax({
            url: "/cart/queryCartPaging",
            data: { page: 1, pageSize: 4 },
            success: function (data) {
                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                if (data.error) {
                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    // 注意页面刚刚加载请求数据 可能没有数据 也要把数据处理成一个对象 
                    console.log(data instanceof Array);
                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                    if (data instanceof Array) {
                        data = {
                            data: data
                        }
                    }
                    console.log(data);
                    // 调用模板方法生成html
                    var html = template('carbuyTpl', data);
                    // 渲染到购物车列表的容器里面
                    $('.cart-list').html(html);
                }
            }
        });

    }
})