document.addEventListener("DOMContentLoaded", function(){
	document.querySelector("#new-todo").addEventListener("keydown", addTodo); 
	document.querySelector("#todo-list").addEventListener("click", completedTodo);
	document.querySelector("#todo-list").addEventListener("click", removeTodo);
})

function addTodo(e){
	var ENTER_KEYCODE = 13;
	if(e.keyCode === ENTER_KEYCODE) {
		var todo = makeTodo(document.querySelector("#new-todo").value);
		document.querySelector("#todo-list").appendChild(todo);
		document.querySelector("#new-todo").value = "";
		setTimeout(function() {
    		todo.classList.add("appending");
  		}, 10);
	}
}

function makeTodo(title){
	var li = document.createElement("li");
	var todoObj = new Todo(title);
	var template = Handlebars.compile(Templates.todoTemplate);
	li.innerHTML = template(todoObj);
	return li;
}

function completedTodo(e){
	var input = e.target;
	var li = e.target.parentNode.parentNode;
	if(e.target.className !== "toggle") return;
	if(input.checked){
		li.className = "completed";
	}else{
		li.className = "";
	}
}

function removeTodo(e){
	var destroy = e.target;
	var li = e.target.parentNode.parentNode;
	if(e.target.className !== "destroy") return;
  	li.classList.add("deleting");
	setTimeout(function() {
  		li.parentNode.removeChild(li);
  	}, 400);
}

function Todo(title){
	this.title = title;
}

Templates = {}; 
Templates.todoTemplate = [
		'<div class="view">',
			'<input class="toggle" type="checkbox">',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
].join("\n");