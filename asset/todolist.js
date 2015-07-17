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
			TODOsync.add(context.todo, function(json){
				console.log(json);
				this.inputTodo[0].value = "";

				this.todo = $(this.todoTemplate(context));
				console.log(json.insertId);
				this.todo[0].dataset.key = json.insertId;
				
				//왜 안됨
				//this.todo.data('key', json.insertId);

				this.ulTodoList.append(this.todo);
				

				this.appendingAnimate.bind(this)();
				
				$('#todo-list li:last').on('click', '.toggle', this.complete);
				$('#todo-list li:last').on('click', '.destroy', this.remove);
				
			}.bind(this));

		}
	},
	remove : function(e) {
		$targetLi = $(e.delegateTarget);
		TODOsync.remove($targetLi.data('key'), function() {
			$targetLi.addClass('deleting');
		});
	},

	complete : function(e) {
		$targetLi = $(e.delegateTarget);
		var completed = $targetLi.hasClass('completed')?'1':'0';

		TODOsync.complete({
			'key' : $targetLi.data('key'),
			//'completed' : $targetLi.hasClass('completed')?'1':'0'; 
			'completed' : completed 
		}, function() {
			$targetLi.toggleClass('completed');
		});
	},

	appendingAnimate : function() {
		// css update...why...
		this.todo.css('opacity');
		$('.appending').removeClass('appending');
	}
}
TODO.init();

var TODOsync = {
	get : function() {

	},

	add : function(todo, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', 'http://128.199.76.9:8002/byjo', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xhr.addEventListener('load', function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send('todo=' + todo);
	},

	complete : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://128.199.76.9:8002/byjo/'+param.key, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xhr.addEventListener('load', function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send('completed=' + param.completed);

	},

	remove : function(key, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', 'http://128.199.76.9:8002/byjo/'+key, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xhr.addEventListener('load', function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();

	}
}
