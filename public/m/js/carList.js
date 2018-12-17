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
                        //没有更多内容了，endPulldown 传入true， 不再执行下拉刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
                        //下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        //同时page也要重置
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