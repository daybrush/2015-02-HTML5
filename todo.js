//      해당 스크립트는 <body>태그 하단에 위치하기 때문에,
//      $(document).ready(function(){});을 사용할 필요가 없다?

var ENTER_KEYCODE = 13;

//      이렇게 사용하면 template에 대한 cache를 사용하는 것인가요???
var template = $("#todo-template").html();

//      특정한 값이 입력되면 Template을 만들고 <input>의 값을 template에 삽입한다.
function addTODO(e) {
    "use strict";
    if (e.keyCode === ENTER_KEYCODE) {
        
        var todoCompile = Handlebars.compile(template);
        var todo = $("#new-todo").val();
        
        var inputTodo = { newtodo : [] };
        inputTodo.newtodo.push({ content : todo });
        var todolist = todoCompile(inputTodo);
        
        $("#new-todo").val("");
        $("#todo-list").append(todolist);
    }
}

//checkbox click시 class="completed" 추가

//  .delegate() method를 이용한 방법 1.4.3+
//  $("body").delegate(".toggle", "click", function(e) {
//      var input = $(e.currentTarget);
//      var li = input.closest("li");
//
//      li.toggleClass("completed");
//  })

////.click() method를 이용한 방법
//$(".toggle").click(function(e) {
//    var input = $(e.currentTarget);
//    var li = input.closest("li");
//
//    li.toggleClass("completed");
//    //단순히 toggleClass를 이용하여 check여부 판단 없이 바로 class내용을 변경할 수 있다.
//})


//.on() method를 이용한 방법  1.7+
$("body").on("click", ".toggle", function(e) {
    var input = $(e.currentTarget);
    var li = input.closest("li");
    
    li.toggleClass("completed");
    //단순히 toggleClass를 이용하여 check여부 판단 없이 바로 class내용을 변경할 수 있다.
})


//  delete 버튼을 누르면 지워집니다.
$("body").on("click", ".destroy", function(e) {
    var button = $(e.currentTarget);
    var li = button.closest("li");
    
    li.remove();  
})

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    $("#new-todo").keydown(addTODO);
});