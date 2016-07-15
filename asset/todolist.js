var ENTER_KEYCODE = 13;
var SAMPLE_TODO = '<li class="{className}" data-id="{id}"><div class="view"><input class="toggle" type="checkbox" {checked}><label>{title}</label><button class="destroy"></button></div></li>';


function changeTemplate(sample, data) {
	var html = sample;
	for(var key in data) {
		html = html.replace("{" + key + "}", data[key]);
	}
	return html;
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
		if(this.isOnline) {
			var xhr = this.initXHR();
			xhr.addEventListener("load", function(e) {
	
				var data = JSON.parse(xhr.responseText), length = data.length;
				for(var i = length - 1; i >= 0; --i) {
					TODO._add(data[i]);
				}
			});
			xhr.send();
		} else {
			
		}
	},
	add: function(todo) {
		if(this.isOnline) {
			var xhr = this.initXHR("POST");
			xhr.addEventListener("load", function(e) {
				var data = JSON.parse(xhr.responseText);
				data.todo = todo;
				console.log(data);
				TODO._add(data);
			});	
			xhr.send("todo=" + todo);
		} else {
			
		}
	},///
	complete : function(id, isComplete) {
		if(this.isOnline) {
			var xhr = this.initXHR("PUT", id);
			xhr.addEventListener("load", function(e) {
				var data = JSON.parse(xhr.responseText);
			});	
			xhr.send("completed=" + (isComplete * 1));
		} else {
			
		}
	},
	remove :function(id) {
		if(this.isOnline) {
			var xhr = this.initXHR("DELETE", id);
			xhr.addEventListener("load", function(e) {
				var data = JSON.parse(xhr.responseText);
			});	
			xhr.send("");
			xhr.addEventListener("load", function(e) {
				console.log("remove" + id);
			});	
		} else {
			
		}
	}
}

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
		
		this.onofflineListener();
		todoSync.get();
		//this._changeState("all");
	},
	onofflineListener : function() {
		if(navigator.onLine) {
			document.getElementById("header").classList.remove("offline");
		} else {
			document.getElementById("header").classList.add("offline");			
		}
		todoSync.isOnline = navigator.onLine;
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
		todoSync.add(v);	
	},
	_add: function(data) {
		if(!data)
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
<<<<<<< HEAD

//asdasdasdasd
=======
>>>>>>> 89f535c2c35e6e0b2474cbb76cd9ae21c5b5b60f
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