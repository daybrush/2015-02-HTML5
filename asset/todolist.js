var ENTER_KEYCODE = 13;

function addTODO(e) {
	var source = document.getElementById("todo-template").innerHTML;
	var template = Handlebars.compile(source);

	if(e.keyCode === ENTER_KEYCODE) {
		var context = {title: document.getElementById("new-todo").value};
		var todo = template(context);
		document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
		document.getElementById("new-todo").value = "";

		var target = document.querySelector(".toggle");
		target.addEventListener("click", completeTODO);
	}
}

function completeTODO(e) {
	var input = e.currentTarget;
	var li = e.currentTarget.parentNode.parentNode;
	if(input.checked) {
		li.className = "completed";
	}
	else {
		li.className = "";
	}
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
})


