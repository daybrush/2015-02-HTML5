var ENTER_KEYCODE = 13;

// 새로 추가되는 todo-list의 문서객체를 만드는 함수.
// 매개변수로는 document.getElementById("new-todo").value
// 즉, html내의 input에 입력된 string을 받는다.
// 연결이 완료된 객체 중 가장 상위 객체인 li를 반환한다.


/*
function makeTODO(todo) {
    "use strict";

    // li ++  
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.className = "view";
            
    var input = document.createElement("input");
    input.className = "toggle";
    input.setAttribute("type", "checkbox");
    input.addEventListener("click",todoCompleted)
        
    var label = document.createElement("label");
    label.innerText = todo;
    //todo는 document.getElementById("new-todo").value를 말한다.
                    
    var button = document.createElement("button");
    button.className = "destroy";
            
    // DOM connect
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(button);
            
    li.appendChild(div);
    
    return li;
    //todo-list에 li를 appendChild 해야하기때문에 li Node를 반납함

}
*/
var inputTodo = { newtodo : [] };

function addTODO(e) {
    "use strict";
    if (e.keyCode === ENTER_KEYCODE) {

       //template 시도
        var template = $("#todo-template").html();
        var todoCompile = Handlebars.compile(template);
        var todo = document.getElementById("new-todo").value;

        inputTodo.newtodo.push({ content : todo });
        var todolist = todoCompile(inputTodo);
        
        $("#todo-list").html(todolist);
        document.getElementById("new-todo").value = "";

/*
        var todo = makeTODO(document.getElementById("new-todo").value);
        document.getElementById("todo-list").appendChild(todo);
        document.getElementById("new-todo").value = "";
*/
    }
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    document.getElementById("new-todo").addEventListener("keydown", addTODO);
});