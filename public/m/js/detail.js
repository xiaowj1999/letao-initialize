$(function () {
  




    /*3  获取传递过来的id,获取商品详情数据渲染
         3.1 通过发封装好的查询url参数值的函数获取id参数的值
         3.2 请求API数据，根据id获取商品详情
         3.3 调用模板，将数据渲染在页面上 */
//     3.1 通过发封装好的查询url参数值的函数获取id参数的值
            var id = getQueryString("id");
            console.log(id);
            
    // 3.2 请求API数据，根据id获取商品详情
            $.ajax({
                url:'/product/queryProductDetail',
                data: {id: id},
                success:function (data) {
                        // console.log(data);
           //3.2.1 遍历尺寸数据，获取数据的最大值以及最小值
                    var min = data.size.split("-")[0]-0;
                    var max = data.size.split("-")[1]-0;
                    // console.log(min,max);
                    
                    data.size=[];
                    for(var i = min;i <= max;i++){

                            data.size.push(i);
                        
                    }
                    // console.log(data.size);
                    
        //3.3 调用模板，从而渲染在页面上
                    var html = template("detailTpl",data);
                    $("#main ul").html(html);
                    



      
                //1 轮播图自动轮播初始化代码
                var gallery = mui('.mui-slider');
                    gallery.slider({
                    interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
            });

                        
                //2 主体的区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });


                // //3 动态添加
                mui(".mui-numbox").numbox();


                //点击尺寸时，添加样式
                $(".btn-size").on("tap",function () {
                    
                    $(this).addClass("active").siblings().removeClass("active");
                })
                }

                
            })
            

            /**
             * 2 加入购物车
             *      1 当点击加入购物车的时候 获取 选择的尺寸数量信息
             *      2 判断尺寸和数量是否选择 如果没有选择 则出现提示框提示用户选择尺码和数量
             *      3 调用加入购物车的API出入当前商品id 尺码 数量 加入购物车
             *      4 调用API的时候 post 提交一般是post
             *      5 提交如果当前用户没有登录 提示用户去登录
             *      6 加入成功 提示用户是否去购物车查看
             * 
             */
            // 1 给购物车添加点击事件，同时获取尺寸数量信息等
            $(".btn-add").on("tap",function () {
                //获取当前的尺寸
                var size = $(".btn-size.active").data("size");
                // console.log(size);
                var num = $(".amount").val();
                // console.log(num);
               //2 判断尺寸和数量是否选择
               if(!size){
                     mui.toast('请选择你需要的尺码数',{ duration:'3000', type:'div' }) ;
                     return false;
               }
               if(num == 0){
                     mui.toast('请选择你要购买的数量',{ duration:'3000', type:'div' }) ;
                     return false;
               }
               //3 点击加入购物车，传入参数提交商品的id 尺码 数量，同时发送请求
               $.ajax({
                   url:'/cart/addCart',
                   type:"post",
                   data:{productId: id,num:num,size:size},
                   success:function (data) {
                      // 8. 提示用户是否去购物车查看
        				// 第一个参数是提示的内容 第二个参数是提示的标题 第三个参数是提示按钮的文字(数组)  第四个的回调函数 当点击按钮的后会触发的回调函数
        				
                      if(data.success){
                        mui.confirm('加入购物车成功！ 是否要去购物车查看?', 'hello 单身狗', ['去看','发呆','不看'], function(e){
        					// 获取当前用户点击了左边的还是右边
        					console.log(e);
        					if(e.index == 0){
                                //点击了左边 跳转到购物车查看
                                location="carList.html"
        					}else{
        						// 点击否就不看 表示还继续吗
        						mui.toast('你继续加一件就可以脱离单身了！', { duration: 3000, type: 'div' });
        					}
        				});
                      }else {
                           //9 如果错误 那么返回登录页面登录
                         // 9. 加入失败表示未登录  跳转到登录页面 指定当前登录成功要返回的页面 返回当前的详情页面
                         console.log(location);
                         // location = 'login.html?returnUrl='+'http://localhost:3000/m/detail.html?id=1';
                         // location.href 就是当前页面的url
                         location = 'login.html?returnUrl='+location.href;
                      }
                      
                   }
               })

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