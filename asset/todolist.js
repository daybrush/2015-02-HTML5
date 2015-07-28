// TODO 
// TODOsync : add, complete 등 data를 전달하는 ajax통신에서 fetch 사용
// TODOsync : 메소드마다 반복되는 if-else문 꼴보기 싫다 
// localStorage 사용 : 1. setItem에 함수를 넣어서 online시점에 바로 실행되게 하고 싶은데?
//					--> 안됨. 어차피 실행함수와 콜백 모두 반복되는건데 그걸 계속 넣는것도 이상하고 json은 function type을 지원 안함
//					2. callback함수가 익명이라 부르기 어려움 
//					-> 어디에 받아둘 것인가
//					3. 2의 어려움 때문에 callback함수를 todosync의 then이후에서 하는것은 어떤가?
// 					--> 별로인듯 그럼 둘을 분리할 필요가 없지 않냐  
var count = 0;
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
			'id' : $targetLi.data('id'),
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

	init : function() {
		window.addEventListener('online', this.onofflineListener);
		window.addEventListener('offline', this.onofflineListener);
		// 처음에 얘를 한 번 호출해줘야 처음 dom이 로드 되었을 때 on/off 체크 가능 
		this.onofflineListener();
	},

	onofflineListener : function() {
		//document.getElementById('header').classList[navigator.onLine?'remove':'add']('offline');

		// if(navigator.onLine) {
		// 	$('#header').removeClass('offline');
		// } else {
		// 	$('#header').addClass('offline');
		// }

		$(header)[navigator.onLine?'removeClass':'addClass']('offline');

		if(navigator.onLine) {
			//sync to server
			$.each(localStorage, function(key, value) {
				var item = JSON.parse(value);
				if (value.method === 'PUT') {
					this.add(item.todo, addCallback)
				}
				else if (value.method === 'POST') {
					this.add(item.param, completeCallback)

				}
				else if (value.method === 'DELETE') {
					this.add(item.id, removeCallback)

				} else { //'GET'
					this.get(getCallback);
				}
			}.bind(this));
		}
	},

	get : function(callback) {
		if (navigator.onLine) {
			fetch(this.URL, {method : 'GET', headers : myHeaders}).then(function(response) {
				return response.json();
			}).then(function(response) {
				callback(response);
			})
		} else {
			localStorage.setItem(count, JSON.stringify({'method' : 'GET'}));
		}
	},

	add : function(todo, callback) {

		if (navigator.onLine) {
			$.ajax({
				method : 'PUT',
				url : this.URL,
				data : {'todo' : todo}
			}).done(function(response) {
				callback(response);
			});
		} else {
			//arguments.callee() deprecated

			//this.add, callback 함수가 json 변환이 안됨 
			// Functions are not a valid JSON data type so they will not work. 
			//Also some objects like Date will be a string after JSON.parse().
			// 생각해보니 함수들을 다 storage에 넣는 것은 비효율 적인데?
			// add와 callback은 다 같은거니까 하나씩 다 저장할 필요는 없음 
			
			//{'method' : this.add, 'callback' : callback, 'todo' : todo};
			//localStorage.setItem(count++, JSON.stringify({'method' : 'PUT', 'todo' : todo}));
			
			localStorage.setItem(count++, JSON.stringify({'method' : 'PUT', 'todo' : todo}));
		}

		// get : 아무일도 안하면 됨 
		// add : todo text를 가지고 있어야 됨 
		// complete : id, completed
		// remove : id 

		// localStorage : key-value로 데이터를 저장
		// key는 autoincrement처럼 생각하고
		// value를 객체 하나 생성
		// -> method, id, todo, completed 를 가지고 있는 아이


		
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
			url : this.URL + param.id,
			data : {'completed' : param.completed}
		}).done(function(response) {
			callback(response);
		});
	},

	remove : function(id, callback) {
		fetch(this.URL+id, {method : 'DELETE', headers : myHeaders}).then(function(response) {
			return response.json();
		}).then(function(response) {
			callback(response);
		})

	}
}

TODOsync.init();
TODO.init();
