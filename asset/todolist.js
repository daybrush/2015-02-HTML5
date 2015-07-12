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
	}
}

function completeTODO(e) {
	var input = e.target;
	if(input.className === "toggle") {	//이 부분 꼭 필요! 
		var li = e.target.parentNode.parentNode;
		
		if(input.checked) {
			li.className = "completed";
		}
		else {
			li.className = "";
		}
	}
	
}

function deleteTODO(e) {
	var button = e.target;
	if(button.className === "destroy") {	//이 부분 꼭 필요! 
		var li = e.target.parentNode.parentNode;
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
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
	document.getElementById("todo-list").addEventListener("click", completeTODO);
	document.getElementById("todo-list").addEventListener("click", deleteTODO);
})
