var ENTER_KEYCODE = 13;

function addTODO(e) {
	var source = document.getElementById("todo-template").innerHTML;
	var template = Handlebars.compile(source);

	if(e.keyCode === ENTER_KEYCODE) {
		var context = {title: document.getElementById("new-todo").value};
		var todo = template(context);
		document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
		document.getElementById("new-todo").value = "";

	}
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
})


