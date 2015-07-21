/*141005 KwonDaye*/

// 역순으로
// 초록색 토글   

var todoSync = {
	
	get: function(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://128.199.76.9:8002/FreshFleshFlash", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	},
	
	add: function(todo, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://128.199.76.9:8002/FreshFleshFlash", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo=" + todo);
	},
	
	complete: function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://128.199.76.9:8002/FreshFleshFlash/" + param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + param.complete);
	},
	
	remove: function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://128.199.76.9:8002/FreshFleshFlash/" + param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	}
};

var todo = {
	
	KEYCODE_ENTER: 13,

	init: function() {
		$(document).ready(function() {
			todoSync.get(function(json) {
				for(var i in json) {
					var todo = json[i].todo;
					var className = (json[i].completed == 1) ? "completed" : "";;
					var li = this.make(todo, json[i].id, className);

					$("#todo-list").append(li);
				}
			}.bind(this));

			$("#new-todo").keydown(this.add.bind(this));
			$("#todo-list").on("click", ".toggle", this.complete.bind(this));	//on을 쓴다면 currentTarget == target이겠지, 항상 
			$("#todo-list").on("click", ".destroy", this.remove.bind(this));
		}.bind(this));
	},
	
	make: function(todo, key, className) {
		var source = $("#todo-template").html();
		var template = Handlebars.compile(source);
		var context = {doWhat: todo, liId: key, className: className};
		var html = template(context);
		return html;
	},

	add: function(e) {
		if(e.keyCode === this.KEYCODE_ENTER) {
			var todo = $("#new-todo").val();
			todoSync.add(todo, function(json) {
				var li = this.make(todo, json.insertId, "");
				$("#todo-list").append(li);
				$("#new-todo").val("");	
			}.bind(this));
		}
	},

	complete: function(e) {
		var input = e.target;
		var li = input.parentNode.parentNode;
		var complete = input.checked ? "1" : "0";

		todoSync.complete({
			"key": li.dataset.key,
			"complete": complete
		}, function() {
			if(complete == "1") {
				li.className = "completed";
				//$(li).addClass("completed");
			} else {
				li.className = "";
				//$(li).addClass("");
			}	
		});
	},

	remove: function(e) {
		var li = e.target.parentNode.parentNode;

		todoSync.remove({
			"key": li.dataset.key
		}, function() {
			li.className = "deleting";
			$(li).bind("webkitTransitionEnd", function(e) { 
				$(this).remove();				//--> 이것도 delegation으로 바깥으로 빼자. 	//$(e.currentTarget).remove();
			});
			$(li).bind("transitionend", function(e) { 
				$(this).remove();
			});
		});

	}
};

todo.init();

