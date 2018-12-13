$(function () {
    //点击搜索按钮，将input中的内容存储在本地内存中，从而取出本地内存中的内容，渲染在页面上
    //1 给按钮添加点击事件,
    $(".btn-search").on("tap",function () {
        var search = $("#checkout input").val();

    //1.1 判断输入的内容是否为空
    if( !search.trim()){
        alert("请输入你需要的商品名称");
        return;
    }
    //1.2 获取之前的记录，如果有就获取值，将数组转成json.parse,没有就使用空数组
    var res = localStorage.getItem("history");
    var arr;
    if(res){
        arr = JSON.parse(res);
    }else {
        arr =[];
    }
        
    //1.3 判断在数值存储中，是否存在相同的数值，如果存在则把值删掉
        if(arr.indexOf(search) != -1){//不等于-1说明数值存储中，说明这个数值存在，从而删除
           arr.splice(arr.indexOf(search),1);
        }
    //1.4 如果有重复的上面已经删掉了，没有的可以继续往后加入
        arr.unshift(search);

        var jsonStr = JSON.stringify(arr);
        localStorage.setItem("history",jsonStr);

        //1.5 添加完搜索记录，用查询重新渲染到页面上
        renderHtml();
    })
    //2 查询数据
    function renderHtml() {
        //2.1 获取记录的值，转成数组
    var arr = JSON.parse(localStorage.getItem("history")) || [];
    // console.log(arr);
    //2.2 创建模板，把数组转成对象传入模板里面
     arr = {list:arr};

    //2.3 调用模板
    var html = template("searchTpl",arr);
    $(".history-content ul").html(html);
    }

    //3 删除数据
    //3.1 给所有删除x绑定一个索引 根据索引来删除
    //3.2 给每一个x符号注册点击事件，由于是异步请求，需要用到事件委托、
    $(".history-content ul").on("tap","li .btn-close",function () {
        //3.3 获取所有的数组，根据当前的索引去删除这个元素
        var arr = JSON.parse(localStorage.getItem("history")) || [];
        // console.log(arr);
         var index = $(this).data("index");
        // console.log(index);
        arr.splice(index,1);

        //3.4 删除完后将数据重新保存在存储里面
        localStorage.setItem("history",JSON.stringify(arr));

        //3.5 将新存储的数据重新渲染到页面上
        renderHtml();
    })

})