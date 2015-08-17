var TODOSync = {
	url : "http://128.199.76.9:8002/",
	id : "kimhyewon",
	init : function() {
		window.addEventListener("online", this.onofflineListener);	//온라인일 때 발생
		window.addEventListener("offline", this.onofflineListener);	//오프라인일 때 발생 
	},
	onofflineListener : function() {
		// if(navigator.onLine) { 	//온라인이면 
		// 	document.getElementById("header").classList.remove("offline");
		// } else {
		// 	document.getElementById("header").classList.add("offline");
		// }

		document.getElementById("header").classList[navigator.onLine?"remove":"add"]("offline");
		//윗 부분과 같은 코드다. 삼항연산자 	

		if(navigator.onLine) {
			//서버로 싱크 맞추기 
		}
	},
	get : function(callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", this.url+this.id, true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		
		xhr.send(null);
	},
	add : function(todo, callback) {
		if(navigator.onLine) {
			var xhr = new XMLHttpRequest();
		
			xhr.open("PUT", this.url+this.id+"/", true);
		
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
			xhr.addEventListener("load", function(e) {
				callback(JSON.parse(xhr.responseText))
			});
		
			xhr.send("todo=" + todo);
		} else {
			//data를 클라이언트에 저장. localStorage(많이사용), indexedDB, websql
		}
	},
	completed : function(param, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("POST", this.url+this.id+"/" + param.key, true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e) {
			callback(JSON.parse(xhr.responseText))
		});
		
		xhr.send("completed=" + param.completed);
	},
	deleted : function(param, callback) {
		var xhr = new XMLHttpRequest();
		
		xhr.open("DELETE", this.url+this.id+"/" + param.key, true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		
		xhr.send(null);
	}
}

var TODO = {
	ENTER_KEYCODE : 13,
	selectedIndex : 0,
	init : function() {
		document.addEventListener("DOMContentLoaded", function() {
			document.getElementById("new-todo").addEventListener("keydown", this.add.bind(this));
			document.getElementById("todo-list").addEventListener("click", this.completed); //this 안썻기 때메 굳이 bind 필요 없다 
			document.getElementById("todo-list").addEventListener("click", this.deleted);
			this.get();
			//밑의 필터 클릭시 클릭된 엘리먼트에 효과주는 이벤트 
			document.getElementById("filters").addEventListener("click", this.changeStateFilter.bind(this));
			window.addEventListener("popstate", this.changeURLFilter.bind(this));
			
		}.bind(this))
	},
	changeURLFilter : function(e) { 	//뒤로가기 관련 
		if(e.state) {	//있는 경우 
			var method = e.state.method;
			
			// if(method === "all") {	//해당 뷰를 호출 
			// 	this.allView();
			// } else if(method === "active") {
			// 	this.activeView();
			// } else if(method === "completed") {
			// 	this.completedView();
			// } 

			this[method+"View"]();	//위 코드와 같다. 이렇게 오브젝트 리터럴을 호출할 수 있다. 많이 사용됨.

		} else {
			this.allView(); //첫번째 페이지니까 이걸 호출 
		}
	},
	changeStateFilter : function(e) {
		var target = e.target;
		var tagName = target.tagName.toLowerCase(); //대소문자 처리 
		if(tagName == "a") {
			var href = target.getAttribute("href");
			if(href === "index.html") {
				this.allView();
				history.pushState({"method":"all"},null,"index.html"); //파라미터, 타이틀명, 페이지명 
			} else if(href === "active") {
				this.activeView();
				history.pushState({"method":"active"},null,"#/active");
			} else if(href === "completed") {
				this.completedView();
				history.pushState({"method":"completed"},null,"#/completed");
			}
		}
		e.preventDefault(); //a 태그라서 페이지 이동하므로 막아줌 
	},
	allView : function() { 	//전체보기 
		document.getElementById("todo-list").className = "";
		this.selectedNavigator(0);
		// history.pushState({"method":"all"},null,"index.html"); //위로 옮겨야 한다. 여기 있으면 다시 추가되기 때문에. 
	},
	activeView : function() {
		document.getElementById("todo-list").className = "all-active";
		this.selectedNavigator(1);
	},
	completedView : function() {
		document.getElementById("todo-list").className = "all-completed";
		this.selectedNavigator(2);
	},
	selectedNavigator : function(index) {
		var navigatorList = document.querySelectorAll("#filters a"); //All인 이유는 리스트 다 받아와야 해서.
		navigatorList[this.selectedIndex].classList.remove("selected"); //기존에 선택된 건 삭제하고,
		navigatorList[index].classList.add("selected"); // 새로운 엘리먼트 인덱스는 추가. 
		this.selectedIndex = index; //다시 담기 
	},
	// changeState : function(index){

	// },
	get : function() {
		TODOSync.get(function(e){
			
			e.forEach(function(arr){
				var completed = arr.completed == 1 ? "completed" : null;
				var todoLi = this.build(arr.todo, arr.id, completed);
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
			}.bind(this));
		}.bind(this));
	},
	build : function(enteredTitle, key, completed) {
		var source = document.getElementById("todo-template").innerHTML;
		var template = Handlebars.compile(source);
		var context = {title : enteredTitle, key : key, completed : completed};
		var todo = template(context);

		return todo;
	},
	add : function(e) {
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = e.target.value;

			//콜백으로 변경 
			TODOSync.add(todo, function(json) {
				console.log(json);

				var todoLi = this.build(todo, json.insertId);	//key값 넣어줌 
				document.getElementById("todo-list").insertAdjacentHTML('beforeend', todoLi);
				document.getElementById("new-todo").value = "";
					
				var target = document.getElementById("todo-list").querySelector("li:nth-last-child(1)");
				target.className = "appending";	

		    	setTimeout(function () {
		    		target.className = "";
		   	 	}, 100);


				// console.log(target);
				// target.addEventListener("transitionend", function(){
				// 	console.log("dddd");
				// 	// target.className = ""; 
				// }.bind(this));
				// target.offsetHeight;
				
			}.bind(this));
		}
	}, 
	completed : function(e) {
		var input = e.target;
		var li = e.target.parentNode.parentNode;
		var completed = input.checked?"1":"0";	//체크 돼있으면 1, 안돼있으면 0 

		TODOSync.completed({
			"key" : li.dataset.key,
			"completed" : completed
		}, function() {
			if(input.className === "toggle") {	//이 부분 꼭 필요! 
				if(completed==="1") {
					li.className = "completed";
				}
				else {
					li.className = "";
				}
			}
		})
		
	},
	deleted : function(e) {
		var button = e.target;
		if(button.className === "destroy") {	//이 부분 꼭 필요! 
			var li = e.target.parentNode.parentNode;

			TODOSync.deleted({
				"key" : li.dataset.key
			}, function(){
				li.className = "deleting";
				
				li.addEventListener("transitionend", function(){
					li.parentNode.removeChild(li);
				}.bind(this))
			})
		}
	}
};

TODO.init();
TODOSync.init();

