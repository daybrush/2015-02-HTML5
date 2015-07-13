function makeTODO(todo){


	var source = $("#templ").html();
	var template = Handlebars.compile(source);

	var data = { content: todo };

	return template(data);

}



function addTODO(e){
	var ENTER_KEYCODE = 13;
	if(e.keyCode === ENTER_KEYCODE){
			var todo = makeTODO(document.getElementById("new-todo").value);
			$('#todo-list').append(todo);
			document.getElementById("new-todo").value = "";
		}
}


document.addEventListener("DOMContentLoaded", function(){
	
	document.getElementById("new-todo").addEventListener("keydown", addTODO);
});

