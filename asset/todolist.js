/*141005 KwonDaye*/

var KEYCODE_ENTER = 13;

function makeTodo(todo) {
	var source = $("#todo-template").html();
	var template = Handlebars.compile(source);
	var context = {doWhat: todo};
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

function completeTodo(e) {
	var input = e.target;
	var li = e.target.parentNode.parentNode;
	if(input.checked) {
		li.className = "completed";
	} else {
		li.className = "";
	}
}

function removeTodo(e) {
	var li = e.target.parentNode.parentNode;
	li.className = "deleting";
	li.addEventListener('webkitTransitionEnd', function(e) { 
		li.parentNode.removeChild(li);
	}, false );
}

$(document).ready(function() {
	$("#new-todo").bind("keydown", addTodo);
	$("#todo-list").on("click", ".toggle", completeTodo);
	$("#todo-list").on("click", ".destroy", removeTodo);
});