/*jslint browser: true*/
/*global $, jQuery, alert*/

var ENTER_KEYCODE = 13;
var inputTodo = { newtodo : [] };

//      특정한 값이 입력되면 Template을 만들고 <input>의 값을 template에 삽입한다.
function addTODO(e) {
    "use strict";
    if (e.keyCode === ENTER_KEYCODE) {

        var template = $("#todo-template").html();
        var todoCompile = Handlebars.compile(template);
        var todo = $("#new-todo").val();
        
        inputTodo.newtodo.push({ content : todo });
        var todolist = todoCompile(inputTodo);
        
        $("#new-todo").val("");
        $("#todo-list").html(todolist);
}

//checkbox click시 class="completed" 추가
/*
    .click()은 이미 존재하는 element에만 binding된다고 합니다. 새로 만들어지는 element들에는 바인딩되지 않는다길래 다른 방법을 찾아야 했습니다.
    .delegate와 .on이 있습니다.
*/

/* 
    .delegate() method를 이용한 방법 1.4.3+
$("body").delegate(".toggle", "click", function(e) {
    내부 내용은 같습니다.
})
*/

//.on() method를 이용한 방법  1.7+
$("body").on("click", ".toggle", function(e) {
    var input = $(e.currentTarget);
    var li = input.parent().parent();
    
    if(input.is(":checked")) {
        li.addClass("completed");
    }else {
        li.removeAttr("class");
//      li.removeClass("completed");        이 경우 class 속성은 남아있고, value만 지워지니 removeAttr가 깔끔하지 않을까요?
    }
})




//  delete 버튼을 누르면 지워집니다.
//  fadeTo를 이용해 animation 종료 후 function이 작동하도록 합니다.
$("body").on("click", ".destroy", function(e) {
    var button = $(e.currentTarget);
    var li = button.parent().parent();

    li.fadeTo(200, 0, function(){
        
//  최선의 선택이 아닌 것은 자명하지만... template의 content가 들어있는 객체 내 배열 내 객체(?!) 의 value값을 비교하면서 index를 구한다.
        var labelValue = button.parent().children("label").text()
        var index = -1;
        for(var i = 0; i < inputTodo.newtodo.length; i++) {
            if (inputTodo.newtodo[i].content === labelValue) {
                index = i;
                break;
            }
        }
        if (index > -1) { inputTodo.newtodo.splice(index,1); }
        li.remove();          
    });
})


document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    $("#new-todo").keydown(addTODO);
});