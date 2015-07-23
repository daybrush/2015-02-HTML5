
/* 
 * <아래 두 가지 방법의 차이점 알기!>
 * window.addEventListener("load", fp);
 * document.addEventListener("DOMContentLoaded", fp);
 * 
 * => load이벤트는 문서내의 모든 리소스(이미지,스크립트)의 다운로드가 끝난 후에 실행
 * => DOMContentLoaded이벤트는 문서에서 스크립트 작업을 할 수 있을 때 실행
 */

var ENTER_KEYCODE = 13;

function makeTODO(todo){
	// 각 엘리먼트 만들기 
	var li = document.createElement("li");
	var div = document.createElement("div");
	var input = document.createElement("input");
	var label = document.createElement("label");
	var button = document.createElement("button");

	// 각 엘리먼트에 클래스 추가
	div.className = "view";
	input.className = "toggle";
	button.className = "destroy";

	// 속성 추가
	input.setAttribute("type", "checkbox");

	// todo내용 넣기 
	label.innerText = todo;

	// 구조 만들기
	div.appendChild(input);
	div.appendChild(label);
	div.appendChild(button);
	li.appendChild(div);

	return li;
}


function addTODO(e){
	if(e.keyCode === ENTER_KEYCODE){ // 엔터를 눌렀을 때 

		// todo내용을 입력받아 todo 추가하기
		var todo = makeTODO(document.getElementById("new-todo").value);
		document.getElementById("todo-list").appendChild(todo);

		// todo입력창에 쓴 내용 초기화 
		document.getElementById("new-todo").value = "";
	}
}


document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
});