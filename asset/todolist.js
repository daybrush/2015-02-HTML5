// TODO 
// TODOsync : add, complete 등 data를 전달하는 ajax통신에서 fetch 사용
// TODOsync : 메소드마다 반복되는 if-else문 꼴보기 싫다 

var count = 0;

var TODOcallback = {
	init : function() {
		document.addEventListener('DOMContentLoaded', function(){
			var source = $('#todo-template').html();
			this.todoTemplate = Handlebars.compile(source);
		}.bind(this));
	},

	initData : function(json) {
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

		TODO.ulTodoList.append(tempTodos);
		TODO.appendingAnimate();
	},

	//context생성 위해선 todo 내용을 넣어줘야함
	//callback을 분리하면서 바로 접근이 불가능
	//TODO에서의 sync call은 모두 객체, callback함수로 하고 싶음 
	//TODOsync에서의 .done은 모두 callback(response)로 통일하고 싶음
	add : function(json){
		var context = {
			id: json.id,
			todo: this.inputTodo.val()
		};
		var todo = $(this.todoTemplate(context));

		TODO.ulTodoList.append(todo);
		TODO.appendingAnimate();
	},

	// complete, remove 때도 targetli 문제.
	complete : function() {
		$targetLi.toggleClass('completed');
	},

	remove : function() {
		$targetLi.addClass('deleting');
	}

}
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

function(){
this.inputTodo.on('ley', function(){
	this.add(aaaa).bind();
})
	/*
	 * initData : 서버에 저장된 데이터 불러오기
	 */
	initData : function() {
		TODOsync.get(TODOcallback.initData.bind(this));
	},

	add : function(e) {
		if (e.keyCode === this.ENTER_KEYCODE) {
			var todo = this.inputTodo.val();
			this.inputTodo.val('');
			
			TODOsync.add(todo, function() {
				TODOcallback.add(todo).bin
			}.bind(this));
		}
	},

	complete : function(e) {
		$targetLi = $(e.target).closest('li');
		var completed = e.target.checked?'1':'0';

		TODOsync.complete({
			'id' : $targetLi.data('id'),
			'completed' : completed,

		}, TODOcallback.complete);
	},

	remove : function(e) {
		$targetLi = $(e.target).closest('li');
		TODOsync.remove($targetLi.data('id'), TODOcallback.remove);
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

		this.onofflineListener();
		//this.initDB.bind(this)();
		// 처음에 얘를 한 번 호출해줘야 처음 dom이 로드 되었을 때 on/off 체크 가능 
		// setTimeout(function() {
		// 	console.log("onoff");
		// 	this.onofflineListener();
			
		// }.bind(this), 3000);
	},

	initDB : function() {
		var request = indexedDB.open("todoDB", 2);
		request.onerror = function(e) {
			console.log("db init failed");
		};

		request.onsuccess = function(e) {
			console.log("db on success");
			this.db = request.result;
			this.initStore.bind(this)();
		}.bind(this);

		request.onupgradeneeded = function(e) {
			console.log("db on upgrade needed");
			this.db = e.target.result;
			this.db.createObjectStore('todo', {autoIncrement : true});
		}.bind(this);

	},

	initStore : function() {
		var transaction = this.db.transaction(["todo"], "readwrite");

		transaction.oncomplete = function(e) {
		}.bind(this);

		transaction.onerror = function(e) {
			console.log("db transaction error");
		};

		this.store = transaction.objectStore("todo");
		console.log("set transaction end");
	},

	onofflineListener : function() {
		$(header)[navigator.onLine?'removeClass':'addClass']('offline');

		if(navigator.onLine) {
			//sync to server
			// $.each(localStorage, function(key, value) {
			// 	var item = JSON.parse(value);
			// 	if (value.method === 'PUT') {
			// 		this.add(item.todo, addCallback)
			// 	}
			// 	else if (value.method === 'POST') {
			// 		this.add(item.param, completeCallback)

			// 	}
			// 	else if (value.method === 'DELETE') {
			// 		this.add(item.id, removeCallback)

			// 	} else { //'GET'
			// 		this.get(getCallback);
			// 	}
			// }.bind(this));
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
			console.log("dd");
			this.store.add({'method' : 'GET'});
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

			localStorage.setItem(count++, JSON.stringify({'method' : 'PUT', 'todo' : todo}));
		}

		// get : 아무일도 안하면 됨 
		// add : todo text를 가지고 있어야 됨 
		// complete : id, completed
		// remove : id 




		
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
