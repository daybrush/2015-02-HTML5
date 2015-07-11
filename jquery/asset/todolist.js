// window.addEventListener("load", fp);
// 문서 + 자원(이미지 등)이 모두 로딩되면 이벤트 발생 
// 이미지 등의 자원을 javascript로 control 해야할 때 사용

// document.addEventListener("DOMContentLoaded", fp);
// 문서가 로딩되면 이벤트 발생 (DOM tree를 완성시킨 후 발생한다고 알고있음)
// DOM 조작만 필요할 경우 이 이벤트 사용

// document.ready() 는 native javascript에서의 DOMContentLoaded event와 동일한 것 같다
// 아래코드는 document.ready()와 동일
$(function(){
	var ENTER_KEYCODE = 13;

	var document = window.document;

	$(document).bind("keydown", addTodo);

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