//document.addEventListener["load", fp];
//document.addEventListener["DOMContentLoaded", fp];

var TODO = {
    get: function(context) {
    	var html = $("#entry-template").html();
    	var template = Handlebars.compile(html);
    	this.get = template;
        return template(context);
    }
}

function completedTODO (target) {
    var li = $(target).closest("li");
    if(target.checked){
    	li.addClass("completed");
    }else{
    	li.removeClass("completed");
    }
}

function removeTODO (li) {
	li.one("transitionend", function () {
		li.remove();
	});
    li.addClass("deleting");
}

function addTODO (e) {
    var oUl = document.getElementById("todo-list");
    var context = {target: TODO.target.value}
    var li = TODO.get(context);
    oUl.insertAdjacentHTML('afterbegin', li);
    //이부분 settimeout 없이 그냥 에니메이션 하려면 어떻게 해야 하나요?
    setTimeout(function () {
        $("li").removeClass("appending");
    }, 100);
    TODO.target.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    TODO.target = document.getElementById("new-todo");
    var ENTER_KEYCODE = 13;
    document.getElementById("new-todo").addEventListener("keydown", function (e) {
        if (e.keyCode == ENTER_KEYCODE) {
            addTODO(e);
        };
    });

    $("#todo-list").on("click", ".toggle", function () {
    	completedTODO(this);
    });
    $("#todo-list").on("click", ".destroy", function () {
    	removeTODO($(this).closest("li"));
    });
});

