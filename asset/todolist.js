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
		var li = document.createElement("li");
		li.className = "appending";
		document.getElementById("todo-list").appendChild(li);

		var todo = makeTODO(e.target.value);
		li.insertAdjacentHTML('beforeend', todo);
		document.getElementById("new-todo").value = "";

    	setTimeout(function () {
       	 	li.className = "";
   	 	}, 100);
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
		li.className = "deleting";
		

		setTimeout(function () {
			li.parentNode.removeChild(li);
       	 	
   	 	}, 1000);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
	document.getElementById("todo-list").addEventListener("click", completeTODO);
	document.getElementById("todo-list").addEventListener("click", deleteTODO);
})
