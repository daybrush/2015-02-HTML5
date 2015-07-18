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

	// bind가 on으로 통합되었다고 한다
	// $(document).bind("keydown", addTodo);
	$(document).on("keydown", addTodo);
	$("#todo-list").on("click", completeTodo);
	$("#todo-list").on("click", removeTodo);

	function completeTodo(e) {
		var target = $(e.target);

		if(!target.is("input.toggle")) {
			return;
		}

		// 여기서는 탐색범위가 e.target으로 한정되어 있지만
		// 탐색범위가 넓을때는 parents()가 여러개의 element를 가져올 것 같아서
		// parentsUntil() 이라는 함수를 써보았었다
		// 
		// parentsUntil("li") 이렇게 하면 처음 나오는 li까지만 탐색할 것이라 기대하고 테스트 해보았으나
		// 처음으로 li element 부모를 만날때 까지의 경로상에 존재하는 모든 element를 반환해서 실망하고 그냥 parents를 사용했었는데
		//  
		// http://git.io/vqNiT 에서 closest를 발견하게 되어 적용하였다
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
		
		// one 메소드를 통해 추가된 이벤트는 딱 한번만 실행되고 사라진다(리스너를 제거함)
		li.one("animationend", function(){
			// native javascript로 삭제하는 방식이 이 경우에는 더 직관적인것 같다
			// this.parentNode.removeChild(this);
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