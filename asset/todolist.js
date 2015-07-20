//window.addEventListener("load", fp);
//document.addEventListener("DOMContentLoaded", fp);
//이 둘의 차이는?

//DOMContentLoaded 이벤트는 문서가 완전히 로드되고 전달되면 스프레드시트, 이미지, 서브프레임등의 로딩을
//기다리지 않고 실행된다.
//Load이벤트는 페이지가 완전히 로드된 상태를 감지하는데 사용할 수 있다.

var TODOSync = {
	get : function(callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://128.199.76.9:8002/atgchan", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback.init();
			var json = JSON.parse(xhr.responseText);
			for(var i=json.length-1; i>=0; i--) {
				var todoLi = callback.build(json[i].todo, json[i].id);
				document.getElementById("todo-list").appendChild(todoLi);
				todoLi.style.opacity = 1;

				if(json[i].completed === 1) {
					todoLi.className = "completed";
					todoLi.querySelector("input").checked = true;
				} else {
					todoLi.className = "";
				}					
			}
		});
		xhr.send();
	},
	add : function(todo, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", "http://128.199.76.9:8002/atgchan", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo=" + todo);
	},
	completed : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://128.199.76.9:8002/atgchan/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + param.completed);
	},
	remove : function(param, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", "http://128.199.76.9:8002/atgchan/"+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e) {
			callback(param.li);
		});
		xhr.send();
	}
};

var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		TODOSync.get({
			init : function(){
				//document.addEventListener("DOMContentLoaded", function(){
				//document.addEventListener("load", function(){
				document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
				//}.bind(this));
			}.bind(this),
			build : this.build.bind(this)
		});
	},
	build : function(todo, key){
		if (this.isSupported()) { //템플릿이 지원이 되면
			var template = document.querySelector("#todo-template");
			template.content.querySelector("label").innerText = todo;
			//console.log(template.content.querySelector(".toggle"));

			var li = document.importNode(template.content, true).querySelector("li");
			
			li.dataset.key = key;

			li.querySelector(".toggle").addEventListener("click", this.completed);
			li.querySelector("button").addEventListener("click", this.remove);

			return li;

		} else { //템플릿 지원이 안되면
			var li = document.createElement("li");
			li.dataset.key = key;
			var div = document.createElement("div");
			div.className = "view";
			var input = document.createElement("input");
			input.className = "toggle";
			input.setAttribute("type", "checkbox");
			input.addEventListener("click", this.completed); //Event delegation 을 찾아볼것
			var label = document.createElement("label");
			label.innerText = todo;
			var button = document.createElement("button");
			button.className = "destroy";
			button.addEventListener("click", this.remove);

			div.appendChild(input);
			div.appendChild(label);
			div.appendChild(button);

			li.appendChild(div);

			return li;
		}		
	},
	completed : function(e){
		var input  = e.currentTarget; // 이벤트를 할당한(바인딩한) 엘리멘트 (체크박스)
		//var input = e.target; // 이벤트를 발생시킨 엘리멘트 (지금은 같음)
		var li = input.parentNode.parentNode;
		var completed = input.checked?"1":"0";
		
		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		}, function(){
			
			if(completed === "1") {
				li.className = "completed";
			} else {
				li.className = "";
			}	
		});	
	},
	remove : function(e){
		var li = e.currentTarget.parentNode.parentNode;
		TODOSync.remove({
			"key" : li.dataset.key,
			"li" : li
		}, function(li){
			li.style.opacity = 0;
			li.addEventListener("transitionend", function(){
				li.parentNode.removeChild(li);
			});	
		});

		//CSS3를 이용하여 바꿔볼 수 있도록 공부할 것
		//keyframe 공부하기
		/*var i = 1;
		var key = setInterval(function() {
			if(i === 5) {
				clearInterval(key);
				li.parentNode.removeChild(li);
			} else {
				li.style.opacity = 1 - i * 0.2;
			}
			i++;
		}, 160);*/ //반복되는 시간마다 반복을 해줌
		//requestAnimationFrame() //프레임마다 에니메이션을 실행	
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE){
			var todo = document.getElementById("new-todo").value;
			
			TODOSync.add(todo, function(json){

				var todoLi = this.build(todo, json.insertId);
				
				/*todo.style.opacity = 0;
				document.getElementById("todo-list").appendChild(todo);

				var i = 1;
				var key = setInterval(function() {
					if(i === 6) {
						clearInterval(key);
					} else {
						todo.style.opacity = i * 0.2;
					}
					i++;
				}, 160);*/

				document.getElementById("todo-list").appendChild(todoLi);
				window.setTimeout(function(){
					todoLi.style.opacity = 1;
				}, 20);

				document.getElementById("new-todo").value = "";
			}.bind(this));
		}		
	},
	isSupported : function(){
	  return 'content' in document.createElement('template');	
	}
};

TODO.init();
