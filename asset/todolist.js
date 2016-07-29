var ENTER_KEYCODE = 13;
var SAMPLE_TODO = '<li class="{className}" data-id="{id}"><div class="view"><input class="toggle" type="checkbox" {checked}><label>{title}</label><button class="destroy"></button></div></li>';


function changeTemplate(sample, data) {
	var html = sample;
	for(var key in data) {
		html = html.replace("{" + key + "}", data[key]);
	}
	return html;
}
var localSync = {
	list : [],
	add : function(todo) {
		//random....... 문제가 많은 아이디...
		var id = "_" + Math.random(0, 10000);
		
		var _todo = {todo:todo, id:id, status: "add", offlineAdd:true , offline:true};
		this.list.splice(0,0, _todo);
		//complete add / completed / remove
		
		TODO._add(_todo);
		
		this.save();
	},
	getIndex: function(id) {
		var length = this.list.length;
		
		var _id;
		for(var i = 0; i < length; ++i) {
			_id = this.list[i].id || this.list[i].insertId;
			if(id == _id) {
				return i;
			}
		}
		
		return -1;
	},
	complete: function(id, isCompleted) {
		var index = this.getIndex(id);
		if(index < 0)
			return;
			
		this.list[index].status = "completed";
		this.list[index].completed = isCompleted;
		this.save();
	},
	remove : function(id) {
		
		var index = this.getIndex(id);
		if(index < 0)
			return;
			
		var data = this.list[index];
		if(data.offlineAdd) {
			this.list.splice(index, 1);
		} else {
			data.status = "remove";
		}
		this.save();
	},
	get : function() {
		var data = JSON.parse(localStorage.todoList), length = data.length;
		this.list = data;
		
		for(var i = length - 1; i >= 0; --i) {
			TODO._add(data[i]);
		}
	},
	save : function(list) {
		console.log(list);
		this.list = list || this.list;	
		localStorage.todoList = JSON.stringify(this.list);
		if(!list)
			localStorage.update = 1;
	},
	update : function(list) {
		if(!todoSync.isOnline)
			return;
			
		
		
		console.log("update!!");
		
		var _list = this.list, length = _list.length;
		if(list)
			this.list = list;
			
			
		var index = length;
		var func = function() {
			--index;
			if( index < 0) {
				todoSync.get();
				return;
			}
			var todo = _list[index];
			console.log("update" + index +"-" + todo.todo);
			var xhr;
			if(todo.offlineAdd) {
				xhr = todoSync.add(todo.todo);
				xhr.addEventListener("load", function () {
					var data = JSON.parse(xhr.responseText);
					if(todo.status === "completed") {
						var xhr2 = todoSync.complete(data.insertId, todo.isCompleted);
						xhr2.addEventListener("load", function() {
							func();
						});
					} else {
						func();
					}
				});
			} else {
				if(todo.status === "completed")
					xhr = todoSync.complete(todo.insertId || todo.id, todo.completed);
				else if(todo.status === "remove")
					xhr = todoSync.remove(todo.insertId || todo.id);
					
				if(xhr)
					xhr.addEventListener("load", function() {
						func();
					});
			}
		};
		func();
		
		
		localStorage.update = "0";
	}
	
}
var todoFetch  = {
	isOnline : true,
	serverAddress : "http://128.199.76.9:8002/daybrush/",
	initFetch: function(method, address, body) {
		method = method || "GET";
		address = address || "";

		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		var info = {
			method: method,
			headers : myHeaders,
		};
		if(body) {
/*
			var data = new FormData();
			var length = 0;
			for(var key in body) {
				console.log(key, body[key]);
				data.append( key, body[key] );
				length++;
			}
*/
			//myHeaders.append("Content-Length", length);
			info.body = body;
		}
		return fetch(this.serverAddress + address, info);
	},
	get: function() {
		TODO.list.innerHTML = "";
		var fetch;
		if(this.isOnline) {
			fetch = this.initFetch();
			fetch.then(function(response) {
				return response.json().then(function(data) {			
					var length = data.length;
					for(var i = length - 1; i >= 0; --i) {
						TODO._add(data[i]);
					}
					if(localStorage.update == "1")
						localSync.update(data);				
					else
						localSync.save(data);
						
				});
			});
			
		} else {
			localSync.get();
		}
		return fetch;
	},
	add: function(todo, callback) {
		if(this.isOnline) {
			var fetch = this.initFetch("POST", "", "todo="+todo);
			fetch.then(callback);
		} else {
			localSync.add(todo);
		}
		return fetch;
	},///
	complete : function(id, isComplete) {
		if(this.isOnline) {
			var fetch = this.initFetch("PUT", id, "completed="+(isComplete*1));
		} else {
			localSync.complete(id, isComplete);
		}
		
		return fetch;
	},
	remove :function(id) {
		if(this.isOnline) {
			var fetch = this.initFetch("DELETE", id);
		} else {
			localSync.remove(id);
		}
		
		return fetch;
	}
}


