/*
* week 4
* onlie offline 이벤트 추가하기
* TODOSync.onoffListener - promise 써서 refactoring하기
*/
var TODOSync = {
	address: "http://128.199.76.9:8002/KimDahye",

	localStorageUIDArray: [], // local strage에 (uid - parameter) 로 들어있다. UID key set이 이 배열

	init: function() {
		$(window).on('online', this.onoffListener.bind(this));
		$(window).on('offline', this.onoffListener.bind(this));
		localStorage.clear();
	},

	onoffListener: function() {
		if(navigator.onLine){
			$("#header").removeClass("offline");
			// 클라이언트에 있는 자료 서버로 보내기. 
			$.each( this.localStorageUIDArray, function(i, uid) {
				var param = localStorage.getObj(uid);
				if(param["method"] === "PUT") { //add 이면
					$.ajax(param).then( function (json) {
						//DOM에서 현재 uid가 id인 todo의 id 바꿔주기
						this.changeTodoId(uid, json.insertId);

						$.each(this.localStorageUIDArray, function(i, anotherUid) {
							var param = localStorage.getObj(anotherUid);
							if(param.todoKey === uid){
								param.url = this.address + "/" + json.insertId;
								$.ajax(param).then(null, this.alertAjaxFail);
								//complete, delete에 대해서 localStorage에서 이미 사용한 것 지우기, localStorageUIDArray에서 이미 사용한 uid 지우기
								// localStorage.removeItem(uid);
								// this.localStorageUIDArray.splice(i, 1); 
							}
						}.bind(this));
					}.bind(this), this.alertAjaxFail);	
					// add에 대해서 localStorage에서 이미 사용한 것 지우기, localStorageUIDArray에서 이미 사용한 uid 지우기	
					// localStorage.removeItem(uid);
					// this.localStorageUIDArray.splice(i, 1); 
				}else {
					//add가 아니면 callback필요 없이 바로 보낸다. 
					$.ajax(param).then(null, this.alertAjaxFail);
				}
			}.bind(this));
		} else {
			$("#header").addClass("offline");
		}
	},

	get: function(callback) {
		var param = { method: "GET", url: this.address };
		this.syncData(param, callback);
	},

	add: function(sTodo, callback) {
		var param = { method: "PUT", url: this.address, data: "todo=" + sTodo };
		this.syncData(param, callback);
	},

	complete: function(oParam, callback) {
		var param = { method: "POST", url: this.address + "/" + oParam.todoKey, data: "completed=" + oParam.complete, todoKey: oParam.todoKey };
		this.syncData(param, callback);
	},

	remove: function(oParam, callback) {
		var param = { method: "DELETE", url: this.address + "/" + oParam.todoKey, todoKey: oParam.todoKey };
		this.syncData(param, callback);
	},

	syncData: function(param, callback) {
		if(navigator.onLine){
			$.ajax(param).then(callback, this.alertAjaxFail);
		}else {
			var uid = this.uid();
			var json = {"insertId": uid}; //for todo add
			callback(json);
			localStorage.setObj(uid, param);
			this.localStorageUIDArray.push(uid);
		}
	},

	alertAjaxFail: function () { 
		alert("데이터 전송이 실패했습니다. 다시 시도해주세요.");
	},

	uid: function () {
	    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
	},

	changeTodoId: function(uid, id) {
		//DOM에서 현재 uid가 id인 todo의 id 바꿔주기
		$.each($("#todo-list li"), function(i, li){
			if(li.dataset.todoKey === uid) {
				li.dataset.todoKey = id;
			}
		});
	}
};

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
};