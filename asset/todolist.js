var DO = {
	ENTER_KEYCODE : 13,
	
	init : function(){				
		this["txtInput"] = document.getElementById("new-todo");
		this["todoLists"] = document.querySelector('ul#todo-list');
		this["eleCompleted"] = document.querySelector(".added");
				
		this.txtInput.addEventListener('keypress', this.makeTo.bind(this));
		this.todoLists.addEventListener('click', this.checkingCompletedTo);
		this.todoLists.addEventListener('click', this.deleteTo);
	},
		
	makeTo : function(evt){
		var sTxt = this.txtInput.value;
		
		if((evt.keyCode == this.ENTER_KEYCODE) && (sTxt != "")){	
			var newCompleted = this.eleCompleted.cloneNode(true);
			newCompleted.querySelector(".view label").innerHTML = sTxt;
			newCompleted.style.display = "block";
			this.todoLists.insertAdjacentElement('beforeend', newCompleted);
	
			this.fadeIn(newCompleted, 0.5);
			this.txtInput.value = "";
		}
	},
	
	fadeIn : function(ele, secondTerm){
		ele.offsetHeight;
		ele.style.transition = "opacity " + secondTerm + "s ease-in";
		ele.style.opacity = 1;		
	},
	 
	checkingCompletedTo : function(evt){
		if(evt.target.tagName == "INPUT")
			evt.target.parentNode.parentNode.classList.toggle("completed");			
	},
	
	deleteTo : function(evt){
		var CHANGE_PERIOD = 400;
		var FADEOUT_SPEED = 1 / CHANGE_PERIOD;//opacity 1 ~ 0 divided by CHANGE_PERIOD
		
		if(evt.target.tagName == "BUTTON"){
			var clickedList = evt.target.parentNode.parentNode;
			var startOpacity = 1;
			var startTime = null;
			
			function tickTok(timeByTok){
				if(!startTime) startTime = timeByTok;
				var interval = timeByTok - startTime;
				
				startOpacity =  (startOpacity - FADEOUT_SPEED) * interval;
				
				if(interval <= CHANGE_PERIOD){
					clickedList.style.opacity = startOpacity;
					requestAnimationFrame(tickTok);
				} else 
					clickedList.parentNode.removeChild(clickedList);	
	
			};
			requestAnimationFrame(tickTok);
		}		
	}
}

document.addEventListener("DOMContentLoaded", function(){
	DO.init();
})