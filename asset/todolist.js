document.addEventListener('DOMContentLoaded', function(){

	var inputTodo = document.getElementById('new-todo');
	var ulTodoList = document.getElementById('todo-list');

	var source = document.getElementById('todo-template').innerHTML;
	var todoTemplate = Handlebars.compile(source);

	inputTodo.addEventListener('keypress', addTodo);

	function addTodo(e) {
		var ENTER_KEYCODE = 13;
		if (e.keyCode === ENTER_KEYCODE) {
			var context = {todo: inputTodo.value};
			var todo = todoTemplate(context);
			ulTodoList.insertAdjacentHTML('beforeend', todo);
			inputTodo.value = "";
		}
	}

});