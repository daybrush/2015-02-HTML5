/* 
$("input").keypress(function(e) {
    if (e.which !== 0) {
        alert("Charcter was typed. It was: " + String.fromCharCode(e.which));
    }
});
*/

document.addEventListener("DOMContentLoaded", function(evt){
/* 	var txtInput = document.getElementById("new-todo"); */
	var txtInput = document.getElementById("new-todo");	
	var todoLists = document.querySelector('ul#todo-list');
	var eleCompleted = document.querySelector(".added");	
	
	console.log('txtInput: ', txtInput)		
	
	
/*
	txtInput.addEventListener('keypress', function(evt){		
		if(evt.keyCode == 13){
			console.log("haha");			
			eleCompleted.style.display = "block";
			todoLists.insertAdjacentElement('beforeend', eleCompleted);			
		}
	}, false);
*/

	txtInput.addEventListener('keypress', function(evt){
		if(evt.keyCode == 13){
			var sTxt = txtInput.value;
			if(eleCompleted.style.display == ""){
				insertTxt(".view label", sTxt);
				eleCompleted.style.display = "block";		
			
			} else {
				var newCompleted = eleCompleted.cloneNode(true);
				insertTxt(".view label", sTxt);
				todoLists.insertAdjacentElement('beforeend', newCompleted);	
			}			
		}
		
		function insertTxt(ele, string){
			document.querySelector(ele).innerHTML = string;
			txtInput.value = "";				
		}		
	}, false);
	
})
