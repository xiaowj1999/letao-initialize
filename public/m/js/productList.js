$(function () {
    //主体区域的滚动
    // mui('.mui-scroll-wrapper').scroll({
    //     deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    // });
     


    //1 商品搜索功能

    //1.1 获取传递过来需要查询的数据，从而获取url参数的方式
        var search= getQueryString('search');
        console.log(search);
    //1.2 根据当前搜索的关键字去调用API搜索商品列表
    queryProduct()
     
    /*2 商品列表的商品搜索功能
        2.1 给搜索按钮注册一个点击事件，同时获取搜索框中的内容
        2.2 做非空判断
        2.3 调用API传入当前要搜索的商品关键字
        2.4 接受返回的商品数据 调用模板同时渲染在页面上
    */
    //2.1 给搜索按钮注册一个点击事件，同时获取搜索框中的内容
    $(".btn-search").on("tap",function () {
        // 获取当前输入框中的值，从而覆盖全局变量的值
        search = $("form input").val();
        if(!search.trim()){
            alert("请输入你需要的商品名称");
            return;
        }
        // console.log(search);
        //调用模板渲染到页面上
        queryProduct();

    })










    
    /*5. 点击立即购买跳转到商品详情去购买商品
	    1. 给所有购买按钮添加点击事件
	    2. 获取当前点击商品id 
	    3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
	    */
	 // 1. 给所有购买按钮添加点击事件
	 $('.sale-content').on('tap','.btn-buy',function () {
        // 2. 获取当前点击商品id 
        var id = $(this).data('id');
        // 3. 使用location跳转商品详情页面  把id作为参数传递到商品详情
        location = 'detail.html?id='+id;
});

        //发送请求包装函数
        function queryProduct() {
            $.ajax({
                url:"/product/queryProduct",
                data:{page:1,pageSize:4,proName:search},
                success: function (data) {
                   // console.log(data);
                    //1.3 创建一个模板，调用模板，从而渲染到页面上
                    var html = template("productTpl",data);
                    $(".sale-content ul").html(html);
                }
            })
        }

        //1.1.1 如果不考虑传递多个参数时，则可以直接用=号分割,如果有中文会有乱码问题要使用decodeURL转码
            // var search = location.search.split("=")[1];
            // console.log(decodeURI(search));
        //1.1.2 如果看多个参数 要获取指定的参数 推荐使用正则匹配
         //根据url参数名取值
         function getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = decodeURI(window.location.search.substr(1).match(reg));
            if(r != null){
                return decodeURI(r[2]);
            }
            return null;
        }

})