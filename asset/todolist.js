var TODOSync = {
	get : function(callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", "http://128.199.76.9:8002/kimhyewon/", true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		
		xhr.send(null);
	},
	add : function(todo, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("PUT", "http://128.199.76.9:8002/kimhyewon/", true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		
		xhr.send("todo=" + todo);
	},
	completed : function(param, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("POST", "http://128.199.76.9:8002/kimhyewon/" + param.key, true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		
		xhr.send("completed=" + param.completed);
	},
	deleted : function(param, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("DELETE", "http://128.199.76.9:8002/kimhyewon/" + param.key, true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		
		xhr.send(null);
	}
}

var TODO = {
	ENTER_KEYCODE : 13,
	init : function() {
		document.addEventListener("DOMContentLoaded", function() {
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
			document.getElementById("todo-list").addEventListener("click", this.completed); //this 안썻기 때메 굳이 bind 필요 없다 
			document.getElementById("todo-list").addEventListener("click", this.deleted);
			this.get();
		}.bind(this))
	},
	get : function() {
		TODOSync.get(function(e){
			e = e.sort(function(a,b){
				return a.id > b.id;
			});
			e.forEach(function(arr){
				var completed = arr.completed == 1 ? "completed" : null;
				var todoLi = this.build(arr.todo, arr.id, completed);
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
			}.bind(this));
		}.bind(this));
	},
	build : function(enteredTitle, key, completed, opacityVal) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {title : enteredTitle, key : key, completed : completed, val:opacityVal === undefined?1:opacityVal};
		var todo = template(context);

		return todo;
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = e.target.value;

			//콜백으로 변경 
			TODOSync.add(todo, function(json) {
				console.log(json);

				var todoLi = this.build(todo, json.insertId,0,0);	//key값 넣어줌 
				document.getElementById("todo-list").insertAdjacentHTML('afterbegin', todoLi);
				document.getElementById("new-todo").value = "";
					
				var target = document.getElementById("todo-list").querySelector("li:nth-child(1)");
				// target.className = "appendig";

		    	setTimeout(function () {
		       	 	// target.className = "";
		       		target.style.opacity = 1; 	
		   	 	}, 100);


				// console.log(target);
				// target.addEventListener("transitionend", function(){
				// 	console.log("dddd");
				// 	// target.className = ""; 
				// }.bind(this));
				// target.offsetHeight;
				
			}.bind(this));
		}
	}, 
	completed : function(e) {
		var input = e.target;
		var li = e.target.parentNode.parentNode;
		var completed = input.checked?"1":"0";	//체크 돼있으면 1, 안돼있으면 0 

		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		}, function() {
			if(input.className === "toggle") {	//이 부분 꼭 필요! 
				if(completed==="1") {
					li.className = "completed";
				}
				else {
					li.className = "";
				}
			}
		})
		
	},
	deleted : function(e) {
		var button = e.target;
		if(button.className === "destroy") {	//이 부분 꼭 필요! 
			var li = e.target.parentNode.parentNode;
			console.log(li);

			TODOSync.deleted({
				"key" : li.dataset.key
			}, function(){
				li.className = "deleting";
				
				li.addEventListener("transitionend", function(){
					li.parentNode.removeChild(li);
				}.bind(this))
			})
		}
	}
};

TODO.init();


