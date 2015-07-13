//window.addEventListener("load", fp);
//document.addEventListener("DOMContentLoaded", fp);
//이 둘의 차이는?

//DOMContentLoaded 이벤트는 문서가 완전히 로드되고 전달되면 스프레드시트, 이미지, 서브프레임등의 로딩을
//기다리지 않고 실행된다.
//Load이벤트는 페이지가 완전히 로드된 상태를 감지하는데 사용할 수 있다.


var ENTER_KEYCODE = 13;

function makeTODO(todo){
	if (supportsTemplate()) { //템플릿이 지원이 되면
		var template = document.querySelector("#todo-template");
		template.content.querySelector("label").innerText = todo;
		console.log(template.content.querySelector(".toggle"));

		var li = document.importNode(template.content, true).querySelector("li");
		
		li.querySelector(".toggle").addEventListener("click", completedTODO);
		li.querySelector("button").addEventListener("click", removeTODO);

		return li;

	} else { //템플릿 지원이 안되면
		var li = document.createElement("li");
		var div = document.createElement("div");
		div.className = "view";
		var input = document.createElement("input");
		input.className = "toggle";
		input.setAttribute("type", "checkbox");
		input.addEventListener("click", completedTODO); //Event delegation 을 찾아볼것
		var label = document.createElement("label");
		label.innerText = todo;
		var button = document.createElement("button");
		button.className = "destroy";
		button.addEventListener("click", removeTODO);

		div.appendChild(input);
		div.appendChild(label);
		div.appendChild(button);

		li.appendChild(div);

		return li;
	}
}

function removeTODO(e) {
	var li = e.currentTarget.parentNode.parentNode;

	//CSS3를 이용하여 바꿔볼 수 있도록 공부할 것
	//keyframe 공부하기
	var i = 1;
	var key = setInterval(function() {
		if(i === 5) {
			clearInterval(key);
			li.parentNode.removeChild(li);
		} else {
			li.style.opacity = 1 - i * 0.2;
		}
		i++;
	}, 160); //반복되는 시간마다 반복을 해줌
	//requestAnimationFrame() //프레임마다 에니메이션을 실행

}

function completedTODO(e) {
	var input  = e.currentTarget; // 이벤트를 할당한(바인딩한) 엘리멘트 (체크박스)
	//var input = e.target; // 이벤트를 발생시킨 엘리멘트 (지금은 같음)
	var li = input.parentNode.parentNode;
	
	if(input.checked) {
		li.className = "completed";
	} else {
		li.className = "";
	}
}


function addTODO(e){
	if(e.keyCode === ENTER_KEYCODE){	
		var todo = makeTODO(document.getElementById("new-todo").value);
		todo.style.opacity = 0;
		document.getElementById("todo-list").appendChild(todo);

		var i = 1;
		var key = setInterval(function() {
			if(i === 6) {
				clearInterval(key);
			} else {
				todo.style.opacity = i * 0.2;
			}
			i++;
		}, 160);

		document.getElementById("new-todo").value = "";
	}
}

function supportsTemplate() {
  return 'content' in document.createElement('template');
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
});