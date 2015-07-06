/*<li class="{}">
	<div class="view">
		<input class="toggle" type="checkbox" {}>
		<label>타이틀</label>
		<button class="destroy"></button>
	</div>
</li>
*/

(function () {
	document.addEventListener("DOMContentLoaded", function () {
		var newtodo = document.getElementById("new-todo");
		newtodo.addEventListener("keydown", addTodo);
	})

	function addTodo(ev) {
		var ENTER_KEYCODE = 13;
		if(ev.keyCode === ENTER_KEYCODE) {
			var todo = makeTodoList(ev.target.value);
			var todoList = document.getElementById("todo-list"); 
			todoList.innerHTML += todo;
			ev.target.value = "";
		}
	}

	function makeTodoList(todo) {
		var LIST_TEMPLATE = '<li ><div class="view"><input class="toggle" type="checkbox"><label><%=title%></label><button class="destroy"></button></div></li>';
		return LIST_TEMPLATE.replace("<%=title%>", todo);
	}
})();
