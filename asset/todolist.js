var ENTER_KEYCODE = 13;

function makeTODO(enteredTitle) {
	var source = document.getElementById("todo-template").innerHTML;
	var template = Handlebars.compile(source);
	var context = {title : enteredTitle};
	var todo = template(context);

	return todo;
}

function addTODO(e) {
	if(e.keyCode === ENTER_KEYCODE) {
		var todo = makeTODO(e.target.value);

		document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
		document.getElementById("new-todo").value = "";

		// var input = document.querySelector(".toggle");
		// input.addEventListener("click", completeTODO);

		// var button = document.querySelector(".destroy");
		// button.addEventListener("click", deleteTODO);
	}
}

function completeTODO(e) {
	var input = e.currentTarget;
	console.log(input);
	var li = e.currentTarget.parentNode.parentNode;
	if(input.checked) {
		li.className = "completed";
	}
	else {
		li.className = "";
	}
}

function deleteTODO(e) {
	var li = e.currentTarget.parentNode.parentNode;
	var i = 0;
	
	var key = setInterval(function() {
		if(i === 50) {
			clearInterval(key);
			li.parentNode.removeChild(li);
		}
		else {
			li.style.opacity = 1 - i * 0.02;
		}
		i++;
	}, 16);
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
})
