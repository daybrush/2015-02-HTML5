/**
 * Send Ajax Request
 * @param reqParam Parameters required for the Ajax request
 * @param reqParam.httpMethod Select the http method to use for Ajax requests
 * @param reqParam.async false if you want to proceed Ajax request in a synchronous manner; true(or omit this property) otherwise
 * @param reqParam.url The address to send an Ajax request
 * @param reqParam.sParam The parameter string to be included in the Ajax request
 * @param reqParam.callback Callback function for the Ajax request response
 */
var Ajax = {
	send : function(reqParam){
		var xhr = new XMLHttpRequest();
		xhr.open(reqParam.httpMethod, reqParam.url, (reqParam.async == undefined) ? true : reqParam.async);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			reqParam.callback(JSON.parse(xhr.responseText));
		});
		xhr.send(reqParam.sParam);
	}
}

var TODOSync = {
	apiAddress : "http://128.199.76.9:8002",
	get : function(callback){
		Ajax.send({
			httpMethod : "GET",
			url : this.url("/hataeho1"),
			callback : callback
		}); 
	},
	add : function(sTodo, callback){
		Ajax.send({
			httpMethod : "PUT",
			url : this.url("/hataeho1"),
			sParam : "todo="+sTodo,
			callback : callback
		}); 
	},
	completed : function(param, callback){
		Ajax.send({
			httpMethod : "POST",
			url : this.url("/hataeho1/"+param.key),
			sParam : "completed="+param.completed,
			callback : callback
		});
	},
	remove : function(param, callback){
		Ajax.send({
			httpMethod : "DELETE",
			url : this.url("/hataeho1/"+param.key),
			callback : callback
		});
	},
	url : function(sApi) {
		return this.apiAddress + sApi;
	}
}

var TODO = {
	ENTER_KEYCODE : 13, 
	init : function(){
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

TODO.init();