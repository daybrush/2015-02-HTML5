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

var localStorageManager = {
	storage : window.localStorage,
	offlineId : window.localStorage['offlineId'] || 0,
	displayWhenOffId : window.localStorage['displayWhenOffId'] || 0,
	get : function(callback){
		var arrReturn = [];
		for(var i in this.storage) {
			if(i === "offlineId") continue;
			if(i === "displayWhenOffId") continue;
			arrReturn.push(JSON.parse(this.storage.getItem(i)));
		}
		callback(arrReturn);
	},
	add : function(sTodo, mode, callback){
		if(mode === "offline") {
			this.storage.setItem("writtenOff" + this.offlineId, JSON.stringify({"id" : this.offlineId, "todo" : sTodo, "completed" : 0, "offWrittenData" : true, "displayWhenOffId" : this.displayWhenOffId})),
			this.storage["offlineId"] = ++this.offlineId;
		} else {
			this.storage.setItem("displayWhenOff" + this.displayWhenOffId, JSON.stringify({"id" : this.displayWhenOffId, "todo" : sTodo, "completed" : 0, "offWrittenData" : false})),
			this.storage["displayWhenOffId"] = ++this.displayWhenOffId;
		}
		
		if(!callback)
			return;

		callback({insertId : this.offlineId, "displayWhenOffId" : this.offlineId});
	},
	remove : function(todoId, callback){
		this.storage.removeItem(todoId);
		callback({affectedRows: 1});	
	},
	completed: function(param, callback){
		var json = JSON.parse(this.storage.getItem(param.key));
		if(json.completed == 1) {
			json.completed = 0;
		} else {
			json.completed = 1;
		}
		this.storage.setItem(json.id, JSON.stringify(json));
		callback();
	},
	clearOffData: function(){
		for(var i = 0; i < this.storage['offlineId']; i++) {
			this.storage.removeItem("writtenOff" + i);
		}
	},
	clearDisplayWhenOffData: function(){
		for(var i = 0; i < this.storage['displayWhenOffId']; i++) {
			this.storage.removeItem("displayWhenOff" + i);
		}
		this.displayWhenOffId = 0;
	}
}

var TODOOnline = {
	apiAddress : "http://128.199.76.9:8002",
	get : function(callback){
		Ajax.send({
			httpMethod : "GET",
			url : this.url("/hataeho1"),
			callback : callback
		}); 
	},
	add : function(sTodo, callback, mode){
		Ajax.send({
			httpMethod : "PUT",
			url : this.url("/hataeho1"),
			sParam : "todo="+sTodo,
			callback : callback
		}); 
		if(mode != "sync") {
			localStorageManager.add(sTodo, "online");
		}
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

var TODOOffline = {
	get : function(callback){
		localStorageManager.get(callback);
	},
	add : function(sTodo, callback){
		localStorageManager.add(sTodo, "offline", callback);
		this.offlineId++;
	},
	completed : function(param, callback){
		localStorageManager.completed(param, callback);
	},
	remove : function(param, callback){
		localStorageManager.remove(param.key, callback);
	}
}

var TODODataManager = {
	onOffFunctionSetToUse : false,
	init : function() {
		this.onOffFunctionSetToUse = navigator.onLine ? TODOOnline : TODOOffline;
		window.addEventListener("online", this.onOfflineListener.bind(this));
		window.addEventListener("offline", this.onOfflineListener.bind(this));
	},
	onOfflineListener : function(){
		// if(navigator.online) {
		// 	document.getElementById("header").classList.remove("offline");
		// } else {
		// 	document.getElementById("header").classList.add("offline");
		// }
		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		this.onOffFunctionSetToUse = navigator.onLine ? TODOOnline : TODOOffline;
		this.sync();
	},
	get : function(callback){
		this.onOffFunctionSetToUse.get(callback);
	},
	add : function(sTodo, callback){
		this.onOffFunctionSetToUse.add(sTodo, callback);
	},
	completed : function(param, callback){
		this.onOffFunctionSetToUse.completed(param, callback);
	},
	remove : function(param, callback){
		this.onOffFunctionSetToUse.remove(param, callback);
	},
	sync : function(){
		if(navigator.onLine) {
			TODOOffline.get(function(arrData){
				var length = 0;
				for(var i = 0; i < arrData.length; i++) {
					var eachTodo = arrData[i];

					if(!eachTodo.offWrittenData) continue;

					TODOOnline.add(eachTodo.todo, function(){
						if(arrData.length <= ++length) {

							// window.localStorage.clear();

							TODOOnline.get(function(data){
								document.getElementById("todo-list").innerHTML = "";
								TODO.displayTodoList(data);
							});	
						}
					}, "sync");
				}
				localStorageManager.clearOffData();
			});
		} else {
			
		}
	},
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
			document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		
			if(navigator.onLine){
				localStorageManager.clearDisplayWhenOffData();
			
				TODODataManager.get(function(data){
					for(var i = 0; i < data.length; i++){
						localStorageManager.add(data[i].todo, null, function(){});
						// localStorage["displayWhenOff"+i] = JSON.stringify(data[i]);
					}
					this.displayTodoList(data);
				}.bind(this));
			} else {
				TODODataManager.get(function(data){
					this.displayTodoList(data);
				}.bind(this));
			}
		}.bind(this));
	},
	displayTodoList : function(arrTodos){
		var document = window.document;
		arrTodos.forEach(function(arr) {
			var completed = arr.completed == 1 ? "completed" : "";
			var checked = arr.completed == 1 ? "checked" : "";
			var sTodoEle = this.build(arr.todo, arr.id, completed, checked, arr.displayWhenOffId);
			var todoList = document.getElementById("todo-list");
			todoList.insertAdjacentHTML("beforeend", sTodoEle);
		}.bind(this));
	},
	build : function(sTodoMessage, nKey, completed, checked, displayWhenOffId) {
		if(sTodoMessage === "") return;
		
		var template = Handlebars.compile(document.getElementById("Todo-template").innerHTML);
		var context = {todoMessage : sTodoMessage, key : nKey, completed : completed, checked : checked, offkey : displayWhenOffId};
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
		TODODataManager.completed({
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
			TODODataManager.remove({
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
				
			TODODataManager.add(sMsg, function(json){
				console.log(json.displayWhenOffId);
				var sTodoEle = this.build(e.target.value, json.insertId, null, null, json.displayWhenOffId);
				var todoList = document.getElementById("todo-list");
				todoList.insertAdjacentHTML("beforeend", sTodoEle);
				e.target.value = "";
			}.bind(this));
		}	
	}
}

TODODataManager.init();
TODO.init();