//NEXT 2015_2학기_HTML5 : shinyoung

/* 150702
 * enter키(keycode : 13) 입력 이벤트 발생 시 todo(li element) 추가
 * AddTodoItemToList()
 * createTodoItem()
 */

 /* 150707
  * 할일목록에서 완료처리, 삭제처리....하드코딩.... 
  * event delegation 적용. 
  * completeTodoItem()
  * destroyTodoItem()
  */

/* 1507011
 * 등록/삭제 애니메이션 추가 
 * 왜 투명도가 바뀌는데 보이는건 똑같으냐......!!!!!!
 */

/* 150713
 * keyframe(transform) 사용 css애니메이션 코드 추가. 띠용띠용.
 * custom.css - shake
 */

document.addEventListener("DOMContentLoaded", function(){
	var newTodo = document.getElementById("new-todo");
	newTodo.addEventListener("keydown", addTodoItemToList, false);

	var todoList = document.getElementById("main");
	todoList.addEventListener("click", completeTodoItem ,false);
	todoList.addEventListener("click", destroyTodoItem, false);
});

function addTodoItemToList(event){
	if(event.keyCode === 13){
		var newTodo = document.getElementById("new-todo");
		var todoLabel = newTodo.value;
		if(todoLabel === ""){
			alert("할 일을 입력해주세요!");
			return;
		}
		var createdTodoItem = createTodoItem(todoLabel);

        //animation #using js setInterval()
//		createdTodoItem.style.opacity = 0;
//		var welcome = setInterval(function(){
//			if(parseFloat(createdTodoItem.style.opacity) >= 1){
//				document.getElementById("todo-list").appendChild(createdTodoItem);
//				newTodo.value = "";
//				clearInterval(welcome);
//			}
//			else{
//				createdTodoItem.style.opacity = parseFloat(createdTodoItem.style.opacity) + 0.03;
//			}
//		},16);
        
        //animation #using css keyframes
        createdTodoItem.classList.add("shake");
        document.getElementById("todo-list").appendChild(createdTodoItem);
        newTodo.value = "";
	}
}

function createTodoItem(todoLabel){
	var todoItem = document.createElement("li");
	todoItem.setAttribute("class", "{}");
	var source = '<div class="view"><input class="toggle" type="checkbox" {}><label>{{todoLabel}}</label><button class="destroy"></button></div>';
	var template = Handlebars.compile(source);
	var data = {"todoLabel" : todoLabel};
	var result = template(data);
	todoItem.innerHTML = result;

	return todoItem;
}

//e.currentTarget vs e.target
function completeTodoItem(event){
	var checkbox = event.target;
	var todoItem = checkbox.parentNode.parentNode;

	if(checkbox.className === "toggle"){
		if(checkbox.checked){
			todoItem.classList.add("completed");	
		}
		else{
			todoItem.classList.remove("completed");
		}
	}

	//전체 done처리 
	if(checkbox.id === "toggle-all"){
		var todoItems = document.getElementsByClassName("{}");
		if(checkbox.checked){
			for(var i=0; i<todoItems.length ; i++){
				todoItems[i].classList.add("completed");
				todoItems[i].childNodes[0].childNodes[0].checked = true;
			}
		}
		else{
			for(var i=0; i<todoItems.length ; i++){
				todoItems[i].classList.remove("completed");
				todoItems[i].childNodes[0].childNodes[0].checked = false;
			}
		}
	}
}

//setInterval vs requestAnimationFrame
function destroyTodoItem(event){
	var itemToDestroy = event.target.parentNode.parentNode;
	if(event.target.className === "destroy"){
		itemToDestroy.style.opacity = 1;
		var farewell = setInterval(function(){
			if(parseFloat(itemToDestroy.style.opacity) <= 0){
				itemToDestroy.parentNode.removeChild(itemToDestroy);
				clearInterval(farewell);
			}
			else{
				itemToDestroy.style.opacity = parseFloat(itemToDestroy.style.opacity) - 0.03;
			}
		}, 16);
	}
}