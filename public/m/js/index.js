//轮播图动态js初始化代码
$(function () {
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
    });



    // 区域滚动  当设置区域滚动时 从而头部和底部的padding无效，从而解决方法，只有设置body的高度，以及main主体的高度，有因为
    //MUI中他设置了position：absolute，因此我们也需要给他的父元素添加相对定位
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });


    
    
})