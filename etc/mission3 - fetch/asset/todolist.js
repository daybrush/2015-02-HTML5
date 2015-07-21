var TODOSync = {
	apiAddress : "http://128.199.76.9:8002",
	get : function(callback){
		this.fetch({
			httpMethod : "GET",
			url : this.url("/hataeho1"),
			callback : callback
		}); 
	},
	add : function(sTodo, callback){
		this.fetch({
			httpMethod : "PUT",
			url : this.url("/hataeho1"),
			sParam : "todo="+sTodo,
			callback : callback
		}); 
	},
	completed : function(param, callback){
		this.fetch({
			httpMethod : "POST",
			url : this.url("/hataeho1/"+param.key),
			sParam : "completed="+param.completed,
			callback : callback
		});
	},
	remove : function(param, callback){
		this.fetch({
			httpMethod : "DELETE",
			url : this.url("/hataeho1/"+param.key),
			callback : callback
		});
	},
	url : function(sApi) {
		return this.apiAddress + sApi;
	},
	fetch : function(reqParam) {
		fetch(reqParam.url, {
			method : reqParam.httpMethod,
			body : reqParam.sParam,
			headers : {  
      			"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
    		}
		}).then(function(res){
			if(res.status !== 200) {
				alert("Transient error has occurred. Please try again later");
				return;
			}

			res.json().then(function(data) {
				reqParam.callback(data);
			}).catch(function(err) {
				alert(err);
			})
		});
	}
}

var TODO = {
	ENTER_KEYCODE : 13, 
	init : function(){
		if(!Util.isBrowserSupportFetch()){
			alert("Your browser does not support fetch API\n In this the browser, you can not use the service");
			return;
		}
		var document = window.document;
		document.addEventListener("DOMContentLoaded", function(){
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
			document.getElementById("todo-list").addEventListener("click", this.completed);
			document.getElementById("todo-list").addEventListener("click", this.markRemoveTarget);
			document.getElementById("todo-list").addEventListener("animationend", this.remove);
			TODOSync.get(this.displayTodoList.bind(this));
		}.bind(this));
	},
	displayTodoList : function(arrTodos){
		var document = window.document;
		arrTodos.forEach(function(arr) {
			var completed = arr.completed == 1 ? "completed" : "";
			var checked = arr.completed == 1 ? "checked" : "";
			var sTodoEle = this.build(arr.todo, arr.id, completed, checked);
			var todoList = document.getElementById("todo-list");
			todoList.insertAdjacentHTML("beforeend", sTodoEle);
		}.bind(this));
	},
	build : function(sTodoMessage, nKey, completed, checked) {
		if(sTodoMessage === "") return;
		
		var template = Handlebars.compile(document.getElementById("Todo-template").innerHTML);
		var context = {todoMessage : sTodoMessage, key : nKey, completed : completed, checked : checked};
		return template(context);
	},
	completed : function(e) {
		var target = e.target;
		if(target.nodeName !== "INPUT" || target.className !== "toggle") {
			return;
		}

		var checkBtn = target;
		var li = checkBtn.parentNode.parentNode;
		var completed = checkBtn.checked ? "1" : "0";
		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		}, function(){
			if(checkBtn.checked) {
				li.classList.add("completed");
			} else {
				li.classList.remove("completed");
			}
		});
	},
	markRemoveTarget : function(e) {
		var target = e.target;
		if(target.nodeName !== "BUTTON" || target.className !== "destroy") {
			return;
		}

		var destroyBtn = target;
		var li = destroyBtn.parentNode.parentNode;
		li.classList.add("deleteAnimate");
	},
	remove : function(e) {
		var ele = e.target;
		if(ele.classList.contains("deleteAnimate")){
			ele.parentNode.removeChild(ele);
			TODOSync.remove({
				"key" : ele.dataset.key
			}, function(json){
				if(json.affectedRows !== 1) {
					alert("Transient error has occurred. Please try again later");
					location.reload();
				}
			})
		}	
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var sMsg = e.target.value;
			if(sMsg === ""){
				alert("missing Todo Message");
				return;
			}
				
			TODOSync.add(sMsg, function(json){
				var sTodoEle = this.build(e.target.value, json.insertId);
				var todoList = document.getElementById("todo-list");
				todoList.insertAdjacentHTML("beforeend", sTodoEle);
				e.target.value = "";
			}.bind(this));
		}	
	}
}

var Util = {
	isBrowserSupportFetch : function(){
		return 'fetch' in window;	
	}
}

TODO.init();