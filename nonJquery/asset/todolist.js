/*
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
			if(!reqParam.callback) return;
			reqParam.callback(JSON.parse(xhr.responseText));
		});
		xhr.send(reqParam.sParam);
	}
}

var TODONetworkStorage = {
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
	completed : function(keyIndex, bCompleted){
		Ajax.send({
			httpMethod : "POST",
			url : this.url("/hataeho1/"+keyIndex),
			sParam : "completed="+bCompleted,
		});
	},
	remove : function(key){
		Ajax.send({
			httpMethod : "DELETE",
			url : this.url("/hataeho1/"+key),
		});
	},
	url : function(sApi) {
		return this.apiAddress + sApi;
	},
}

var TODOSyncManager = {
	localStorage : window.localStorage,
	networkIsOnline : navigator.onLine,
	init : function() {
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
		this.networkIsOnline = navigator.onLine;
		this.sync();
	},
	sync : function() {
		if(this.networkIsOnline) {
			setTimeout(function(){
				this.syncWhenOnline();
			}.bind(this), 50);
		}
	},
	syncWhenOnline : function() {
		var localStorage = window.localStorage;
		// Step 1 새로 추가된 TODO를 서버에 저장한다
		var currentKeyIndex = localStorage["keyIndex"]*1;
		var lastSyncedIndex = (localStorage["syncedLastIndex"] == 0) ? currentKeyIndex*1-2 : localStorage["syncedLastIndex"]*1;
		for(var idx = lastSyncedIndex+1; idx < currentKeyIndex; idx++) {
			if(!localStorage[idx]) continue;
			TODONetworkStorage.add(JSON.parse(localStorage[idx]), function(data){
				var originalTodo = JSON.parse(localStorage[idx-1]);
				originalTodo.serverKey = data.insertId;
				localStorage[idx-1] = JSON.stringify(originalTodo);
			});
		}
		localStorage["syncedLastIndex"] = currentKeyIndex - 1;

		// Step 2 삭제된 TODO를 서버에서 지운다
		var deleteTargets = localStorage["deletedIndexs"].split(", ");
		for (var i = 0; i < deleteTargets.length-1; i++) {
			TODONetworkStorage.remove(deleteTargets[i]);
		};
		localStorage["deletedIndexs"] = "";

		// Step 3 완료처리된 TODO의 상태를 서버에서 변경한다
		var completedTargets = localStorage["completed"].split(",");
		for (var i = 0; i < completedTargets.length-1; i++) {
			var keyIndex = completedTargets[i];
			var serverKey = JSON.parse(localStorage[keyIndex]).serverKey;
			if(serverKey == -1) continue;
			TODONetworkStorage.completed(serverKey, 1);
		};
		localStorage["completed"] = "";

		// Step 4 비완료로 변경된 TODO의 상태를 서버에서 변경한다
		var unCompletedTargets = localStorage["unCompleted"].split(",");
		for (var i = 0; i < unCompletedTargets.length-1; i++) {
			var keyIndex = unCompletedTargets[i];
			var serverKey = JSON.parse(localStorage[keyIndex]).serverKey;
			if(serverKey == -1) continue;
			TODONetworkStorage.completed(serverKey, 0);
		};
		localStorage["unCompleted"] = "";
	},
}

var TODOStorageManager = {
	localStorage: window.localStorage,
	init : function() {
		if(!this.localStorage["keyIndex"]) this.localStorage["keyIndex"] = 0;
		if(!this.localStorage["syncedLastIndex"]) this.localStorage["syncedLastIndex"] = 0;
		if(!this.localStorage["deletedIndexs"]) this.localStorage["deletedIndexs"] = "";
		if(!this.localStorage["completed"]) this.localStorage["completed"] = "";
		if(!this.localStorage["unCompleted"]) this.localStorage["unCompleted"] = "";
	},
	getKeyIndex : function(){
		return this.localStorage["keyIndex"]++;
	},
	get : function(){
		var arrReturn = [];
		for(var i in this.localStorage) {
			if(i === "keyIndex") continue;
			if(i === "syncedLastIndex") continue;
			if(i === "deletedIndexs") continue;
			if(i === "completed") continue;
			if(i === "unCompleted") continue;
			arrReturn.push(JSON.parse(this.localStorage.getItem(i)));
		}
		return arrReturn;
	},
	add : function(sTodo, callback){
		var keyIndex = this.getKeyIndex();
		this.localStorage.setItem(keyIndex, JSON.stringify({"keyIndex":keyIndex, "todoMessage":sTodo, "completed":false, "serverKey":-1, "synced":false}));
		TODOSyncManager.sync();
		callback({"nKeyIndex":keyIndex, "nServerKey":-1, "sCompleted":"", "sChecked":""});
	},
	complete : function(keyIndex, bCompleted){
		var originalTodo = JSON.parse(this.localStorage.getItem(keyIndex));

		if(bCompleted) {
			originalTodo.completed = true;

			var arrUnCompleted = this.localStorage["unCompleted"].split(",");
			var arrKeyIndex = arrUnCompleted.indexOf(keyIndex);
			if(arrKeyIndex >= 0){
				arrUnCompleted.splice(arrKeyIndex, 1);
				this.localStorage["unCompleted"] = arrUnCompleted.join();
			}
			
			this.localStorage["completed"] += keyIndex + ",";

		} else {
			originalTodo.completed = false;

			var arrCompleted = this.localStorage["completed"].split(",");
			var arrKeyIndex = arrCompleted.indexOf(keyIndex);
			if(arrKeyIndex >= 0){
				arrCompleted.splice(arrKeyIndex, 1);
				this.localStorage["completed"] = arrCompleted.join();
			}

			this.localStorage["unCompleted"] += keyIndex + ",";
		}

		this.localStorage.setItem(keyIndex, JSON.stringify(originalTodo));
		TODOSyncManager.sync();
	},
	remove : function(keyIndex) {
		var serverKey = JSON.parse(this.localStorage[keyIndex]).serverKey;
		this.localStorage.removeItem(keyIndex);

		// 서버에 동기화 된 적 없는 TODO는 굳이 서버로 보내는 TODO 삭제 요청 리스트에 포함시킬필요 없다
		if(serverKey != -1) {
			this.localStorage["deletedIndexs"] += serverKey+", ";
		}
		TODOSyncManager.sync();
	},
}

var TODO = {
	ENTER_KEYCODE : 13, 
	init : function(){
		var document = window.document;
		document.addEventListener("DOMContentLoaded", function(){
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
			document.getElementById("todo-list").addEventListener("click", this.complete);
			document.getElementById("todo-list").addEventListener("click", this.markRemoveTarget);
			document.getElementById("todo-list").addEventListener("animationend", this.remove);
			document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
			this.displayTodoList();
		}.bind(this));
	},
	displayTodoList : function(){
		var document = window.document;
		var arrTodos = TODOStorageManager.get();

		arrTodos.forEach(function(arr) {
			var completed = arr.completed ? "completed" : "";
			var checked = arr.completed ? "checked" : "";
			var sTodoEle = this.build(arr.todoMessage, arr.keyIndex, arr.serverKey, completed, checked);
			var todoList = document.getElementById("todo-list");
			todoList.insertAdjacentHTML("beforeend", sTodoEle);
		}.bind(this));
	},
	build : function(sTodoMessage, nKeyIndex, nServerKey, sCompleted, sChecked) {
		if(sTodoMessage === "") return;
		var template = Handlebars.compile(document.getElementById("Todo-template").innerHTML);
		var context = {todoMessage : sTodoMessage, key : nKeyIndex, sKey : nServerKey, completed : sCompleted, checked : sChecked};
		return template(context);
	},
	complete : function(e) {
		var checkBtn = e.target;
		if(checkBtn.nodeName !== "INPUT" || checkBtn.className !== "toggle") {
			return;
		}

		var li = checkBtn.parentNode.parentNode;
		TODOStorageManager.complete(li.dataset.key, checkBtn.checked);

		if(checkBtn.checked) {
			li.classList.add("completed");
		} else {
			li.classList.remove("completed");
		}
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
			TODOStorageManager.remove(ele.dataset.key);
		}	
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var sMsg = e.target.value;
			if(sMsg === ""){
				alert("missing Todo Message");
				return;
			}

			TODOStorageManager.add(sMsg, function(data){
				var sTodoEle = this.build(e.target.value, data.nKeyIndex, data.nServerKey, data.sCompleted, data.sChecked);
				var todoList = document.getElementById("todo-list");
				todoList.insertAdjacentHTML("beforeend", sTodoEle);
				e.target.value = "";
			}.bind(this));
		}	
	}
}

TODOSyncManager.init();
TODOStorageManager.init();
TODO.init();