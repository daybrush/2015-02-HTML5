// TODO 
// TODOsync : add, complete 등 data를 전달하는 ajax통신에서 fetch 사용

var TODO = {
	ENTER_KEYCODE : 13,

	/*
	 * init : variable 선언, event bind
	 */
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

			//이렇게 하면 dom이 만들어지는 순간에는 li가 없기 때문에 아무에게도 event가 걸리지 않음 
			//$('#todo-list li').on('click', '.toggle', this.complete);

			//ul에 걸고 부모를 찾자 
			this.ulTodoList.on('click', '.toggle', this.complete);
			this.ulTodoList.on('click', '.destroy', this.remove);

			this.initData();

		}.bind(this));
	},

	/*
	 * initData : 서버에 저장된 데이터 불러오기
	 */
	initData : function() {
		TODOsync.get(function(json) {
			var tempTodos = [];
			var tempTodos = json.map(function(element) {
				var context = {
					id: element.id,
					todo: element.todo,
					completed: element.completed
				};
				var todo = this.todoTemplate(context);
				return todo;
			}.bind(this)).join("");

			this.ulTodoList.append(tempTodos);
			this.appendingAnimate();
		}.bind(this));
	},

	add : function(e) {
		if (e.keyCode === this.ENTER_KEYCODE) {
			TODOsync.add(this.inputTodo.val(), function(json){
				var context = {
					id: json.id,
					todo: this.inputTodo.val()
				};
				var todo = $(this.todoTemplate(context));
				this.inputTodo.val('');

				this.ulTodoList.append(todo);
				this.appendingAnimate();
			}.bind(this));
		}
	},

	complete : function(e) {
		$targetLi = $(e.target).closest('li');
		var completed = e.target.checked?'1':'0';

		TODOsync.complete({
			'key' : $targetLi.data('id'),
			'completed' : completed 
		}, function() {
			$targetLi.toggleClass('completed');
		});
	},

	remove : function(e) {
		$targetLi = $(e.target).closest('li');
		TODOsync.remove($targetLi.data('id'), function() {
			$targetLi.addClass('deleting');
		});
	},

	appendingAnimate : function() {
		this.ulTodoList.css('opacity');
		$('.appending').removeClass('appending');
	}
}

var myHeaders = new Headers();
myHeaders.append('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

var TODOsync = {
	URL : 'http://128.199.76.9:8002/byjo/',

	// init : function() {
	// 	window.addEventListener('online', this.onofflineListener);
	// 	window.addEventListener('offline', this.onofflineListener);
	// },

	// onofflineListener : function() {
	// 	//document.getElementById('header').classList[navigator.onLine?'remove':'add']('offline');
	// 	// if(navigator.onLine) {
	// 	// 	$('#header').removeClass('offline');
	// 	// } else {
	// 	// 	$('#header').addClass('offline');
	// 	// }
	// 	// 처음부터 온라인일 때 왜 안됨 ㅠㅠ
	// 	$('#header')[navigator.onLine?'removeClass':'addClass']('offline');

	// 	if(navigator.onLine) {
	// 		//sync to server
	// 	}
	// },

	get : function(callback) {
		fetch(this.URL, {method : 'GET', headers : myHeaders}).then(function(response) {
			return response.json();
		}).then(function(response) {
			callback(response);
		})
	},

	add : function(todo, callback) {

		//if (navigator.onLine) {
			$.ajax({
				method : 'PUT',
				url : this.URL,
				data : {'todo' : todo}
			}).done(function(response) {
				callback(response);
			});
		//} else {
		//	localStorage.
		//}
		
		// 안돼애애애애애 ㅠㅠㅠㅠㅠㅠ
		// var form = new FormData();
		// form.append('todo', todo);
		// fetch(this.URL, {method : 'PUT', headers : myHeaders, data : {'todo' : todo}}).then(function(response) {
		// 	return response.json();
		// }).then(function(response) {
		// 	callback(response);
		// }).catch(function(err) {
		// 	console.log(err);
		// })
	},

	complete : function(param, callback) {
		$.ajax({
			method : 'POST',
			url : this.URL + param.key,
			data : {'completed' : param.completed}
		}).done(function(response) {
			callback(response);
		});
	},

	remove : function(key, callback) {
		fetch(this.URL+key, {method : 'DELETE', headers : myHeaders}).then(function(response) {
			return response.json();
		}).then(function(response) {
			callback(response);
		})

	}
}

TODO.init();
//TODOsync.init();
