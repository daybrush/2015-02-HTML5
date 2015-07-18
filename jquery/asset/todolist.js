$(function(){
	var ENTER_KEYCODE = 13;

	var document = window.document;

	$(document).on("keydown", addTodo);
	$("#todo-list").on("click", completeTodo);
	$("#todo-list").on("click", removeTodo);

	function completeTodo(e) {
		var target = $(e.target);

		if(!target.is("input.toggle")) {
			return;
		}

		var li = target.closest("li");
		li.toggleClass("completed");
	}

	function removeTodo(e) {
		var target = $(e.target);

		if(!target.is("button.destroy")) {
			return;
		}

		var li = target.parents("li");
		li.addClass("deleteAnimate");
		
		li.one("animationend", function(){
			target.closest('li').remove();
		});
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
		
		var source = $("#Todo-template").html();
		var template = Handlebars.compile(source);

		var context = {todoMessage : sTodoMessage};
		var sHtml = template(context);
		return sHtml;
	}
	
	function EmptyStringError(sMessage) {
		this.name = "EmptyStringError";
		this.message = sMessage;
	}

	EmptyStringError.protoType = new Error();
});