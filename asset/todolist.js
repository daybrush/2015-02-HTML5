/* 150702
 * keycode event
 * 1 enter키(keycode : 13) 입력 이벤트
 * 2 이벤트 발생 시 todo(li element) 추가
 */

document.addEventListener("DOMContentLoaded", function(){
	var newTodo = document.getElementById("new-todo");
	newTodo.addEventListener("keydown", AddTodoItemToList, false);
});

function AddTodoItemToList(event){
	if(event.keyCode === 13){
		var newTodo = document.getElementById("new-todo");
		var todoLabel = newTodo.value;
		if(todoLabel === ""){
			alert("할 일을 입력해주세요!");
			return;
		}
		document.getElementById("todo-list").appendChild(createTodoItem(todoLabel));
		newTodo.value = "";
	}
}

function createTodoItem(todoLabel){
	var todoItem = document.createElement("li");
	todoItem.setAttribute("class", "{}");
	var source = '<div class="view"><input class="toggle" type="checkbox" {}><label>{{todoLabel}}</label><button class="destroy"></button></div>';
	var template = Handlebars.compile(source);
	var data = {"todoLabel" : todoLabel};
	var result = template(data);
	todoItem.innerHTML = result;

	return todoItem;
}