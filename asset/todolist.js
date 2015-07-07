var TODOSync = {
	get : function(){

	}, 
	add : function(){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://ui.nhnnext.org:3333/JB1021",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(xhr.responseText);
		});
		xhr.send();
	}, 
	completed : function(){

	}, 
	remove : function(){

	}
}

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
		var todoObj = { title : todo }
		var template = Handlebars.compile(Templates.todoTemplate);
		console.log(template(todoObj));
		return template(todoObj);
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = document.querySelector("#new-todo").value;
			// TODOSync.add(todo, function(json){
				var todoLi = this.build(todo);
				document.querySelector("#todo-list").insertAdjacentHTML('beforeend', todoLi);
				document.querySelector("#new-todo").value = "";
				setTimeout(function() {
    				document.querySelector("#todo-list").firstChild.classList.add("appending");
  				}, 10);
			// }.bind(this));
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
	'<li>',
		'<div class="view">',
			'<input class="toggle" type="checkbox">',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
	'<li>'
].join("\n");

TODO.init();