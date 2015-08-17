var DOSync = {
	URL : "http://128.199.76.9:8002/tminlim",
	
	init : function(){
		window.addEventListener("online", this.onoffListener);
		window.addEventListener("offline", this.onoffListener);
	},
	
	onoffListener : function(){
		console.log("evt");
		document.getElementById("header").classList[(navigator.onLine)?"remove" : "add"]("offline");
		
		if(navigator.onLine){
			//sync server
		}
	},
	
	getTo : function(callback){
		if(navigator.onLine){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", this.URL ,true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
			xhr.addEventListener("load", function(e){
				var needAtr = ["id","todo","completed"];/*completed: 0 id: 2345 todo: "asdf"*/					callback(JSON.parse(JSON.stringify(JSON.parse(xhr.responseText), needAtr)));
			});
			xhr.send(null);				
		} else {
			//data are stored in a client; localStorage, indexedDB
		}

	},

	addTo :function(todo, callback){//considering error callback 
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", this.URL ,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo=" + todo);
	},
	
	completedTo : function(checkedLi, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", this.URL +"/"+ checkedLi.idTodo ,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed=" + checkedLi.isCompleted);	
	},

	deleteTo :function(deletedLi, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", this.URL +"/"+ deletedLi.deleteId,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(xhr.responseText);
		});
		xhr.send(null);	
	}
}
					
var DO = {
	ENTER_KEYCODE : 13,
	
	init : function(){
		DOSync.init();
				
		this["txtInput"] = document.getElementById("new-todo");
		this["todoLists"] = document.querySelector('ul#todo-list');
		this["eleCompleted"] = document.querySelector(".added");
				
		this.txtInput.addEventListener('keypress', this.makeTo.bind(this));		
		this.getTo();
	},
	
	getTo : function(){
		DOSync.getTo(function(allTodoLists){			
			this.todoLists.appendChild(this.cacheAllLists(allTodoLists));
			this.initEvtBind();
		}.bind(this));
	},	
	
	initEvtBind : function(){
		this.todoLists.addEventListener('click', this.evtFilter.bind(this));
		document.querySelector('ul#filters').addEventListener('click', this.changeStateFilter.bind(this));
	},
	
	evtFilter : function(evt){
		var evtTag = evt.target.tagName.toLowerCase();
		if(evtTag == "input") this.checkingCompletedTo(evt);
		if(evtTag == "button") this.deleteTo(evt);
	},
	
	changeStateFilter : function(evt){
		var target = evt.target;
		console.log(target);

		var evtTag = evt.target.tagName.toLowerCase();
		if(evtTag == "a"){
			var href = target.getAttribute("href");
			if(href === "index.html"){
				this.listOfAll();
			} else if(href === "active"){
				this.listByActive();
			} else if(href === "complete"){
				this.listByCompleted();
			}
		}
		evt.preventDefault();
	},
	
	listOfAll : function(){
		this.todoLists.className = "";
	},
	
	listByActive : function(){
		this.todoLists.className = "all-active";

	},
	
	listByCompleted : function(){
		this.todoLists.className = "all-completed";
		
	},
		
	cacheAllLists : function(data){//DOM을 많이 건드리니 요 함수 뭔가 refactoring 하고 싶지만
		var frag = document.createDocumentFragment();
		for(var i = 0, len = data.length; i < len; i++){
			var eachEle = data[i];
			var newElement = this.eleCompleted.cloneNode(true);
			//apply data 
			if(eachEle.completed != 0){
				newElement.classList.add("completed");
				newElement.querySelector("input").checked = true;
			}		
			newElement.dataset.idTodo = eachEle.id;
			newElement.querySelector(".view label").innerHTML = eachEle.todo;
			//set css
			newElement.style.transition = "opacity 0.5s ease-in";
			newElement.style.opacity = 1;
			newElement.style.display = "block";//더 늦게 block 할 방법 없을까 아니면 block해도 차이 없나?
			//DOM
 			frag.appendChild(newElement);
		}
		return frag;
	},
		
	makeTo : function(evt){
		var sTxt = this.txtInput.value;
		
		if((evt.keyCode == this.ENTER_KEYCODE) && (sTxt != "")){
			DOSync.addTo(sTxt, function(addTodo){
				console.log("just added !" + addTodo);
				var newCompleted = this.copyLi(sTxt, addTodo)
				
				this.todoLists.insertAdjacentElement('afterbegin', newCompleted);
				newCompleted.style.display = "block";	

				this.fadeIn(newCompleted, 0.5);
				this.txtInput.value = "";				
			}.bind(this));
		}
	},
	
	copyLi : function(sTxt, dataSource){
		var newElement = this.eleCompleted.cloneNode(true);
		newElement.dataset.idTodo = dataSource.insertId;
		newElement.querySelector(".view label").innerHTML = sTxt;
		return newElement;	
	},
	
	fadeIn : function(ele, secondTerm){
		ele.offsetHeight;
		ele.style.transition = "opacity " + secondTerm + "s ease-in";
		ele.style.opacity = 1;
	},
	 
	checkingCompletedTo : function(evt){
	 var checkedLi = evt.target.parentNode.parentNode;
	 var isCompleted = (checkedLi.childNodes[1].childNodes[1].checked)?"1":"0";
	 
		DOSync.completedTo({"idTodo" :checkedLi.dataset.idTodo, "isCompleted" : isCompleted},
			function() {checkedLi.classList.toggle("completed");}
		);			
	},
	
	deleteTo : function(evt){
		var CHANGE_PERIOD = 400;
		var FADEOUT_SPEED = 1 / CHANGE_PERIOD;//opacity 1 ~ 0 divided by CHANGE_PERIOD
		var clickedList = evt.target.parentNode.parentNode;
		
		DOSync.deleteTo({"deleteId":clickedList.dataset.idTodo}, function(deleteTodo){
			console.log("deleted!" + deleteTodo);
			
			var startOpacity = 1;
			var startTime = null;
			
			function tickTok(timeByTok){
				if(!startTime) startTime = timeByTok;
				var interval = timeByTok - startTime;
				
				opacityFromStart =  (startOpacity - FADEOUT_SPEED) * interval;
				
				if(interval <= CHANGE_PERIOD){
					clickedList.style.opacity = opacityFromStart;
					requestAnimationFrame(tickTok);
				} else 
					clickedList.parentNode.removeChild(clickedList);	
			};
			requestAnimationFrame(tickTok);
		})		
	}
}

document.addEventListener("DOMContentLoaded", function(){
	DO.init();
})
