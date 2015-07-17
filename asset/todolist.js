var TODO = {
	ENTER_KEYCODE : 13,

	init : function() {
		document.addEventListener('DOMContentLoaded', function(){

			this.inputTodo = $('#new-todo');
			this.ulTodoList = $('#todo-list');

			var source = $('#todo-template').html();
			this.todoTemplate = Handlebars.compile(source);

			this.inputTodo.on('keypress', this.add.bind(this));
			this.ulTodoList.on('transitionend', 'li.deleting', function(e){
				e.target.remove();
			});
		}.bind(this));
	},

	add : function(e) {
		if (e.keyCode === this.ENTER_KEYCODE) {
			var context = {todo: this.inputTodo[0].value};
			this.inputTodo[0].value = "";

			this.todo = $(this.todoTemplate(context));
			this.ulTodoList.append(this.todo);
			
			this.appendingAnimate.bind(this)();
			
			$('#todo-list li:last').on('click', '.toggle', this.complete);
			$('#todo-list li:last').on('click', '.destroy', this.remove);
		}
	},
	remove : function(e) {
		$(e.delegateTarget).addClass('deleting');
	},

	complete : function(e) {
		$(e.delegateTarget).toggleClass('completed');
	},

	appendingAnimate : function() {
		// css update...why...
		this.todo.css('opacity');
		$('.appending').removeClass('appending');
	}
}
TODO.init();
