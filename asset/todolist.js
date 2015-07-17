document.addEventListener('DOMContentLoaded', function(){

	var inputTodo = $('#new-todo');
	var ulTodoList = $('#todo-list');

	var ENTER_KEYCODE = 13;

	var source = $('#todo-template').html();
	var todoTemplate = Handlebars.compile(source);

	inputTodo.on('keypress', addTodo);

	$('#todo-list').on('transitionend', 'li.deleting', function(e){
		e.target.remove();
	});

	function addTodo(e) {
		if (e.keyCode === ENTER_KEYCODE) {
			var context = {todo: inputTodo[0].value};
			inputTodo[0].value = "";

			var todo = $(todoTemplate(context));
			ulTodoList.append(todo);
			
			appendingAnimate();
			
			$('#todo-list li:last').on('click', '.toggle', completeTodo);
			$('#todo-list li:last').on('click', '.destroy', removeTodo);
		}

	}

	function appendingAnimate() {
		// css update...why...
		todo.css('opacity');
		$('.appending').removeClass('appending');
	}

	function completeTodo(e) {
		$(e.delegateTarget).toggleClass('completed');
	}

	function removeTodo(e) {
		$(e.delegateTarget).addClass('deleting');
	}


});