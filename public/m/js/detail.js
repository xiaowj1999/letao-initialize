$(function () {
    
    //1 轮播图自动轮播初始化代码
    var gallery = mui('.mui-slider');
        gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});

    //2 主体的区域滚动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });



    //获取传递过来的id
})