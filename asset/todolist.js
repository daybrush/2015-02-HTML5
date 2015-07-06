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

		return document.importNode(template.content, true);	

	} else { //템플릿 지원이 안되면
		var li = document.createElement("li");ㄹ
		var div = document.createElement("div");
		div.className = "view";
		var input = document.createElement("input");
		input.className = "toggle";
		input.setAttribute("type", "checkbox");
		var label = document.createElement("label");
		label.innerText = todo;
		var button = document.createElement("button");
		button.className = "destroy";

		div.appendChild(input);
		div.appendChild(label);
		div.appendChild(button);

		li.appendChild(div);

		return li;
	}
}

function addTODO(e){
	if(e.keyCode === ENTER_KEYCODE){	
		var todo = makeTODO(document.getElementById("new-todo").value);
		document.getElementById("todo-list").appendChild(todo);
		document.getElementById("new-todo").value = "";
	}
}

function supportsTemplate() {
  return 'content' in document.createElement('template');
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
});