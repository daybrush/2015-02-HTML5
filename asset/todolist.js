var ENTER_KEYCODE = 13;
var txtInput = document.getElementById("new-todo");	
var todoLists = document.querySelector('ul#todo-list');
var eleCompleted = document.querySelector(".added");

function makeTodo(evt){
	var sTxt = this.value;
	
	if((evt.keyCode == ENTER_KEYCODE) && (sTxt != "")){	
		var newCompleted = eleCompleted.cloneNode(true);

		newCompleted.querySelector(".view label").innerHTML = sTxt;
		newCompleted.style.display = "block";
		
		todoLists.insertAdjacentElement('beforeend', newCompleted);
/* 		newCompleted.className += " fade-in animation"; */
	
		
/*
		newCompleted.offsetHeight;
		newCompleted.style.opacity = 0;
		newCompleted.style.transition = "opacity 2s";
		newCompleted.style.opacity = 1;
*/
		
		txtInput.value = "";
	}
}

function finishCheckingTodo(evt){
	if(evt.target.tagName == "INPUT")
		evt.target.parentNode.parentNode.classList.toggle("completed");	
}

function deleteTodo(evt){
	var FADEOUT_SPEED = 0.05;
	
	if(evt.target.tagName == "BUTTON"){
		var clickedList = evt.target.parentNode.parentNode;
		var startOpacity = 1;
		
		var ticktock = function(){
			startOpacity =  startOpacity - FADEOUT_SPEED;
			
			if(startOpacity > 0){
				clickedList.style.opacity = startOpacity;
				requestAnimationFrame(ticktock); // || setTimeout(ticktock,17)
			} else 
				clickedList.parentNode.removeChild(clickedList);
		};
		ticktock();
	}
}

//
document.addEventListener("DOMContentLoaded", function(evt){
	txtInput.addEventListener('keypress', makeTodo);
	todoLists.addEventListener('click', finishCheckingTodo);
	todoLists.addEventListener('click', deleteTodo);
})
//
/*
var ENTER_KEYCODE = 13;

function makeTodo(){
	var li = document.createElement("li");
	var div = document.createElement("div");
	div.classNmae = "view";
	var input = document.createElement("input");
	input.className = "toggle";
	input.setAttribute("type", "checkbox");

	var label = documnet.createElement("label");
	label.innerText = todo;
	var button = document.createElement("button");
	button.className = "destroy";

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appencChild(div);
	return li;
}

function addTodo(e){
		if(e.keyCode == ENTER_KEYCODE){
			var todo = makeTodo(document.getElemnetById("new-todo").value);
			document.getElemnetById("todo-list").appendChild(todo);
			document.getElemnetById("new-todo").value = "";
		}
}

document.addEvnetListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListenr("keydown", addTodo	
});
*/
