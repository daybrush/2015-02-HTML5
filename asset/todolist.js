var TODO = {
	init : function(){
		document.addEventListener("DOMContentLoaded", function(){
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this)); // keypress로 해도됨! 
			document.getElementById("todo-list").addEventListener("click", function(e){
				if(e.target.className == "toggle"){
					this.completed(e);
				}
				if(e.target.className == "destroy"){
					this.remove(e);
				}
			}.bind(this));
		}.bind(this));
	},

	makeTODO : function(todo){
		var source   = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {todoName: todo};
		var todoTemplate = template(context);

		return todoTemplate;
	},

	add : function(e){
		var ENTER_KEYCODE = 13;
		if(e.keyCode === ENTER_KEYCODE){ // 엔터를 눌렀을 때 

			// todo내용을 입력받아 todo 추가하기
			var todo = this.makeTODO(document.getElementById("new-todo").value);

			document.getElementById("todo-list").insertAdjacentHTML('beforeend', todo);
			
			// todo입력창에 쓴 내용 초기화 
			document.getElementById("new-todo").value = "";
		}
	},

	completed : function(e){
		var input = e.target;
		var li = input.parentNode.parentNode;

		if(input.checked){
			li.className = "completed";
		} else {
			li.className = "";
		}
	},

	remove : function(e){
		var li = e.target.parentNode.parentNode;
		
		li.classList.add("deleting"); // 제대로 동작함
		
		setTimeout(function() {
	        li.parentNode.removeChild(li);
	    },1000);
	}
};

TODO.init();

