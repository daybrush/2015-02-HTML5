/*141005 KwonDaye*/

var id = 0;

var dataArr = [];

var todoSync = {
	url: "http://128.199.76.9:8002/FreshFleshFlash/", 

	init: function() {		
		document.getElementById("header").classList[navigator.onLine ? "remove" : "add"]("offline");

		window.addEventListener("online", this.onofflineListener());
		window.addEventListener("offline", this.onofflineListener());
	},

	onofflineListener: function() {
		document.getElementById("header").classList[navigator.onLine ? "remove" : "add"]("offline");

		if(navigator.onLine) {
			//서버로 싱크 맞추기

		} 
	},

	makeArr: function() {
		for(var i = 0; i < 10; i++) {
			var retrievedItem = JSON.parse(localStorage.getItem("dataObject" + i));

			if(!retrievedItem) {
				continue;
			}

			dataArr.push(retrievedItem);
		}
	},

	get: function() {
		if(navigator.onLine) {
			$.ajax({
				url: this.url,
				type: "get",
				data: {},
				success: function(data) {
					todo.init(data);
				}
			})
		} else {
			// var retrievedItem = localStorage.getItem("dataArr");
			// todo.init(JSON.parse(retrievedItem));
			// for(var i = 0; i < 10; i++) {
			// 	var retrievedItem = JSON.parse(localStorage.getItem("dataObject" + i));
			// 	if(!retrievedItem) {
			// 		console.log("continue!");
			// 		continue;
			// 	}
			// 	dataArr.push(retrievedItem);
			// }
			this.makeArr();
			todo.init(dataArr);
		}
	},

	add: function(todo, callback) {
		if(navigator.onLine) {
			$.ajax({
				url: this.url,
				type: "put",
				data: {
					todo: todo
				},
				success: function(data) {
					callback(data);
				}
			})
		} else {
			//data를 클라이언트에 저장 ==> localStorage, indexedDB, websql
			// dataArr[id] = {"insertId": id, "id": id, "todo": todo, "completed": 0};
			// localStorage.setItem("dataArr", JSON.stringify(dataArr));
			// callback(dataArr[id]);
			// id++;

			var dataObject = {"insertId": id, "id": id, "todo": todo, "completed": 0};
			localStorage.setItem("dataObject" + id, JSON.stringify(dataObject));
			callback(dataObject);
			id++;
		}
	},

	complete: function(param, callback) {
		if(navigator.onLine) {
			$.ajax({
				url: this.url + param.key,
				type: "post",
				data: {
					completed: param.complete
				},
				success: function(data) {
					callback();
				}
			})
		} else {
			var todo = JSON.parse(localStorage.getItem("dataObject" + param.key)).todo;
			var dataObject = {"insertId": param.key, "id": param.key, "todo": todo, "completed": param.complete};
			localStorage.setItem("dataObject" + param.key, JSON.stringify(dataObject));
			callback();
		}
	},
	
	remove: function(param, callback) {
		if(navigator.onLine) {
			$.ajax({
				url: this.url + param.key,
				type: "delete",
				data: {},
				success: function(data) {
					callback();
				}
			})
		} else {
			localStorage.removeItem("dataObject" + param.key);
			callback();
		}	
	}
};

var todo = {
	KEYCODE_ENTER: 13,

	selectedIndex: 0,

	init: function(data) {
		for(var i = data.length - 1; i >= 0; i--) {
			var todo = data[i].todo;
			var className = (data[i].completed == 1) ? "completed" : "";
			var checked = (data[i].completed == 1) ? "checked" : "";
			var li = this.make(todo, data[i].id, className, checked);
			$("#todo-list").append(li);  //==> for 바깥으로
		}

		$("#new-todo").keydown(this.add.bind(this));
		$("#todo-list").on("click", ".toggle", this.complete.bind(this));
		$("#todo-list").on("click", ".destroy", this.remove.bind(this));	

		document.getElementById("filters").addEventListener("click", this.changeStateFilter.bind(this));	
		window.addEventListener("popstate", this.changeURLFilter.bind(this));
	},

	changeURLFilter: function(e) {
		if(e.state) {
			var method = e.state.method;
			this[method + "View"]();
		} else {
			this.allView();
		}
	},

	changeStateFilter: function(e) {
		var target = e.target;
		var tagName = target.tagName.toLowerCase();

		if(tagName == "a") {
			var href = target.getAttribute("href");

			if(href === "index.html") {
 				this.allView();
 				history.pushState({"method": "all"}, null, "index.html");
			} else if(href === "active") {
				this.activeView();
				history.pushState({"method": "active"}, null, "active");
			} else if(href === "completed") {
				this.completedView();
				history.pushState({"method": "completed"}, null, "completed");
			}
		}

		e.preventDefault();
	},

	allView: function() {
		document.getElementById("todo-list").className = "";
		this.selectNavigator(0);
	},

	activeView: function() {
		document.getElementById("todo-list").className = "all-active";
		this.selectNavigator(1);
	},

	completedView: function() {
		document.getElementById("todo-list").className = "all-completed";
		this.selectNavigator(2);
	},

	selectNavigator: function(index) {
		var navigatorList = document.querySelectorAll("#filters a");
		navigatorList[this.selectedIndex].classList.remove("selected");
		navigatorList[index].classList.add("selected");
		this.selectedIndex = index;
	},
	
	make: function(todo, key, className, checked) {
		var source = $("#todo-template").html();
		var template = Handlebars.compile(source);
		var context = {doWhat: todo, liId: key, className: className, checked: checked};
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
				$(li).addClass("completed");
			} else {
				$(li).removeClass("completed");
			}	
		});
	},

	remove: function(e) {
		var li = e.target.parentNode.parentNode;

		todoSync.remove({
			"key": li.dataset.key
		}, function() {
			$(li).addClass("deleting");
			$(li).bind("transitionend", function(e) { 
				$(this).remove();
			});
		});
	}
};

$(document).ready(function() {
	todoSync.init();
	todoSync.get();
});