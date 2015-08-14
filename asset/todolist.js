var TODOSync = {
	myURL : "http://128.199.76.9:8002/030ii/",

	get : function(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.myURL, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		xhr.send();
	},

	add : function(todo, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", this.myURL, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		xhr.send("todo=" + todo);
	},
	
	completed : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", this.myURL + param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});		
		xhr.send("completed=" + param.completed);
	},
	
	remove : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("Delete", this.myURL + param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		xhr.send();
	}
}

var TODO = {
	init : function(){
		document.addEventListener("DOMContentLoaded", function(){
			this.get();
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this)); // keypress로 해도됨! 
			document.getElementById("todo-list").addEventListener("click", function(e){
				if(e.target.className == "toggle"){
					this.completed(e);
				}
				if(e.target.className == "destroy"){
					this.remove(e);
				}
			}.bind(this));
		}.bind(this));
	},

	get : function(){
		TODOSync.get(function(json){
			console.log(json);
			for(var i=0; i<json.length;i++){
				var completed = json[i].completed === 1 ? "completed" : ""; // 이전에 완료했던 투두라면 클래스명을 "completed"인 상태 그대로 보여줘야함
				var todoLi = this.makeTODO({todoName: json[i].todo, key: json[i].id, completed: completed});
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
			}
		}.bind(this));
	},

	makeTODO : function(objTodo){
		var source   = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {todoName: objTodo.todoName, key: objTodo.key, completed: objTodo.completed};
		var todoTemplate = template(context);

		return todoTemplate;
	},

	add : function(e){
		var ENTER_KEYCODE = 13;
		if(e.keyCode === ENTER_KEYCODE){ // 엔터를 눌렀을 때 
			var todo = document.getElementById("new-todo").value;

			TODOSync.add(todo, function(json){
				//var todoLi = this.makeTODO(todo, json.insertId);
				var todoLi = this.makeTODO({todoName: todo, key: json.id});

				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
				document.getElementById("new-todo").value = "";
			}.bind(this));
		}
	},

	completed : function(e){
		var input = e.target;
		var li = input.parentNode.parentNode;
		var completed = input.checked?"1":"0";
		
		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		}, function(){
			if(completed==="1"){
				li.className = "completed";
			} else {
				li.className = "";
			}
		});
	},

	remove : function(e){
		var li = e.target.parentNode.parentNode;
		
		TODOSync.remove({
			"key" : li.dataset.key
		}, function(){
			li.classList.add("deleting");
		
			setTimeout(function() {
		        li.parentNode.removeChild(li);
		    },1000);
		});
		
	}
};

TODO.init();

