var ENTER_KEYCODE = 13;

function addTODO(e) {
	var source = document.getElementById("todo-template").innerHTML;
	var template = Handlebars.compile(source);

	if(e.keyCode === ENTER_KEYCODE) {
		var context = {title: document.getElementById("new-todo").value};
		var todo = template(context);
		document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
		document.getElementById("new-todo").value = "";

		var input = document.querySelector(".toggle");
		console.log(input);
		input.addEventListener("click", completeTODO);

		var button = document.querySelector(".destroy");
		button.addEventListener("click", deleteTODO);
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

function deleteTODO(e) {
	var button = e.currentTarget;
	var li = e.currentTarget.parentNode.parentNode;
	var ul = e.currentTarget.parentNode.parentNode.parentNode;
	ul.removeChild(li);
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
})


