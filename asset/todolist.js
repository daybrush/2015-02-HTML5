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

function completedTODO (e) {
    var input = e.target;
    var li = input.parentNode.parentNode;
    if(input.checked){
        li.className = "completed";
    }else{
        li.className = "";
    }
}

function removeTODO (e) {
    var li = e.target.parentNode.parentNode;
    //이렇게 하면 fadeout 이 먹히는데
    // $("#new-todo").fadeOut(1000, function() {
    //이렇게 하면 fadeout 이 않먹혀요 왜그런건가요?
    // $(li).fadeOut(1000, function() {
    //     li.parentNode.removeChild(li);
    // })
    
    $(li).addClass("deleting");
    setTimeout(function() {
        li.parentNode.removeChild(li);
    },1000);
}

function addTODO (e) {
    if(!TODO.target){ 
        TODO.target = document.getElementById("new-todo"); 
    }
    var oUl = document.getElementById("todo-list");
    var context = TODO.getContext();
    var li = TODO.get(context);
    console.log(li);
    oUl.insertAdjacentHTML('afterbegin', li);
    setTimeout(function () {
        $("li").removeClass("appending");
    }, 100);
    TODO.target.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    var ENTER_KEYCODE = 13;
    document.getElementById("new-todo").addEventListener("keydown", function (e) {
        if (e.keyCode == ENTER_KEYCODE) {
            addTODO(e);
        };
    });
    document.getElementById("todo-list").addEventListener("click", function (e) {
        e.stopPropagation();
        if(e.target.classList.contains("toggle")){
            completedTODO(e);
        }

        if(e.target.classList.contains("destroy")){
            removeTODO(e);
        }

    })
});

