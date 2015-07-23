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
		
		fadeIn(newCompleted, .5);
		txtInput.value = "";
	}
	
	function fadeIn(ele, secondTerm){
		ele.offsetHeight;
		ele.style.transition = "opacity " + secondTerm + "s ease-in";
		ele.style.opacity = 1;
	}
}

function finishCheckingTodo(evt){
	if(evt.target.tagName == "INPUT")
		evt.target.parentNode.parentNode.classList.toggle("completed");	
}

function deleteTodo(evt){
	var CHANGE_PERIOD = 400;
	var FADEOUT_SPEED = 1 / CHANGE_PERIOD;//opacity 1 ~ 0 divided by CHANGE_PERIOD
	
	if(evt.target.tagName == "BUTTON"){
		var clickedList = evt.target.parentNode.parentNode;
		var startOpacity = 1;
		var startTime = null;
		
		var tickTok = function(timeByTok){
			if(!startTime) startTime = timeByTok;
			var interval = timeByTok - startTime;
			
			startOpacity =  (startOpacity - FADEOUT_SPEED) * interval;
			
			if(interval <= CHANGE_PERIOD){
				clickedList.style.opacity = startOpacity;
				var frame = requestAnimationFrame(tickTok);			
			} else {
				clickedList.parentNode.removeChild(clickedList);	
				cancelAnimationFrame(frame); // 이거 꼭 해줘야 하는지?			
			}
		};
		requestAnimationFrame(tickTok);

	}
}


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
