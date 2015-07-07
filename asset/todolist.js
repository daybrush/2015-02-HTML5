//document.addEventListener["load", fp];
//document.addEventListener["DOMContentLoaded", fp];


// document.createElement
// className
// setAttribute
// innerText
// appendChild
// addEventListener
// var


function makeTODO (target) {

	var eLi = document.createElement("li");
	var eDiv = document.createElement("div");
	eDiv.className = "view";

	var eInput = document.createElement("input");
	eInput.className = "toggle";
	eInput.setAttribute("type", "checkbox");

	var eLabel = document.createElement("label");
	eLabel.innerText = target;

	var eButton = document.createElement("button");
	eButton.className = "destroy";

	eDiv.appendChild(eInput);
	eDiv.appendChild(eLabel);
	eDiv.appendChild(eButton);
	eLi.appendChild(eDiv);

	return eLi;


}

document.addEventListener("DOMContentLoaded", function () {
	var ENTER_KEYCODE = 13;
	document.getElementById("new-todo").addEventListener("keydown", function (e) {
		if (e.keyCode == ENTER_KEYCODE) {
			var todo = makeTODO(document.getElementById("new-todo").value);
			document.getElementById("todo-list").appendChild(todo);
			document.getElementById("new-todo") = "";
		};
	})
});