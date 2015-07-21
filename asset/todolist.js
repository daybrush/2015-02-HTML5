//document.addEventListener["load", fp];
//document.addEventListener["DOMContentLoaded", fp];


var TODOSync = {
    get : function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://128.199.76.9:8002/nickname", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.addEventListener("load", function (e) {
            callback(JSON.parse(xhr.responseText));
        });
        xhr.send();
    },
    add : function (todo, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://128.199.76.9:8002/nickname", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.addEventListener("load", function (e) {
            callback(JSON.parse(xhr.responseText));
        });
        xhr.send("todo="+todo);
    },
    completed : function (param, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://128.199.76.9:8002/nickname/"+param.key, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.addEventListener("load", function (e) {
            callback(JSON.parse(xhr.responseText));
        });
        xhr.send("completed="+param.completed);
    },
    remove : function(param, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://128.199.76.9:8002/nickname/"+param.key, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.addEventListener("load", function (e) {
            callback(JSON.parse(xhr.responseText));
        });
        xhr.send();
    }
}

var TODO = {
    ENTER_KEYCODE : 13,
    init: function () {
        document.addEventListener("DOMContentLoaded", function() {
            this.target = document.getElementById("new-todo");
            document.getElementById("new-todo").addEventListener("keydown",this.add.bind(this));
            this.get();
            // $("#todo-list").on("click", ".toggle", this.completed.bind(this));
            $("#todo-list").on("click", ".toggle", function () {
                TODO.completed(this);
            });
            
            $("#todo-list").on("click", ".destroy", function () {
                TODO.remove(this);
            });
        }.bind(this));
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
                return TODO.build({target: obj.todo, key: obj.id});
            }).join(""));
            setTimeout(function () {
                $("li").removeClass("appending");
            }, 0);
        })
    },
    completed : function (target) {
        var li = $(target).closest("li");
        var checked = target.checked?"1":"0";

        TODOSync.completed({
            "key" : li.data("key"),
            "completed" : checked
        }, function () {
            if(target.checked){
                li.addClass("completed");
            }else{
                li.removeClass("completed");
            }
        })
    },
    remove : function (target) {
        var li = $(target).closest("li")
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
        var todo = TODO.target.value;
        TODOSync.add(todo, function (json) {
            $("#todo-list").prepend(TODO.build({target: todo, key: json.insertId}));
            setTimeout(function () {
                $("li").removeClass("appending");
            }, 0);
            TODO.target.value = ""; 
        });
    }
}

TODO.init();

