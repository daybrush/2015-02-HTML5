/*
* week 4
* onlie offline 이벤트 추가하기
*/

var TODOSync = {
	address: "http://128.199.76.9:8002/KimDahye",

	localStorageUIDArray: [],

	localStorageUIDDictionary: {},

	init: function() {
		$(window).on('online', this.onoffListener.bind(this));
		$(window).on('offline', this.onoffListener.bind(this));
	},

	onoffListener: function() {
		if(navigator.onLine){
			$("#header").removeClass("offline");
			// 클라이언트에 있는 자료 서버로 보내기. 
			$.each( this.localStorageUIDArray, function(i, el) {
				// complete나 delete일 경우 parameter 중 key 값을 add 에서 바꿔준 값으로 바꿔준 후 보내기
				$.ajax(localStorage.getObj(el));
				// add였을 경우 id 바꿔주기. localStorage.
			});
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
		var param = { method: "POST", url: this.address + "/" + oParam.todoKey, data: "completed=" + oParam.complete };
		this.syncData(param, callback);
	},

	remove: function(oParam, callback) {
		var param = { method: "DELETE", url: this.address + "/" + oParam.todoKey };
		this.syncData(param, callback);
	},

	syncData: function(param, callback) {
		if(navigator.onLine){
			$.ajax(param).then(callback, this.alertAjaxFail);
		}else {
			var uid = this.uid();
			var json = {"id": uid}; //for todo add
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
	}
};

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
};