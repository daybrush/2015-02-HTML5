/*todo
* innerHTML + = todo 로 처리했던 부분 insertAdjacentHTML 로 바꾸기
* 등록한 할 일을 완료 처리하기
*  - 이벤트 할당하기
*  - class추가하기(li에 completed)
* 삭제하기
*  - 이벤트 할당하기
*  - li을 서서히 사라지게 처리한 후 삭제
* 등록하기
*  - 애니메이션 기능을 추가

*/

(function () {
	document.addEventListener("DOMContentLoaded", function () {
		var newtodo = document.getElementById("new-todo");
		newtodo.addEventListener("keydown", addTodo);
	})

	//var input = document.querySelector(".toggle");
	//input[0].addEventListener("click", completeTodo);

	function addTodo(ev) {
		var ENTER_KEYCODE = 13;
		if(ev.keyCode === ENTER_KEYCODE) {
			var todo = makeTodoList(ev.target.value);
			var todoList = document.getElementById("todo-list"); 
			todoList.insertAdjacentHTML('beforeend', todo);
			ev.target.value = "";
		}
	}

	function makeTodoList(todo) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {todoTitle: todo};
		return template(context);
	}

	function completeTodo(ev) {
		var input = ev.currentTarget;
		var li = input.parentNode.parentNode;

		if(input.checked === true) {
			li.className = "completed";
		}else {
			li.className = "";
		}
	}
})();
