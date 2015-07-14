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
			
			$('#todo-list li:last .toggle').on('click', completeTodo);
			$('#todo-list li:last .destroy').on('click', removeTodo);
			addAnimation();
		}

	}

	function addAnimation() {
		setTimeout(function(){
			$('.appending').removeClass('appending');
		}, 100);
	}

	function completeTodo(e) {
		$(e.target).parents('li').toggleClass('completed');
	}

	function removeTodo(e) {
		$(e.target).parents('li').addClass('deleting');
		setTimeout(function(){
			$(e.target).parents('li').remove();
		}, 1000);
	}

});