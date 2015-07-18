var Ajax = {
	send : function(sHttpMethod, bAsync, sGlobalUrl, sApi, sParam, callback){
		var xhr = new XMLHttpRequest();
		xhr.open(sHttpMethod,sGlobalUrl+sApi,bAsync);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send(sParam);
	}
}

var TODOSync = {
	globalUrl : "http://128.199.76.9:8002",
	get : function(callback){
		Ajax.send("GET", true, this.globalUrl, "/hataeho1", null, function(jsonData){
			callback(jsonData);
		});
	},
	add : function(sTodo, callback){
		Ajax.send("PUT", true, this.globalUrl, "/hataeho1", "todo="+sTodo, function(jsonData){
			callback(jsonData);
		});
	},
	completed : function(param, callback){
		Ajax.send("POST", true, this.globalUrl, "/hataeho1/"+param.key, "completed="+param.completed, function(jsonData){
			callback(jsonData);
		});
	},
	remove : function(param, callback){
		Ajax.send("DELETE", true, this.globalUrl, "/hataeho1/"+param.key, null, function(jsonData){
			callback(jsonData);
		});
	}
}

var TODO = {
	ENTER_KEYCODE : 13, 
	init : function(){
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
		if(sTodoMessage === "") {
			throw new EmptyStringError("missing Todo Message");
		}

		var source = document.getElementById("Todo-template").innerHTML;
		var template = Handlebars.compile(source);

		var context = {todoMessage : sTodoMessage, key : nKey, completed : completed, checked : checked};
		var sHtml = template(context);
		return sHtml;
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
		})
		
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
					alert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요");
					location.reload();
				}
			})
		}	
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			TODOSync.add(e.target.value, function(json){
				try{
					var sTodoEle = this.build(e.target.value, json.insertId);
				} catch(err) {
					alert(err.message);
					return;
				}

				var todoList = document.getElementById("todo-list");
				todoList.insertAdjacentHTML("beforeend", sTodoEle);
				e.target.value = "";
			}.bind(this));
		}	
	}
}

function EmptyStringError(sMessage) {
	this.name = "EmptyStringError";
	this.message = sMessage;
}

EmptyStringError.protoType = new Error();

TODO.init();
