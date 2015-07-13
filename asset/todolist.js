// document.addEventListener("DOMContentLoaded", function(evt){
// 	var txtInput = document.getElementById("new-todo");	
// 	var todoLists = document.querySelector('ul#todo-list');
// 	var eleCompleted = document.querySelector(".added");	

// 	txtInput.addEventListener('keypress', function(evt){
// 		if(evt.keyCode == 13){
// 			var sTxt = txtInput.value;
// 			if(eleCompleted.style.display == ""){
// 				insertTxt(".view label", sTxt);
// 				eleCompleted.style.display = "block";		
			
// 			} else {
// 				var newCompleted = eleCompleted.cloneNode(true);
// 				insertTxt(".view label", sTxt);
// 				todoLists.insertAdjacentElement('beforeend', newCompleted);	
// 			}			
// 		}
		
// 		function insertTxt(ele, string){
// 			document.querySelector(ele).innerHTML = string;
// 			txtInput.value = "";				
// 		}		
// 	}, false);
	
// })

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


//window.addEventListener("load", func);
//document.addEvnetListener("DOMContentLoaded", func);
