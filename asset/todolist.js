// TODO 
// jquery의 select 사용시 [0] 이런식으로밖에 못쓰ㄴ ㅏ....
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

			this.initData.bind(this)();

		}.bind(this));
	},

	/*
	 * initData : 서버에 저장된 데이터 불러오기
	 */
	initData : function() {
		TODOsync.get(function(json){
			json.forEach(function(element) {
				var context = {todo: element.todo};
				this.todo = $(this.todoTemplate(context));
				this.todo[0].dataset.key = element.id;

				if (element.completed) {
					this.todo[0].querySelector('.toggle').checked = element.completed;
					this.todo.addClass('completed');
				}

				this.append.bind(this)();

			}.bind(this));

		}.bind(this));
	},

	add : function(e) {
		if (e.keyCode === this.ENTER_KEYCODE) {
			var context = {todo: this.inputTodo[0].value};
			TODOsync.add(context.todo, function(json){
				this.inputTodo[0].value = '';

				this.todo = $(this.todoTemplate(context));
				this.todo[0].dataset.key = json.insertId;
				//왜 안됨
				//this.todo.data('key', json.insertId);

				this.append.bind(this)();

			}.bind(this));
		}
	},

	complete : function(e) {
		$targetLi = $(e.delegateTarget);
		var completed = $targetLi.find('.toggle')[0].checked?'1':'0';

		TODOsync.complete({
			'key' : $targetLi.data('key'),
			'completed' : completed 
		}, function() {
			$targetLi.toggleClass('completed');
		});
	},

	// js에선 function의 parameter에 상관없이 함수 이름으로만 정의를 하나?
	// TODOSync의 callback에선 json을 parameter로 하는데 얘는 안그럼 
	remove : function(e) {
		$targetLi = $(e.delegateTarget);
		TODOsync.remove($targetLi.data('key'), function() {
			$targetLi.addClass('deleting');
		});
	},

	/*
	 * append : li로 된 todo DOM에 append
	 */
	append : function() {
		this.ulTodoList.append(this.todo);
		this.appendingAnimate.bind(this)();
		
		$('#todo-list li:last').on('click', '.toggle', this.complete);
		$('#todo-list li:last').on('click', '.destroy', this.remove);
	},

	appendingAnimate : function() {
		// css update...why...
		this.todo.css('opacity');
		$('.appending').removeClass('appending');
	}
}

var myHeaders = new Headers();
myHeaders.append('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

var TODOsync = {
	URL : 'http://128.199.76.9:8002/byjo/',

	get : function(callback) {
		fetch(this.URL, {method : 'GET', headers : myHeaders}).then(function(response) {
			return response.json();
		}).then(function(response) {
			callback(response);
		})
	},

	add : function(todo, callback) {
		$.ajax({
			method : 'PUT',
			url : this.URL,
			data : {'todo' : todo}
		}).done(function(response) {
			callback(response);
		});
		
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
