var TODO = {
	ENTER_KEYCODE : 13,
	init : function() {
		document.addEventListener("DOMContentLoaded", function() {
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
			document.getElementById("todo-list").addEventListener("click", this.completed); //this 안썻기 때메 굳이 bind 필요 없다 
			document.getElementById("todo-list").addEventListener("click", this.deleted);
		}.bind(this))
	},
	build : function(enteredTitle) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {title : enteredTitle};
		var todo = template(context);

		return todo;
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var li = document.createElement("li");
			li.className = "appending";
			document.getElementById("todo-list").appendChild(li);

			var todo = this.build(e.target.value);
			li.insertAdjacentHTML('beforeend', todo);
			document.getElementById("new-todo").value = "";

			// document.getElementById("todo-list").addEventListener('webkitTransitionEnd', function() {
			// 	console.log("hi");
				// li.className = "";
			// });

			// li.addEventListener("transitionstart", function(){
			// 	console.log("hihi");
			// 	li.className = "";
			// })

			//이 부분도 deleteTODO 에서와 마찬가지로 transitionend를 써서 동일하게 구현하고 싶은데
			//두 개가 동작 방식 자체가 다른건지 이 부분은 transitionend 코드가 동작하지 않네요 
			//여기에도 transitionend을 써서 구현할 수 있나요? 
	    	setTimeout(function () {
	       	 	li.className = "";
	   	 	}, 100);
		}
	}, 
	completed : function(e) {
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
	},
	deleted : function(e) {
		var button = e.target;
		if(button.className === "destroy") {	//이 부분 꼭 필요! 
			var li = e.target.parentNode.parentNode;
			li.className = "deleting";
				
			li.addEventListener("transitionend", function(){
				li.parentNode.removeChild(li);
			})

			//setTimeout(function () {
			//	li.parentNode.removeChild(li);
	  		//}, 1000);
		}
	}
};

TODO.init();


