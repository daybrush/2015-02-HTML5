(function(){
	var ENTER_KEYCODE = 13;

	document.addEventListener("DOMContentLoaded", function(){
		document.getElementById("new-todo").addEventListener("keydown", addTodo);
	});

	function makeTodo(sTodoMessage) {
		if(sTodoMessage === "") {
			throw new EmptyStringError("missing Todo Message");
		}

		var source = document.getElementById("Todo-template").innerHTML;
		var template = Handlebars.compile(source);

		var context = {todoMessage : sTodoMessage};
		var sHtml = template(context);
		return sHtml;
	}

	function addTodo(e) {
		if(e.keyCode === ENTER_KEYCODE) {
			var document = window.document;

			try{
				var sTodoEle = makeTodo(e.target.value);
			} catch(err) {
				alert(err.message);
				return;
			}

			var todoList = document.getElementById("todo-list");
			todoList.insertAdjacentHTML("beforeend", sTodoEle);

			e.target.value = "";
		}
	}

	function EmptyStringError(sMessage) {
		this.name = "EmptyStringError";
		this.message = sMessage;
	}

	EmptyStringError.protoType = new Error();
})();