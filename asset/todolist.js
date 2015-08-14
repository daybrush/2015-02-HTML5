var DOSync = {
	URL : "http://128.199.76.9:8002/tminlim",

//get all lists
	getTo : function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.URL ,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load", function(e){
			callback(xhr.responseText);
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
		
/* 		this.getTo(); */
	},
	
	getTo : function(){
	var that = this;

		DOSync.getTo(function(allTodolist){
			var list = JSON.parse(allTodolist);
			for(var i = list.length-1;i>=0;i--){
				var newCompleted = that.eleCompleted.cloneNode(true);	
				var labelTxt= newCompleted.querySelector("div.view>label");
				labelTxt.innerHTML=list[i].todo;
/* 				style  */
				newCompleted.style.display="block";
				newCompleted.style.transition="opacity 0.5s ease-in";
				newCompleted.style.opacity="1";
				that.todoLists.insertAdjacentElement("beforeEnd", newCompleted);
			}
		});

		
	},
	
/* {"id":8446,"todo":"ASDF","nickname":"tminlim","completed":1,"date":"2015-08-13T22:44:31.000Z"}, */
/*
<li class="added" data-id-todo="8485" style="display: block; transition: opacity 0.5s ease-in; opacity: 1;">
	<div class="view">
		<input class="toggle" type="checkbox" {}="">
		<label>sadf</label>
		<button class="destroy"></button>
	</div>
</li>
*/
		
	makeTo : function(evt){
		var sTxt = this.txtInput.value;
		
		if((evt.keyCode == this.ENTER_KEYCODE) && (sTxt != "")){
			DOSync.addTo(sTxt, function(addTodo){
				console.log(addTodo);
				var newCompleted = this.copyLi(sTxt, addTodo)
				this.todoLists.insertAdjacentElement('beforeend', newCompleted);
		
				this.fadeIn(newCompleted, 0.5);
				this.txtInput.value = "";				
			}.bind(this));
		}
	},
	
	copyLi : function(sTxt, dataSource){
		var newElement = this.eleCompleted.cloneNode(true);
		newElement.dataset.idTodo = dataSource.insertId;
		newElement.querySelector(".view label").innerHTML = sTxt;
		newElement.style.display = "block";	
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
				console.log(deleteTodo);
/* 				console.log(JSON.stringfy(rs)); JSON.parse 객체로 넘겨서 문자열로 왜 안찍힐까 */
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

