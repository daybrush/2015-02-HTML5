// TODO 변수는 사용된 위치보다 아래쪽에 선언이 되어 있다. 그런데 어떻게 사용이 가능한 것일까?
// 혹시 $(function() {}); 가 dom이 로드된 후 실행되는 코드이기 때문에
// 실제 TODO.init()의 실행 시점이 var TODO = {} 를 파싱하고난 이후이기 때문에 사용이 가능한 것일까?
$(function() {
	TODO.init();
});

var TODO = {
	ENTER_KEYCODE : 13,
	init : function() {
		$(document).on("keydown", this.add.bind(this));
		$("#todo-list").on("click", "input.toggle", this.completed);
		$("#todo-list").on("click", "button.destroy", this.markRemveTarget);
		$("#todo-list").on("animationend", "li.deleteAnimate", this.remove);	
	},
	completed : function(e) {
		var li = $(e.target).closest("li");
		li.toggleClass("completed");
	},
	markRemveTarget : function(e) {
		var li = $(e.target).parents("li");
		li.addClass("deleteAnimate");
	},
	remove : function(e) {
		$(e.target).remove();
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var sTodoMsg = e.target.value;
			if(sTodoMsg === ""){
				alert("missing Todo Message");
			}

			var sTodoEle = this.build(sTodoMsg);
			$("#todo-list").append(sTodoEle);
			e.target.value = "";
		}
	}, 
	build : function(sTodoMessage){
		if(sTodoMessage === "") return;
		var context = {todoMessage : sTodoMessage};
		var template = Handlebars.compile($("#Todo-template").html());
		return template(context);
	}
}