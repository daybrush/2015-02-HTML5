// 참고함
// https://github.com/atgchan/2015-02-HTML5/commit/5eae26ba4e112c2f649738a71d62bf6243f2fc56#diff-1d96423cf8afbaa86b544c085b081a4aR50

$(function(){
	var ENTER_KEYCODE = 13;

	var document = window.document;

	$(document).bind("keydown", addTodo);

	function addTodo(e) {
		if(e.keyCode === ENTER_KEYCODE) {
			try {
				var elTodo = makeTodo(e.target.value);
			} catch(err) {
				alert(err.message);
				return;
			}

			$("#todo-list").append(elTodo);
			e.target.value = "";
		}
	}

	function makeTodo(sTodoMessage){
		if(sTodoMessage === "") {
			throw new EmptyStringError("missing Todo Message");
		}
		
		if(supportsTemplate()) {
			var template = document.querySelector("#todo-template");
			template.content.querySelector("label").innerText = sTodoMessage;

			return document.importNode(template.content, true);	
		} else {
			var li = document.createElement("li");
			var div = document.createElement("div");
			div.className = "view";

			var input = document.createElement("input");
			input.className = "toggle";
			input.setAttribute("type", "checkbox");

			var label = document.createElement("label");
			label.innerText = todo;

			var button = document.createElement("button");
			button.className = "destroy";
			
			div.appendChild(input);
			div.appendChild(label);
			div.appendChild(button);
			
			li.appendChild(div);
			
			return li;
		}
	}
	
	function supportsTemplate() {
		
		// 이 방식은 그냥 내용을 보여준다
		// 처음에는 이 방식과 !(느낌표)를 사용하여 boolean 으로 처리하면 안될까 생각했는데
		// 이 방식의 경우 값이 존재하긴 하나 속성의 값이 0인 경우에 문제가 발생할 수 있으므로 아래 경우를 사용한다고 한다
		// console.log(document.createElement('template').content);

		// 실제로 테스트를 해보았는데 실수하기에 딱 좋다

		// !"" -> true
		// document.createElement('template').content -> #document-fragment

		// 따라서 
		// !document.createElement('template').content -> false

		
		// 이 방식은 결과를 boolean으로 반환한다. 그래서 이 방법을 사용한다
		// console.log('content' in document.createElement('template'));

		return 'content' in document.createElement('template');
	}

	function EmptyStringError(sMessage) {
		this.name = "EmptyStringError";
		this.message = sMessage;
	}

	EmptyStringError.protoType = new Error();
});