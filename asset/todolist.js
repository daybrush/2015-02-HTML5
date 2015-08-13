//online, offline event 할당
// 오프라인일 때 헤더 엘리먼트에 오프라인 클래스 추가하고
// 온라인일 때 헤더 엘리먼트에 오프라인 클래스 삭제

//#todo-list엘리먼트에 active(complted)엘리먼트를 누르면
// 1.todo-list에 all-active(complted)클래스를 추가하고
// 2.기존 anchor에 selected class를 삭제하고
// 3.anchor에 selected 클래스를 추가한다. 

//동적으로 유아이를 UI를 변경 후 히스토리 추가(history.pushState({"method":"complete"}))
//뒤로 가기 할 때 이벤트를 받아서 변경 

//ajax
var TODOOnline = {
	get: function(callback){
		// url
		// id
		var xhr = new XMLHttpRequest();
		xhr.open("GET","http://128.199.76.9:8002/yskoh",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

		xhr.addEventListener('load', function(e){
			if(this.status == 200){
				callback(JSON.parse(xhr.responseText));
			}
		});
		xhr.send();

	},
	add : function(todo, callback){
// debugger;
		if(navigator.onLine){
			var xhr = new XMLHttpRequest();
			xhr.open("PUT","http://128.199.76.9:8002/yskoh",true);
			//body에 값을 보내는데, utf-8로 인코딩해서 보내겠다~
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

			xhr.addEventListener('load', function(e){
				if(this.status == 200){
					callback(JSON.parse(xhr.responseText));
				}
			});
			xhr.send("todo=" + todo.value);
			// var param = { method: "PUT", url: "http://128.199.76.9:8002/yskoh", data: "todo=" + todo };
			// $.ajax(param).then(callback);
		}
	},
	completed: function(param, callback){
		if(navigator.onLine){
			var xhr = new XMLHttpRequest();
			xhr.open("POST","http://128.199.76.9:8002/yskoh/"+param.key,true);
			//body에 값을 보내는데, utf-8로 인코딩해서 보내겠다~
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

			xhr.addEventListener('load', function(e){
				if(this.status == 200){
					callback(JSON.parse(xhr.responseText));
				}
			});
			xhr.send("completed="+param.completed);
		}
	},
	remove: function(param, callback){
		if(navigator.onLine){
			var xhr = new XMLHttpRequest();
			xhr.open("DELETE", "http://128.199.76.9:8002/yskoh/"+param,true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

			xhr.addEventListener('load', function(e){
				if(this.status == 200){
					callback(JSON.parse(xhr.responseText));
				}
			});
			xhr.send("remove="+param);
		}
	},
	sync: function(){
		$.each(localStorage, function(key, value){
			var item = JSON.parse(value);
			if(item.method){
				if(item.method ==="add"){
					debugger;
					TODOOnline.add({"value":item.todo}, function(json){
						if(item.completed){
							item.key = json.insertId;
							TODOOnline.completed(item);
						}
					});
				}else{
					TODOOnline[item.method](item);
				}
			}
		});
		localStorage.clear();
	}
}

var TODOOffline = {
	count : 0,
	check: function(){
		if(!Storage){
			alert("Not suppported on your PC");
		}
	},
	get: function(callback){
		//뭔가??
	},
	add: function(data, callback){
		TODOOffline.check();
		// debugger;
		var stringTodo = data.value;
		var item = {"method":"add", "todo": stringTodo, "key": TODOOffline.count, "localOnly": true};
		// debugger;
		localStorage.setItem(item.key, JSON.stringify(item));
		callback({insertId: item.key});
		TODOOffline.count++;
	},
	completed: function(data, callback){
		TODOOffline.check();
		var item = JSON.parse(localStorage.getItem(data.key));
		if(!item.method){
			item.method = "completed";
		}
		item.completed = data.completed;
		localStorage.setItem(data.key, JSON.stringify(item));
		callback();
	},
	remove: function(data, callback){
		TODOOffline.check();
		var item = JSON.parse(localStorage.getItem(data.key));
		if(item["localOnly"]){
			localStorage.removeItem(data.key);
		}else{
			item.method = "remove";
			localStorage.setItem(data.key, JSON.stringify(item));
		}
		callback();
	},
	sync: function(){
		// debugger;
		var list = $("todo-list li");
		$.each(list, function(index, value){
			var key = value.dataset.key;
			localStorage.setItem(key, JSON.stringify({"method":null, "key":key}));
		});
	}
}

var TODO = {
	ENTER_KEYCODE: 13,
	selectedIndex: 0, 
	oInput: null,
	oHeader: null,
	oFilter: null,
	DataManager: null,
	// ShowState : "index.html",
	// States : {
	// 	"index.html": {index: 0, name: null},
			
	// },

	init : function(){
		document.addEventListener('DOMContentLoaded', function(){
			this.oInput = document.getElementById("new-todo");
            this.oList = document.getElementById("todo-list");
            this.oHeader = document.getElementById("header");
            this.oFilter = document.getElementById("filters");
			this.oHeader.classList[navigator.onLine?"remove":"add"]("offline");
            this.DataManager = navigator.onLine? TODOOnline : TODOOffline;
            // debugger;
            console.log(this.DataManager);
			this.get();
			this.oInput.addEventListener('keydown', this.add.bind(this));
			// this.oList.addEventListener("click", this.completed.bind(this));
   //          this.oList.addEventListener("click", this.remove.bind(this));

			this.initEventBind();
			window.addEventListener("online", this.onofflineListener);
			window.addEventListener("offline", this.onofflineListener);

			
		}.bind(this));
	},

	initEventBind: function(){
		document.getElementById("todo-list").addEventListener("click", this.eventFilter.bind(this));
		document.getElementById("filters").addEventListener("click", this.changeStateFilter.bind(this));
		window.addEventListener("popstate", this.changeURLFilter.bind(this));
	},
	changeURLFilter: function(e){
		console.log(e.state.method);
		if(e.state){
			var method = e.state.method;
			// if(method === "all"){
			// 	this.allView();
			// }else if(method === "active"){
			// 	this.activeView();
			// }else if(method === "completed"){
			// 	this.completedView();
			// }
			this[method+"View"]();
		}else{
			this.allView();
		}
	},
	changeStateFilter: function(e){		
		var target = e.target;
		var tagName = target.tagName.toLowerCase();
		if(tagName =="a"){
			var href = target.getAttribute("href");
			if(href === "index.html"){
				this.allView();
				history.pushState({"method":"all"}, null, "index.html");
			}else if(href === "active"){
				this.activeView();
				history.pushState({"method":"active"}, null, "active");
			}else if(href === "completed"){
				this.completedView();
				history.pushState({"method":"completed"}, null, "completed");
			}
		}
		e.preventDefault();
	},
	allView: function(){
		document.getElementById("todo-list").className = "";
		this.selectedNavigator(0);
	},
	activeView: function(){
		document.getElementById("todo-list").className = "all-active";
		this.selectedNavigator(1);
	},

	completedView: function(){
		document.getElementById("todo-list").className = "all-completed";
		this.selectedNavigator(2);
	},
	selectedNavigator: function(index){
		 var navigatorList = document.querySelectorAll('#filters a');
		 navigatorList[this.selectedIndex].classList.remove('selected');
		 navigatorList[index].classList.add('selected');
		 this.selectedIndex = index;
	},
	eventFilter: function(e){
		var ele = e.target;
		var tagName = ele.tagName.toLowerCase();
		if(tagName == "input"){
			this.completed(ele);
		}else if(tagName == "button"){
			this.remove(ele.closest('li'));
		}
	},
	build : function (context){
		var source = $('#entry-template').html();
		var template = Handlebars.compile(source);
		var li = template(context);
		
		// li.style.opacity = 0;
		// // document.getElementById('todo-list').appendChild(todoLi);
		// var i = 0;
		// var key = setInterval(function(){
		// 	//setInterval(function key(){})해도 됨??
		// 	if(i === 50){
		// 		//???????
		// 		clearInterval(key);
		// 	}else{
		// 		li.style.opacity = i * 0.02;
		// 	}
		// 	i++;
		// },16);

		return li;
	},
	get: function(callback){
		// this.DataManager.get(function(json){
		// 	json.forEach(function(obj){
		// 		var todo = TODO.build({target: obj.todo, key: obj.id});
		// 		TODO.oList.insertAdjacentHTML("beforeend", todo);
		// 	});
		// }).bind(this);
		this.DataManager.get(function(json){
			var oUl = document.getElementById("todo-list");
			for(var i=json.length - 1; i >= 0 ; i--){
				var checkComplete;
				var context = { target: json[i].todo, idNumber: json[i].id };
				context.checkCompleted = json[i].completed ? "completed" : "";
				oUl.insertAdjacentHTML('afterbegin', this.build(context));
			}

			var deletes = document.getElementsByClassName('destroy');
			for( var i=0 ; i < deletes.length; i++){
				deletes[i].addEventListener('click', this.remove.bind(this));
			}

			var completes = document.getElementsByClassName('toggle');
			for( var i=0; i< completes.length; i++){
				completes[i].addEventListener('click', this.completed.bind(this));
			}
			
		}.bind(this));
	},
	completed: function(e){
		
		var input = e.currentTarget;
		var li = input.closest('li');
		var completed = input.checked?"1":"0";
		var keyId = li.getElementsByClassName('id')[0];

		this.DataManager.completed({ "key": keyId.value, 
			"completed": completed
		}, function(){
			if(completed==="1"){
				li.className = "completed";
			}
			else{
				li.className = "";
			}

		});
	},
	remove: function (e){
		var button = e.currentTarget;
		var removeLi = button.closest('li');
		console.log(removeLi);
		var toRemove = removeLi.getElementsByClassName('id')[0];
		////
		this.DataManager.remove(toRemove.value, function(){
			var i = 0;
			key = setInterval(function(){
				if(i === 50){
					removeLi.parentNode.removeChild(removeLi);			
					clearInterval(key);
				}else{	
					removeLi.querySelector("label").style.opacity = 1 - (i * 0.02);
				}
				i++;
			},16);
		});
	},
	add: function(e){
		if(e.keyCode === this.ENTER_KEYCODE){
			var todo = document.getElementById('new-todo');
			this.DataManager.add(todo, function(json){
				var oUl = document.getElementById("todo-list");
				var context = { target: todo.value};
				oUl.insertAdjacentHTML('afterbegin', this.build(context));
				todo.value = "";
			}.bind(this));
		}
	},
	// 쓸려면 init에도 넣어야함
	onofflineListener: function(){
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		////
		this.DataManager = navigator.onLine? TODOOnline : TODOOffline;
	    this.DataManager.sync();
	}
};

TODO.init();