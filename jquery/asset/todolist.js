// TODO 변수는 사용된 위치보다 아래쪽에 선언이 되어 있다. 그런데 어떻게 사용이 가능한 것일까?
// 혹시 $(function() {}); 가 dom이 로드된 후 실행되는 코드이기 때문에
// 실제 TODO.init()의 실행 시점이 var TODO = {} 를 파싱하고난 이후이기 때문에 사용이 가능한 것일까?
$(function() {
	TODO.init();
});

var TODOSync = {
	apiAddress : "http://128.199.76.9:8002",
	get : function(callback) {
		this.ajax({method:"GET", url:this.url("/hataeho1")}, callback);
	},
	add : function(sTodo, callback) {
		this.ajax({method:"PUT", url:this.url("/hataeho1"), data:"todo="+sTodo}, callback);
	},
	completed : function(param, callback){
		this.ajax({method:"POST", url:this.url("/hataeho1/"+param.key), data:"completed="+param.completed+"&key="+param.key}, callback);
	},
	remove : function(param, callback) {
		this.ajax({method:"DELETE", url:this.url("/hataeho1/"+param.key)}, callback);
	},
	ajax : function(param, callback) {
		$.ajax({method:param.method, url:param.url, data:param.data})
		.done(function(data){callback(data);})
		.fail(this.alertFail);
	},
	url : function(sApi) {
		return this.apiAddress + sApi;
	},
	alertFail : function() {
		alert("Transient error has occurred. Please try again later");
	}
}

var TODO = {
	ENTER_KEYCODE : 13,
	init : function() {
		var todoList = $("#todo-list");
		$(document).on("keydown", this.add.bind(this));
		todoList.on("click", "input.toggle", this.completed);
		todoList.on("click", "button.destroy", this.markRemveTarget);
		todoList.on("animationend", "li.deleteAnimate", this.remove);	
		TODOSync.get(this.displayTodoList.bind(this));
	},
	displayTodoList : function(arrTodo){
		var liEles = "";
		arrTodo.forEach(function(item){
			var isCompleted = !!item.completed;
			var sTodoEle = this.build(item.todo, item.id, (isCompleted)?"completed":"", (isCompleted)?"checked":"");
			liEles += sTodoEle;
		}.bind(this));
		$("#todo-list").append(liEles);
	},
	completed : function(e) {
		var li = $(e.target).closest("li");
		var completed = !!$("li input:checked").size() ? 1: 0;
		TODOSync.completed({
			"key" : li.data("key"),
			"completed" : completed
		}, function(){
			li.toggleClass("completed");
		});
	},
	markRemveTarget : function(e) {
		var li = $(e.target).parents("li");
		li.addClass("deleteAnimate");
	},
	remove : function(e) {
		$(e.target).remove();
		TODOSync.remove({
			"key" : $(e.target).data("key")
		}, function(json){
			if(json.affectedRows !== 1) {
				alert("Transient error has occurred. Please try again later");
				location.reload();
			}
		});
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var sTodoMsg = e.target.value;
			if(sTodoMsg === ""){
				alert("missing Todo Message");
				return;
			}

			TODOSync.add(sTodoMsg, function(data){
				var sTodoEle = this.build(sTodoMsg, data.insertId);
				$("#todo-list").append(sTodoEle);
				e.target.value = "";
			}.bind(this));
		}
	}, 
	build : function(sTodoMessage, nKey, completed, checked){
		if(sTodoMessage === "") return "";
		var context = {todoMessage : sTodoMessage, key : nKey, completed : completed, checked : checked};
		var template = Handlebars.compile($("#Todo-template").html());
		return template(context);
	}
}