var todoSync = {
	isOnline : true,
	serverAddress : "http://128.199.76.9:8002/daybrush/",
	initXHR: function(method, address) {
		method = method || "GET";
		address = address || "";
		
		var xhr = new XMLHttpRequest();
		xhr.open(method, this.serverAddress + address, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8")
		
		return xhr;
	},
	get: function() {
		TODO.list.innerHTML = "";
		if(this.isOnline) {
			var xhr = this.initXHR();
			xhr.addEventListener("load", function(e) {
	
				var data = JSON.parse(xhr.responseText), length = data.length;
				for(var i = length - 1; i >= 0; --i) {
					TODO._add(data[i]);
				}
				if(localStorage.update == "1")
					localSync.update(data);				
				else
					localSync.save(data);
			});
			xhr.send();

			//localSync.save(data);
			
		} else {
			localSync.get();
		}
		return xhr;
	},
	add: function(todo, callback) {
		if(this.isOnline) {
			var xhr = this.initXHR("POST");
			xhr.send("todo=" + todo);
		} else {
			localSync.add(todo);
		}
		return xhr;
	},///
	complete : function(id, isComplete) {
		if(this.isOnline) {
			var xhr = this.initXHR("PUT", id);	
			xhr.send("completed=" + (isComplete * 1));
		} else {
			localSync.complete(id, isComplete);
		}
		
		return xhr;
	},
	remove :function(id) {
		if(this.isOnline) {
			var xhr = this.initXHR("DELETE", id);
			xhr.send("");
		} else {
			localSync.remove(id);
		}
		
		return xhr;
	}
}

todoSync  = todoFetch;
var TODO = {
	list : "",
	init : function() {
		this.list = document.getElementById("todo-list");
		this.list.addEventListener("click", function(e) {

			var target = e.target;
			var classList = target.classList, length = classList.length;
			console.log(e, target, classList);
			autoDelegate(TODO.event, classList, e);
		});
		window.addEventListener("online", this.onofflineListener);
		window.addEventListener("offline", this.onofflineListener);
		window.addEventListener("popstate", this.changeURLFilter.bind(this));
		document.getElementById("filters").addEventListener("click",this.changeState.bind(this));
		
		this.onofflineListener(true);
		todoSync.get();
		//this._changeState("all");
	},
	onofflineListener : function(isUpdate) {
		todoSync.isOnline = navigator.onLine;
		if(navigator.onLine) {
			if(isUpdate != true)
				localSync.update();
			document.getElementById("header").classList.remove("offline");
		} else {
			document.getElementById("header").classList.add("offline");			
		}
	},
	changeURLFilter : function(e) {
		
		var method;
		
		if(e.state) {
			method = e.state.method || "all";
		} else {
			method = "all";
		}
			
		if(!this.state[method])
			return;
			

		
		this.state[method]();
			
		
	},
	changeState : function(e) {
		e.preventDefault();
		var target = e.target;
		var tagname = target.tagName.toLowerCase();
		if(tagname !== "a")
			return;
			
		var href = target.getAttribute("href");
		this._changeState(href);
	},
	_changeState : function(method) {
		this.state[method]();
		history.pushState({"method":method}, null, "index.html");				
	},
	state : {
		"all" : function() {
			document.getElementById("todo-list").className = "";
			this.selectNavigator(0);
		},
		"active" : function() {
			document.getElementById("todo-list").className = "all-active";
			this.selectNavigator(1);
		},
		"completed" : function() {
			document.getElementById("todo-list").className = "all-completed";
			this.selectNavigator(2);
		},
		selectNavigator : function(index) {
			var navigationList = document.querySelectorAll("#filters a");
			navigationList[this.selectedIndex].classList.remove("selected");
			navigationList[index].classList.add("selected");
			
			this.selectedIndex = index;
		},
		selectedIndex : 0
	},
	clear : function() {
		this.list.innerHTML = "";
	},
	add: function(v) {
		var xhr = todoSync.add(v, function(r) {
			return r.json().then(function(data) {
				data.todo = v;
				TODO._add(data);				
			});

		});	
	},
	_add: function(data) {
		if(!data)
			return;
		if(data.status === "remove")
			return;
			
		var title = data.todo;
		var id = data.id || data.insertId;
		var className = (typeof data.completed === "undefined") ? "appending" : (data.completed ? "completed" : "");
		var checked = (className === "completed")? "checked" : "";
		var html = changeTemplate(SAMPLE_TODO, {title:title, id : id, className:className, checked: checked});
		
		this.list.insertAdjacentHTML("afterbegin", html);
		var li = this.list.querySelector(".appending");
		if(li) {
			li.offsetHeight;
			li.classList.remove("appending");
		}
		/*
		var _duration = 500;
		var _targetHeight = 58;
		var _startTime = 0;
		requestAnimationFrame(function _addTodo(t) {
			if(!li)
				return;
		
			if(!_startTime)
				_startTime = t;
				
				
			var now = t - _startTime;
			if(_duration <= now) {
				li.className = "";
				li.style.height = "";
				return;
			}
			var height = parseInt(now/_duration * _targetHeight);
			
			li.style.height = height + "px";
			
			requestAnimationFrame(_addTodo);
		});	
*/
	},
	complete : function(li, checked) {
		if(checked)
			li.classList.add("completed");
		else
			li.classList.remove("completed");
		
		var id = li.getAttribute("data-id");
		todoSync.complete(id, checked);
	},
	event : {
		destroy : function(e) {
			console.log(e);
			var li = e.target.parentNode.parentNode;
			li.classList.add("deleting");
			var id = li.getAttribute("data-id");
			todoSync.remove(id);
			li.addEventListener("transitionend", function(e) {
				li.remove();
			});		
		},
		toggle : function(e) {
			var input = e.target;
			var li = input.parentNode.parentNode;
			TODO.complete(li, input.checked);	
		}
	},
	
}

/*
	O(n^2)
	
*/

//asdasdasdasd
function autoDelegate(autoList, list, e) {
	var length = list.length;
	var obj;
	for(var i = 0; i < length; ++i) {
		if(!(obj = autoList[list[i]]))
			continue;
		if(typeof obj === "function")
			obj(e);
		else
			autoDelegate(obj, list, e)
		
		return;
	}
}
document.addEventListener("DOMContentLoaded", function() {
	TODO.init();
	
	var inputTodo = document.getElementById("new-todo");
	inputTodo.addEventListener("keydown", function(e) {
		console.log("keydown");
		if(e.keyCode === ENTER_KEYCODE) {
			var value =  inputTodo.value;
			TODO.add(value);
			inputTodo.value = "";
		}
	});	
	
	
});