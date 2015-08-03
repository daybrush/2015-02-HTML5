/*
* week 4
* onlie offline 이벤트 추가하기
*/

var TODOSync = {
	address: "http://128.199.76.9:8002/KimDahye",

	init: function() {
		$(window).on('online', this.onoffListener);
		$(window).on('offline', this.onoffListener);
	},

	onoffListener: function() {
		if(navigator.onLine){
			$("#header").removeClass("offline");
			// 클라이언트에 있는 자료 서버로 보내기. 
		} else {
			$("#header").addClass("offline");
		}
	},

	get: function(callback) {
		if(navigator.onLine){
			var param = { method: "GET", url: this.address };
			$.ajax(param).then(callback, this.alertAjaxFail);
		} else {
			//local storage에 저장
		}
	},

	add: function(sTodo, callback) {
		if(navigator.onLine){
			var param = { method: "PUT", url: this.address, data: "todo=" + sTodo };
			$.ajax(param).then(callback, this.alertAjaxFail);
		} else {
			//local storage에 저장
		}	
	},

	complete: function(oParam, callback) {
		if(navigator.onLine){
			var param = { method: "POST", url: this.address + "/" + oParam.todoKey, data: "completed=" + oParam.complete };
			$.ajax(param).then(callback, this.alertAjaxFail);
		} else {
			//local storage에 저장
		}
	},

	remove: function(oParam, callback) {
		if(navigator.onLine) {
			var param = { method: "DELETE", url: this.address + "/" + oParam.todoKey };
			$.ajax(param).then(callback, this.alertAjaxFail);
		} else {

		}
	},

	alertAjaxFail: function () { 
		alert("데이터 전송이 실패했습니다. 다시 시도해주세요.");
	}
	//get, add, complete, remove 에 반복적으로 나오는 패턴은 online인지 확인하여 ajax, else이면 로컬에 저장 - 메소드로 뽑자. 
};