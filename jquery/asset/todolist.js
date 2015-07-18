$(function(){
	var ENTER_KEYCODE = 13;

	$(document).on("keydown", addTodo);
	$("#todo-list").on("click", "input.toggle", completeTodo);
	$("#todo-list").on("click", "button.destroy", markRemoveTodo);
	$("#todo-list").on("animationend", "li.deleteAnimate", removeTodoEle);

	function completeTodo(e) {
		var li = $(e.target).closest("li");
		li.toggleClass("completed");
	}

	function markRemoveTodo(e) {
		var li = $(e.target).parents("li");
		li.addClass("deleteAnimate");
	}

	function removeTodoEle(e) {
		$(e.target).remove();
	}

	function addTodo(e) {
		if(e.keyCode === ENTER_KEYCODE) {
			try {
				var sTodoEle = makeTodo(e.target.value);
			} catch(err) {
				alert(err.message);
				return;
			}

			$("#todo-list").append(sTodoEle);
			e.target.value = "";
		}
	}

	function makeTodo(sTodoMessage){
		if(sTodoMessage === "") {
			throw new EmptyStringError("missing Todo Message");
		}
		
		var context = {todoMessage : sTodoMessage};
		var template = Handlebars.compile($("#Todo-template").html());
		return template(context);
	}
	
	function EmptyStringError(sMessage) {
		this.name = "EmptyStringError";
		this.message = sMessage;
	}

	EmptyStringError.protoType = new Error();
});