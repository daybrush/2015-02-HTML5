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
        
        $("#todo-list").html(todolist);
        $("#new-todo").val("");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    $("#new-todo").keydown(addTODO);
});