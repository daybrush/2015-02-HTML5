function makeTODO(todo){
	var source   = document.getElementById("todo-template").innerHTML;
	var template = Handlebars.compile(source);
	var context = {todoName: todo};
	var todoTemplate = template(context);

	return todoTemplate;
}

function addTODO(e){
	var ENTER_KEYCODE = 13;
	if(e.keyCode === ENTER_KEYCODE){ // 엔터를 눌렀을 때 

		// todo내용을 입력받아 todo 추가하기
		var todo = makeTODO(document.getElementById("new-todo").value);

		document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
		//document.getElementById("todo-list").appendChild(todo);

		/* 
		 * - insertAdjacentHTML => 문자열 형태를 받아서 insert해준다. 
		 * - appendChild => 노드가 인자로 들어가야한다.
		 * 여기에서 todo는 string형태이기 때문에 insertAdjacentHTML을 사용했다.
		 */
		
		// todo입력창에 쓴 내용 초기화 
		document.getElementById("new-todo").value = "";
	}
}

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
});