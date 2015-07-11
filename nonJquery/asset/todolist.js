var ENTER_KETCODE = 13;

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListener("keydown", addTodo);
});

function makeTodo(sTodoMessage) {
	if(sTodoMessage === "") {
		throw new EmptyStringError("missing Todo Message");
	}

	var document = window.document;

	var li = document.createElement("li");
	
	var div = document.createElement("div");
	div.className = "view";

	var input = document.createElement("input");
	input.className = "toggle";
	input.setAttribute("type", "checkbox");

	var label = document.createElement("label");
	label.innerText = sTodoMessage;

	var button = document.createElement("button");
	button.className = "destroy";

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appendChild(div);

	return li;
}

function addTodo(e) {
	if(e.keyCode === ENTER_KETCODE) {
		var document = window.document;

		try{
			var elTodo = makeTodo(document.getElementById("new-todo").value);
		} catch(err) {
			alert(err.message);
			return;
		}
		
		document.getElementById("todo-list").appendChild(elTodo);
		document.getElementById("new-todo").value = "";
	}
}

function EmptyStringError(sMessage) {
	this.name = "EmptyStringError";
	this.message = sMessage;
}

EmptyStringError.protoType = new Error();