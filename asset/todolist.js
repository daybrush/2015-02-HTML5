var ENTER_KEYCODE = 13;
var SAMPLE_TODO = '<li class="appending"><div class="view"><input class="toggle" type="checkbox"><label>{title}</label><button class="destroy"></button></div></li>';
var listTodo = "";

function changeTemplate(sample, data) {
	var html = sample;
	for(var key in data) {
		html = html.replace("{" + key + "}", data[key]);
	}
	return html;
}


function addTodo(v) {
	if(!v)
		return;
	
	var html = changeTemplate(SAMPLE_TODO, {title:v});
	
	listTodo.insertAdjacentHTML("afterbegin", html);
	var li = listTodo.querySelector(".appending");
	

	
	var _duration = 500;
	var _targetHeight = 58;
	var _startTime = 0;
	requestAnimationFrame(function _addTodo(t) {
		if(!li)
			return;
	
		console.log(arguments);
		
		if(!_startTime)
			_startTime = t;
			
			
		var now = t - _startTime;
		if(_duration <= now) {
			li.className = "";
			li.style.height = "";
			return;
		}
		var height = parseInt(now/_duration * _targetHeight);
		
		li.style.height = height + "px";
		
		requestAnimationFrame(_addTodo);
	});
}
function completeTodo(li, checked) {
	li.className = checked ? "completed" : "";
}
function _removeTodo(li) {
	//li.parentNode.removeChild(li);
	/* 	li.outerHTML = ""; */
	li.remove();
}
function removeTodo(e) {
	var li = e.target.parentNode.parentNode;
	li.className += " deleting";
	li.addEventListener("transitionend", function(e) {
		_removeTodo(li);
	})
}
function checkedTodo(e) {
	var input = e.target;
	var li = input.parentNode.parentNode;
	completeTodo(li, input.checked);
}
document.addEventListener("DOMContentLoaded", function() {
	var inputTodo = document.getElementById("new-todo");
	inputTodo.addEventListener("keydown", function(e) {
		console.log("keydown");
		if(e.keyCode === ENTER_KEYCODE) {
			var value =  inputTodo.value;
			addTodo(value);
			inputTodo.value = "";
		}
	});	
	listTodo = document.getElementById("todo-list");
	listTodo.addEventListener("click", function(e) {
		var target = e.target;
		if(target) {
			if(target.nodeName == "INPUT")
				checkedTodo(e);
			else if(target.nodeName == "BUTTON" && target.className == "destroy")
				removeTodo(e);
		}

	});
});