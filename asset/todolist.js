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
			for(var i=0; i<e.length; i++) {
				var completed = e.completed == 1 ? "completed" : null;
				var todoLi = this.build(e.todo, e.id, completed);
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
			}
		}.bind(this));

	},
	build : function(enteredTitle, key, completed) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {title : enteredTitle, key : key, completed : completed};
		var todo = template(context);

		return todo;
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = e.target.value;

			//콜백으로 변경 
			TODOSync.add(todo, function(json) {
				console.log(json);

				var todoLi = this.build(todo, json.insertId);	//key값 넣어줌 
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
				document.getElementById("new-todo").value = "";
					
				var target = document.getElementById("todo-list").querySelector("li:nth-last-child(1)");
				target.className = "appending";

			
				//이 부분도 deleteTODO 에서와 마찬가지로 transitionend를 써서 동일하게 구현하고 싶은데
				//두 개가 동작 방식 자체가 다른건지 이 부분은 transitionend 코드가 동작하지 않네요 
				//여기에도 transitionend을 써서 구현할 수 있나요? 
		    	setTimeout(function () {
		       	 	target.className = "";
		   	 	}, 100);

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


