//document.addEventListener["load", fp];
//document.addEventListener["DOMContentLoaded", fp];

// var TODO = {
// 	get : function (context) {
// 		this.get = function (context) {
// 			var html =  $("#entry-template").html();
// 			var template = Handlebars.compile(html);
// 			return template(context);
// 		}
// 	}
// }
var TODO = {
	target : null,
	getContext:function () {
		return {target: this.target.value}
	},
    get: function(context) {
    	var html = $("#entry-template").html();
    	var template = Handlebars.compile(html);
    	this.get = template;
        return template(context);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    var ENTER_KEYCODE = 13;
    document.getElementById("new-todo").addEventListener("keydown", function(e) {
        if (e.keyCode == ENTER_KEYCODE) {
	    	if(!TODO.target){ 
	    		TODO.target = document.getElementById("new-todo"); 
	    	}
            var oUl = document.getElementById("todo-list");
            var context = TODO.getContext(context);
            oUl.insertAdjacentHTML('afterbegin', TODO.get(context));
            TODO.target.value = "";
        };
    })
});