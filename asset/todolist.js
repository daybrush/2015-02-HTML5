document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('new-todo').addEventListener('keydown', function(e){
		var enterkey = 13;

		if(e.keyCode === enterkey){
			var li = document.createElement('li');
			var div = document.createElement('div');
			div.className = "view";
			var input = document.createElement('input');
			input.className = "toggle";
			input.setAttribute = ("type", "checkbox");
			var label = document.createElement('label');
			label.innerText = document.getElementById('new-todo').value;
			var button = document.createElement('button');
			button.className = "destroy";

			div.appendChild(input);
			div.appendChild(label);
			div.appendChild(button);

			li.appendChild(div);

			document.getElementById('todo-list').appendChild(li);
			document.getElementById('new-todo').value = "";
		}
	});
});