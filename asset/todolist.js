document.addEventListener("DOMContentLoaded", function(){
	document.querySelector("#new-todo").addEventListener("keydown", addTodo); 
})

function addTodo(e){
	var ENTER_KEYCODE = 13;
	if(e.keyCode === ENTER_KEYCODE) {
		var todo = makeTodo(document.querySelector("#new-todo").value);
		document.querySelector("#todo-list").appendChild(todo);
		document.querySelector("#new-todo").value = "";
	}
}

function makeTodo(title){
	var li = document.createElement("li");
	var todoObj = new Todo(title);
	var template = Handlebars.compile(Templates.todoTemplate);
	li.innerHTML = template(todoObj);
	return li;
}

function Todo(title){
	this.title = title;
}

Templates = {}; 
Templates.todoTemplate = [
    '<li>',
		'<div class="view">',
			'<input class="toggle" type="checkbox">',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
	'</li>'
].join("\n");

