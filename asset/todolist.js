Templates = {}; 
Templates.todoTemplate = [
	'<li data-key={{insertId}} class={{completed}}>',
		'<div class="view">',
			'<input class="toggle" type="checkbox" {{checked}}>',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
	'</li>'
].join("\n");

jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

var TODO = {
	ENTER_KEYCODE : 13,
	selectedTarget : null,
	TODO_URL : "http://128.199.76.9:8002/JB1021/",
	init : function(){
		$(window).on("online offline", this.onoffLineListener);
		$(window).on("popstate", this.changeURLFilter.bind(this));
		$(document).on("DOMContentLoaded", function(){
			$("#new-todo").on("keydown", this.add.bind(this)); 
			$("#todo-list").on("click", this.completed.bind(this));
			$("#todo-list").on("click", this.remove.bind(this));
			$("#filters").on("click", this.changeStateFilter.bind(this));
		}.bind(this));

		var taskManager = (navigator.onLine)? OnLineTaskManager : OffLineTaskmanger;
		tempStorage.copyLocalstorage();
		tempStorage.initWhenisNull();
		tempStorage.commitToLocalStorage();

		taskManager.sync();
		
		this.selectedTarget = $("#filters .selected");
		history.pushState({"href":"index.html"}, null, "index.html");
	},
	onoffLineListener : function(){
		$(header).toggleClass("offline", navigator.offLine);
		if(navigator.onLine){
			OnLineTaskManager.offToOn();
		}
	},
	add : function(e){
		var taskManager = (navigator.onLine)? OnLineTaskManager : OffLineTaskmanger;
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = $("#new-todo").val();
			taskManager.addTodo(todo);
  		}
	},
	remove : function(e){
		var taskManager = (navigator.onLine)? OnLineTaskManager : OffLineTaskmanger;
		var destroy = $(e.target);
		if(destroy.attr("class") !== "destroy") return;
		var li = destroy.parents("li");
		taskManager.removeTodo(li);
	},
	completed : function(e){
		var taskManager = (navigator.onLine)? OnLineTaskManager : OffLineTaskmanger;
		var input = $(e.target);
		var li = input.parents("li");
		var completed = input.is(":checked")?1:0;
		taskManager.completeTodo(li, input, completed);
	}, 
	build : function(title, insertId, completed){
		var completed = (completed == 1)?"completed":"";
		var checked = (completed == 1)?"checked":"";
		var todoObj = { title : title , insertId : insertId, completed : completed, checked : checked};
		var template = Handlebars.compile(Templates.todoTemplate);
		return $(template(todoObj));
	},
	allView : function(){
		$("#todo-list").removeClass("all-active").removeClass("all-completed");
	},
	activeView : function(){
		$("#todo-list").addClass("all-active").removeClass("all-completed");
	},
	completeView : function(){
		$("#todo-list").removeClass("all-active").addClass("all-completed");
	},
	changeSelectedClass : function(href){
		var target = $("#filters a[href='"+href+"']");
		target.addClass("selected");	
		this.selectedTarget.removeClass("selected");
		this.selectedTarget = target;
	},
	changeURLFilter : function(e){
		var href = e.originalEvent.state.href;
		if(href === "active"){
			this.activeView();
		} else if(href === "completed"){
			this.completeView();
		} else {
			this.allView();
		}
		this.changeSelectedClass(href);
	},
	changeStateFilter : function(e){
		e.preventDefault();

		var target = $(e.target);
		if(target.get(0).tagName.toLowerCase() !== "a") return;
		
		var href = target.attr("href");
		if(href === "active"){
			history.pushState({"href":"active"}, null, "active");
			this.activeView();
		} else if(href === "completed"){
			history.pushState({"href":"completed"}, null, "completed");
			this.completeView();
		} else {
			history.pushState({"href":"index.html"}, null, "index.html");
			this.allView();
		}
		this.changeSelectedClass(href);
	}
}

