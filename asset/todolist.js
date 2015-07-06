var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		document.addEventListener("DOMContentLoaded", function(){
			document.querySelector("#new-todo").addEventListener("keydown", this.add.bind(this)); 
			document.querySelector("#todo-list").addEventListener("click", this.completed);
			document.querySelector("#todo-list").addEventListener("click", this.remove);
		}.bind(this));
	},
	build : function(todo){
		var li = document.createElement("li");
		var todoObj = { title : todo }
		var template = Handlebars.compile(Templates.todoTemplate);
		li.innerHTML = template(todoObj);
		return li;
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = this.build(document.querySelector("#new-todo").value);
			document.querySelector("#todo-list").appendChild(todo);
			document.querySelector("#new-todo").value = "";
			setTimeout(function() {
    		todo.classList.add("appending");
  			}, 10);
  		}
	},
	completed : function(e){
		var input = e.target;
		var li = e.target.parentNode.parentNode;
		if(e.target.className !== "toggle") return;
		if(input.checked){
			li.className = "completed";
		}else{
			li.className = "";
		}

	}, 
	remove : function(e){
		var destroy = e.target;
		var li = e.target.parentNode.parentNode;
		if(e.target.className !== "destroy") return;
  		li.classList.add("deleting");
		setTimeout(function() {
  			li.parentNode.removeChild(li);
  		}, 1000);
	}
}

Templates = {}; 
Templates.todoTemplate = [
		'<div class="view">',
			'<input class="toggle" type="checkbox">',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
].join("\n");

TODO.init();