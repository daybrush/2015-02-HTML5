document.addEventListener('DOMContentLoaded', function(){

var inputTodo = document.getElementById('new-todo');
var ulTodoList = document.getElementById('todo-list');

inputTodo.addEventListener('keypress', function(e) {
	var key = e.keyCode;
	if (key === 13) {
		var msg = inputTodo.value;
		addLi(msg);
	}
});

function li() {
	this.element = document.createElement('li');
	this.element.classList.add('{}');

	this.view = document.createElement('div');
	this.view.classList.add('view');

	this.inputb = document.createElement('input');
	this.inputb.classList.add('toggle');
	this.inputb.type = 'checkbox';

	this.labelb = document.createElement('label');

	this.button = document.createElement('button');
	this.button.classList.add('destroy');

	this.element.appendChild(this.view);
	this.view.appendChild(this.inputb);
	this.view.appendChild(this.labelb);
	this.view.appendChild(this.button);
}


function addLi(msg) {
	var newLi = new li();
	newLi.labelb.innerText = msg;
	ulTodoList.appendChild(newLi.element);
	inputTodo.value = "";
}

});