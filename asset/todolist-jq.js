var TODOSync = {
    URL : "http://128.199.76.9:8002/nickname",
    get : function(callback) {
        $.ajax({method: "GET", url: this.URL}).done(callback);
    },
    add : function(todo,callback) {
        $.ajax({method: "PUT", url: this.URL, data: "todo="+todo}).done(callback);
    },
    completed : function(param,callback) {
        $.ajax({method: "POST", url: this.URL+'/'+param.key, data:"completed="+param.completed}).done(callback);
    },
    remove : function(param,callback) {
        $.ajax({method: "DELETE", url: this.URL+'/'+param.key}).done(callback);
    }
}

var TODO = {
    oInput: null,
    ENTER_KEYCODE : 13,
    init: function () {
        this.oInput = $("#new-todo");
        // 이건 왜 않먹히는 걸까요?
        // this.oInput = $("#new-todo").get(0);
        this.oInput.on("keydown", this.add.bind(this));
        $("#todo-list").on("click", ".toggle", this.completed);
        $("#todo-list").on("click", ".destroy", this.remove);
        this.get();
    },
    build: function(context) {
    	var html = $("#entry-template").html();
    	var template = Handlebars.compile(html);
    	this.build = template;
        return template(context);
    },
    get : function () {
        TODOSync.get(function (json) {
            $("#todo-list").append(json.map(function (obj) {
                return TODO.build({target: obj.todo, key: obj.id, completed: obj.completed});
            }).join(''));
            setTimeout(function () {
                $("li").removeClass("appending");
            }, 0);
        })
    },
    completed : function (e) {
        var li = $(e.currentTarget).closest("li");
        var checked = e.currentTarget.checked?"1":"0";

        TODOSync.completed({
            "key" : li.data("key"),
            "completed" : checked
        }, function () {
            if(e.currentTarget.checked){
                li.addClass("completed");
            }else{
                li.removeClass("completed");
            }
        })
    },
    remove : function (e) {
        var li = $(e.currentTarget).closest("li")
        li.one("transitionend", function () {
            TODOSync.remove({
                "key": li.data("key")
            }, function () {
                li.remove();
            })
        });
        li.addClass("deleting");
    },
    add : function (e) {
        if (e.keyCode !== this.ENTER_KEYCODE) {return}

        var todo = TODO.oInput.val();
        TODOSync.add(todo, function (json) {
            $("#todo-list").prepend(TODO.build({target: todo, key: json.insertId}));
            setTimeout(function () {
                $("li").removeClass("appending");
            }, 0);
            // 왜 에가 나는지 모르겠어요!!
            // Invalid left-hand side in assignment
            // TODO.oInput.val() = ""; 
            TODO.oInput.val('')
        });
    }
}

$(function () {
    TODO.init();
});

