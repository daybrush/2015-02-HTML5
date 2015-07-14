(function(){
	var ENTER_KEYCODE = 13;

	var document = window.document;

	document.addEventListener("DOMContentLoaded", function(){
		document.getElementById("new-todo").addEventListener("keydown", addTodo);
		document.getElementById("todo-list").addEventListener("click", completeTodo);
		document.getElementById("todo-list").addEventListener("click", markRemoveTarget);
		document.getElementById("todo-list").addEventListener("animationend", removeTodoEle);
	});

	function completeTodo(e) {
		var target = e.target;
		if(target.nodeName !== "INPUT" || target.className !== "toggle") {
			return;
		}

		var checkBtn = target;
		var li = checkBtn.parentNode.parentNode;

		if(checkBtn.checked) {
			li.classList.add("completed");
		} else {
			li.classList.remove("completed");
		}
	}

	function markRemoveTarget(e) {
		var target = e.target;
		if(target.nodeName !== "BUTTON" || target.className !== "destroy") {
			return;
		}

		var destroyBtn = target;
		var li = destroyBtn.parentNode.parentNode;
		li.classList.add("deleteAnimate");
	}

	function removeTodoEle(e){
		var ele = e.target;
		if(ele.classList.contains("deleteAnimate")){
			ele.parentNode.removeChild(ele);
		}
	}

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