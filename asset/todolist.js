var DOSync = {
	URL : "http://128.199.76.9:8002/tminlim",
	
	getTo : function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.URL ,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			var needAtr = ["id","todo","completed"];/*completed: 0 id: 2345 todo: "asdf"*/					callback(JSON.parse(JSON.stringify(JSON.parse(xhr.responseText), needAtr)));
		});
		xhr.send(null);	
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
		this["txtInput"] = document.getElementById("new-todo");
		this["todoLists"] = document.querySelector('ul#todo-list');
		this["eleCompleted"] = document.querySelector(".added");
				
		this.txtInput.addEventListener('keypress', this.makeTo.bind(this));
		this.todoLists.addEventListener('click', this.checkingCompletedTo);
		this.todoLists.addEventListener('click', this.deleteTo);
		
		this.getTo();
	},
	
	getTo : function(){
		DOSync.getTo(function(allTodoLists){			
			var attachableLists = document.createDocumentFragment();
			this.cacheAllLists(attachableLists, allTodoLists);
			this.todoLists.appendChild(attachableLists);

		}.bind(this));
	},
	
	cacheAllLists : function(blankElement, data){
		var sLists = '';
		
		for(var i = 0, len = data.length; i < len; i++){
			var eachEle = data[i];
			var newElement = this.eleCompleted.cloneNode(true);
			
			if(eachEle.completed != 0){
				newElement.classList.add("completed");
				newElement.querySelector("input").checked = true;
			}
			
			newElement.dataset.idTodo = eachEle.id;
			newElement.querySelector(".view label").innerHTML = eachEle.todo;
			newElement.style.transition = "opacity 0.5s ease-in";
			newElement.style.opacity = 1;
			newElement.style.display = "block";

			blankElement.appendChild(newElement);
		}
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
		if(evt.target.tagName == "INPUT"){
		 var checkedLi = evt.target.parentNode.parentNode;
		 var isCompleted = (checkedLi.childNodes[1].childNodes[1].checked)?"1":"0";
			DOSync.completedTo({"idTodo" :checkedLi.dataset.idTodo, "isCompleted" : isCompleted},
				function(){
					checkedLi.classList.toggle("completed")
				});
		}				
	},
	
	deleteTo : function(evt){
		var CHANGE_PERIOD = 400;
		var FADEOUT_SPEED = 1 / CHANGE_PERIOD;//opacity 1 ~ 0 divided by CHANGE_PERIOD
		
		if(evt.target.tagName == "BUTTON"){
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
}

document.addEventListener("DOMContentLoaded", function(){
	DO.init();
})
