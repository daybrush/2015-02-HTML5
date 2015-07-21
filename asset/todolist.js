document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('new-todo').addEventListener('keydown', addTODO);
});

var enterkey = 13;

function makeTODO(todo){
	
	var li = document.createElement('li');

	var div = document.createElement('div');
	div.className = "view";
	
	var input = document.createElement('input');
	input.className = "toggle";
	input.setAttribute = ("type", "checkbox");
	input.addEventListener('click', completedTODO);

	var label = document.createElement('label');
	label.innerText = document.getElementById('new-todo').value;
	
	var button = document.createElement('button');
	button.className = "destroy";
	button.addEventListener('click', removeTODO);

	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);

	li.appendChild(div);

	return li;

}



function completedTODO(e){
	var input = e.currentTarget;
	var li = input.parentNode.parentNode;
	if(input.checked){
		li.className = "completed";
	}
	else{
		li.className = "";
	}
}

function removeTODO(e){
	// debugger;
	var button = e.currentTarget;
	var li = button.parentNode.parentNode;
	var i = 0;
	var key = setInterval(function(){
		if(i === 50){
			// debugger;
			li.parentNode.removeChild(li);			
			clearInterval(key);
		}else{	
			//???????opacity가 안 먹히는데... css의 transition이 1s로 되어 있어서 문제였음. 
			// li.style.opacity = 1 - (i * 0.02);
			li.querySelector("label").style.opacity = 1 - (i * 0.02);
			// console.log(li);
		}
		i++;
	},16);
}

function addTODO(e){
	if(e.keyCode === enterkey){
		var todo = makeTODO(document.getElementById('new-todo').value);
		//서서히 보이게
		todo.style.opacity = 0;
		document.getElementById('todo-list').appendChild(todo);
		var i = 0;
		var key = setInterval(function(){
			//setInterval(function key(){})해도 됨??
			if(i === 50){
				//???????
				clearInterval(key);
			}else{
				todo.style.opacity = i * 0.02;
			}
			i++;
		},16);
		document.getElementById('new-todo').value="";
	}
}