var OnLineTaskManager = {
	sync : function(){
		tempStorage.allTodo = "";
		$.get(TODO.TODO_URL, function(result){
			for(var i in result){
				console.log(result);
				var li = TODO.build(result[i].todo, result[i].id, result[i].completed);
				$(li).css("opacity", "1");
				$("#todo-list").append(li);
			tempStorage.allTodo = tempStorage.allTodo.concat(result[i].id + ",");
			localStorage.setItem(result[i].id,result[i].todo);
			localStorage.setItem("allTodo",tempStorage.allTodo);
			}
		});
	},
	addTodo : function(todo){
		$.put(TODO.TODO_URL, {todo : todo}, function(result){
			var li = TODO.build(todo, result.insertId, result.completed);
			$("#todo-list").prepend(li);
			$("#new-todo").val("");
			setTimeout(function(){
				li.css("opacity", "1");
  			}, 10);	

			tempStorage.allTodo = tempStorage.allTodo.concat(result.insertId + ",");
			localStorage.setItem("allTodo",tempStorage.allTodo);
			localStorage.setItem(result.insertId,todo);
		});
	},
	removeTodo : function(li){
		$.delete(TODO.TODO_URL+li.data("key"), function(){
  			li.css("opacity", "0");
			li.on("transitionend", function(){
				li.remove();
			});
			var arrAllTodo = tempStorage.allTodo.split(",");
			var idx = arrAllTodo.indexOf(li.data("key"));
			tempStorage.allTodo = arrAllTodo.splice(idx, 1).toString();
			localStorage.setItem("allTodo",tempStorage.allTodo);
			localStorage.removeItem(li.data("key"));
		});
	},
	completeTodo : function(li, input, completed){
		$.post(TODO.TODO_URL+li.data("key"), {completed : completed}, function(result){
			li.toggleClass("completed", input.is(":checked"));
			if(localStorage.getItem(li.data("key"))==null) return;
			var strCompleted = localStorage.getItem(li.data("key")).concat(",1");
			console.log(strCompleted);
			localStorage.setItem(li.data("key"), strCompleted);
		});
	},
	offToOn : function(){
		var addId = tempStorage.addTodo.split(",");
		for(var i=0; i < addId.length-1; i++){
			todo = localStorage.getItem(addId[i]);
			console.log(todo);
			$.put(TODO.TODO_URL, {todo : todo});
		}

		// var completedId = tempStorage.completeTodo.split(",");
		// for(var i=0; i < completedId.length-1; i++){
		// 	$.post(TODO.TODO_URL+completedId[i], 1);
		// }

		var deleteId = tempStorage.deleteTodo.split(",");
		for(var i=0; i < deleteId.length-1; i++){
			$.delete(TODO.TODO_URL+deleteId[i]);
		}

		localStorage.clear();
		tempStorage.initWhenisNull();
	}
}

var OffLineTaskmanger = {
	sync : function(){
		var arrAllTodoId = localStorage.getItem("allTodo").split(",");
		for(var i = 0; i < arrAllTodoId.length-1; i++){
			if(localStorage.getItem(arrAllTodoId[i])===null) return;;
			var todo = localStorage.getItem(arrAllTodoId[i]).split(",");
			var li = TODO.build(todo[0], arrAllTodoId[i], todo[1]);
			$(li).css("opacity", "1");
			$("#todo-list").append(li);
		}
	},
	addTodo : function(todo){
		var li = TODO.build(todo, tempStorage.tempId, 0);
		$("#todo-list").prepend(li);
		$("#new-todo").val("");
		setTimeout(function(){
			li.css("opacity", "1");
  		}, 10);	
		tempStorage.addTodo = tempStorage.addTodo.concat(tempStorage.tempId + ",");
		localStorage.setItem("addTodo",tempStorage.addTodo);
		tempStorage.allTodo = tempStorage.allTodo.concat(tempStorage.tempId + ",");
		localStorage.setItem("allTodo",tempStorage.allTodo);
		localStorage.setItem(tempStorage.tempId++,todo);
		localStorage.setItem("tempId",tempStorage.tempId);
	},
	removeTodo : function(li){
		li.css("opacity", "0");
			li.on("transitionend", function(){
			li.remove();
		});
		tempStorage.deleteTodo = tempStorage.deleteTodo.concat(li.data("key") + ",");
		localStorage.setItem("deleteTodo",tempStorage.deleteTodo);
		localStorage.removeItem(li.data("key"));
		
		var arrAllTodo = tempStorage.allTodo.split(",");
		var idx = arrAllTodo.indexOf(String(li.data("key")));
		arrAllTodo.splice(idx, 1);
		str = arrAllTodo.join();
		localStorage.setItem("allTodo",str);

		localStorage.removeItem(li.data("key"));
	},
	completeTodo : function(li, input, completed){
		li.toggleClass("completed", input.is(":checked"));
		var strCompleted = localStorage.getItem(li.data("key"));
		localStorage.setItem(li.data("key"), strCompleted);
		tempStorage.completeTodo = tempStorage.completeTodo.concat(li.data("key") + ",");
		localStorage.setItem("completeTodo",tempStorage.completeTodo);
	}
}

var tempStorage = {
	allTodo : null,
	addTodo : null,
	deleteTodo : null,
	completeTodo: null,
	tempId : null,
	
	copyLocalstorage : function(){
		this.allTodo = localStorage.getItem("allTodo");
		this.addTodo = localStorage.getItem("addTodo");
		this.deleteTodo = localStorage.getItem("deleteTodo");
		this.completeTodo = localStorage.getItem("completeTodo");
		this.tempId = localStorage.getItem("tempId");
		console.log(this.allTodo);
	},
	initWhenisNull : function(){
		console.log(this.allTodo);
		if(this.allTodo === null) this.allTodo = "";
		if(this.addTodo === null) this.addTodo = "";
		if(this.deleteTodo === null) this.deleteTodo = "";
		if(this.completeTodo === null) this.completeTodo = "";
		if(this.tempId === null) this.tempId = 0;
	},
	commitToLocalStorage : function(){
		localStorage.setItem("allTodo", this.allTodo);
		localStorage.setItem("addTodo", this.addTodo);
		localStorage.setItem("deleteTodo", this.deleteTodo);
		localStorage.setItem("completeTodo", this.completeTodo);
		localStorage.setItem("tempId", this.tempId);
	}

}

TODO.init();