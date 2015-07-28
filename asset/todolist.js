/*
* todo 만들어 객체로 함수 묶기
* ajax 요청
	- 전체 가져올 때
	- 추가할 때
	- 완료할 때
	- 삭제할 때
*/

$(document).ready(function () {
	TODO.init();
});

var TODO = (function(){
	function makeTodoList(todo) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {todoTitle: todo};
		return template(context);
	};

	return TODO = {
		init: function() {

			$("#new-todo").on("keydown", TODO.add);
			var todoList = $("#todo-list");
			todoList.on("click", "input", TODO.complete);
			todoList.on("click", "button", TODO.startDeleteAnimation);
			todoList.on("animationend", "li", TODO.remove);
		},	

		add : function (ev) {
			var ENTER_KEYCODE = 13;
			if(ev.keyCode === ENTER_KEYCODE) {
				var todo = makeTodoList(ev.target.value);
				var todoList = document.getElementById("todo-list"); 
				todoList.insertAdjacentHTML('beforeend', todo);
				ev.target.value = "";
			}
		},

		complete : function (ev) {
			var input = ev.currentTarget;
			var li = input.parentNode.parentNode;
			if(input.checked === true) {
				li.className = "completed";
			}else {
				li.className = "";
			}
		},

		startDeleteAnimation : function (ev) {
			var button = ev.currentTarget;
			var li = button.parentNode.parentNode;
			li.className = "deleting";
		},

		remove : function (ev) {
			var li = ev.currentTarget;
			if(li.className === "deleting"){
				li.parentNode.removeChild(li);
			}
		}	
	}
})();