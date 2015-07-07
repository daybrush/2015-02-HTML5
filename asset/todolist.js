//document.addEventListener["load", fp];
//document.addEventListener["DOMContentLoaded", fp];


function makeTODO (context) {
	var source =  $("#entry-template").html();
	var template = Handlebars.compile(source);
	var eLi = template(context);
	return eLi;
}

document.addEventListener("DOMContentLoaded", function () {
	var ENTER_KEYCODE = 13;
	document.getElementById("new-todo").addEventListener("keydown", function (e) {
		if (e.keyCode == ENTER_KEYCODE) {
			var oTarget = document.getElementById("new-todo");
			var oUl = document.getElementById("todo-list");
			var context = { target: oTarget.value};
			oUl.insertAdjacentHTML('afterbegin', makeTODO(context));
			oTarget.value = "";
		};
	})
});