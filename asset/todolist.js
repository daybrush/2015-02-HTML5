/*141005 KwonDaye*/

var KEYCODE_ENTER = 13;

// function makeTodo(todo) {
// 	var li = document.createElement("li");
// 	var div = document.createElement("div");
// 	div.className = "view";
// 	var input = document.createElement("input");
// 	input.className = "toggle";
// 	input.setAttribute("type", "checkbox");
// 	var label = document.createElement("label");
// 	label.innerText = todo;
// 	var button = document.createElement("button");
// 	button.className = "destroy";

// 	div.appendChild(input);
// 	div.appendChild(label);
// 	div.appendChild(button);

// 	li.appendChild(div);

// 	return li;
// }

function makeTodo(todo) {
	var source = $("#todo-template").html();
	var template = Handlebars.compile(source);
	var context = {title: todo};
	var html = template(context);

	return html;
}

function addTodo(e) {
	if(e.keyCode === KEYCODE_ENTER) {
		var li = makeTodo($("#new-todo").val());
		$("#todo-list").append(li);
		$("#new-todo").val("");
	}
}

//$(document).bind("DOMContentLoaded", function() {
$(document).ready(function() {
	$("#new-todo").bind("keydown", addTodo);
});