(function(){
	var ENTER_KEYCODE = 13;

	var document = window.document;

	document.addEventListener("DOMContentLoaded", function(){
		document.getElementById("new-todo").addEventListener("keydown", addTodo);
		document.getElementById("todo-list").addEventListener("click", completeTodo);
		document.getElementById("todo-list").addEventListener("click", removeTodo);
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

	function removeTodo(e) {
		var target = e.target;
		if(target.nodeName !== "BUTTON" || target.className !== "destroy") {
			return;
		}

		var destroyBtn = target;
		var li = destroyBtn.parentNode.parentNode;

		li.style.height = parseInt(window.getComputedStyle(destroyBtn).height) + "px";
		li.style.overflow = "hidden";

		function animate(timestamp) {
			li.style.height = parseFloat(li.style.height) - 2 + "px";

			if (parseFloat(li.style.height) > 0) {
    			window.requestAnimationFrame(animate);
  			} else {
				li.parentNode.removeChild(li);		
  			}
		}

		window.requestAnimationFrame(animate);
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

			var lastEle = todoList.querySelector("li:nth-last-of-type(1)");
			lastEle.style.opacity = 0;

			function animate(timestamp) {
				lastEle.style.opacity = lastEle.style.opacity*1 + 0.1;

				if (lastEle.style.opacity< 1) {
	    			window.requestAnimationFrame(animate);
	  			}
			}

			window.requestAnimationFrame(animate);
		}
	}

	function EmptyStringError(sMessage) {
		this.name = "EmptyStringError";
		this.message = sMessage;
	}

	EmptyStringError.protoType = new Error();
})();