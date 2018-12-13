$(function () {

    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

      // 左侧数据
      $.ajax({
        url: "/category/queryTopCategory",
        success: function (data) {
            // var index = 0;
          var html = template("leftTpl",data);
        //   console.log(data);
          
            $(".category-left ul ").html(html)
        }
    })
    brandCate(1);
    //给左侧的每个a标签添加点击事件，如果放在外面写需要事件委托，因为他是一个
    //异步请求，在我请求还没完成时，他是不会有点击事件的
    $(".category-left ul").on("tap","li a",function () {
       var id = $(this).data("id");
       brandCate(id);
    //在点击过程中发送请求，从而请求右侧的数据
        //判断，当点击哪个a标签谁就添加active，然而其他兄弟则删除active
        $(this).parent().addClass("active").siblings().removeClass("active");
    })
    function brandCate(id) {
        $.ajax({
            url:"/category/querySecondCategory",
            data:{id:id},
            success:function (data) {
                // console.log(data);
                var html = template("rightTpl",data);
                $(".category-right ul").html(html);
            }
        })
    }
})