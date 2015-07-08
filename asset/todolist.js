document.addEventListener('DOMContentLoaded', function(){

	var inputTodo = $('#new-todo');
	var ulTodoList = $('#todo-list');

	var ENTER_KEYCODE = 13;

	var source = $('#todo-template').html();
	var todoTemplate = Handlebars.compile(source);

	inputTodo.on('keypress', addTodo);

	function addTodo(e) {
		if (e.keyCode === ENTER_KEYCODE) {
			var context = {todo: inputTodo[0].value};
			inputTodo[0].value = "";

			var todo = todoTemplate(context);
			ulTodoList.append(todo);
			$('#todo-list li:last').on('click', completeTodo);
		}

	}

	function completeTodo(e) {
		if (e.target.className === 'toggle') {
			$(e.target).parents('li').toggleClass('completed');
		}
	}
});