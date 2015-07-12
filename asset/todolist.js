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

		//변수 todo도 li를 의미하지만 html에서 내가 찾고싶은 타켓 영역을 의미하지 않는듯 하다. 
		//따라서 입력된 타이틀 데이터를 가진 li를 타겟으로 잡아주고, 그 타겟에 애니메이션을 걸었다. 
		var target = document.getElementById("todo-list").querySelector("li:nth-last-child(1)");
		target.style.opacity = 0;

		var i = 0;
		var key = setInterval(function() {
			if(i === 50) {
				clearInterval(key);
			}
			else {
				target.style.opacity = i * 0.02;
			}
			i++;
		}, 16);
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
