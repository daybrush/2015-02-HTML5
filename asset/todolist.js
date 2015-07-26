/*141005 KwonDaye*/

var todoSync = {
	get: function() {
		$.ajax({
			url: "http://128.199.76.9:8002/FreshFleshFlash",
			type: "get",
			data: {},
			success: function(data) {
				todo.init(data);
			}
		})
	},

	add: function(todo, callback) {
		$.ajax({
			url: "http://128.199.76.9:8002/FreshFleshFlash",
			type: "put",
			data: {
				todo: todo
			},
			success: function(data) {
				callback(data);
			}
		})
	},

	complete:  function(param, callback) {
		$.ajax({
			url: "http://128.199.76.9:8002/FreshFleshFlash/" + param.key,
			type: "post",
			data: {
				completed: param.complete
			},
			success: function(data) {
				callback(data);
			}
		})
	},
	
	remove: function(param, callback) {
		$.ajax({
			url: "http://128.199.76.9:8002/FreshFleshFlash/" + param.key,
			type: "delete",
			data: {},
			success: function(data) {
				callback(data);
			}
		})
	}
};

var todo = {
	KEYCODE_ENTER: 13,

	init: function(data) {
		for(var i = data.length - 1; i >= 0; i--) {
			var todo = data[i].todo;
			var className = (data[i].completed == 1) ? "completed" : "";
			var li = this.make(todo, data[i].id, className);
			$("#todo-list").append(li);  //==> for 바깥으로
		}

		$("#new-todo").keydown(this.add.bind(this));
		$("#todo-list").on("click", ".toggle", this.complete.bind(this));	//on을 쓴다면 currentTarget == target이겠지, 항상 
		$("#todo-list").on("click", ".destroy", this.remove.bind(this));		
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
				//$(li).addClass("completed");
				li.className = "completed";
			} else {
				//$(li).addClass("");
				li.className = "";
			}	
		});
	},

	remove: function(e) {
		var li = e.target.parentNode.parentNode;

		todoSync.remove({
			"key": li.dataset.key
		}, function() {
			li.className = "deleting";
			//$(li).addClass("deleting");
			$(li).bind("transitionend", function(e) { 
				$(this).remove();
			});
		});
	}
};

$(document).ready(function() {
	todoSync.get();
});