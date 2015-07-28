var TODOSync = {
    URL : "http://128.199.76.9:8002/nickname",
    init : function () {
        window.addEventListener("online", this.onoffLineListener);
        window.addEventListener("offline", this.onoffLineListener);
    },
    onoffLineListener : function () {
        console.log("hello");
        document.getElementById('header').classList[navigator.onLine?"remove":"add"]("offline");
        if(navigator.onLine){
            //서버로 Sync 맞추기
        }
    },
    get : function(callback) {
        if (navigator.onLine) {
            $.ajax({method: "GET", url: this.URL}).done(callback);
        }else{
            //local db
        }
    },
    add : function(todo,callback) {
        if (navigator.onLine) {
            $.ajax({method: "PUT", url: this.URL, data: "todo="+todo}).done(callback);
        };
    },
    completed : function(param,callback) {
        if (navigator.onLine) {
            $.ajax({method: "POST", url: this.URL+'/'+param.key, data:"completed="+param.completed}).done(callback);
        };
    },
    remove : function(param,callback) {
        if (navigator.onLine) {
            $.ajax({method: "DELETE", url: this.URL+'/'+param.key}).done(callback);
        };
    }
}

var TODO = {
    oInput: $("#new-todo"),
    oList : $("#todo-list"),
    ENTER_KEYCODE : 13,
    ShowState : {index:0, className:""},
    init: function () {
        this.oInput.on("keydown", this.add.bind(this));
        $("#todo-list").on("click", ".toggle", this.completed);
        $("#todo-list").on("click", ".destroy", this.remove);
        this.get();
        $("#filters").on("click", "a", this.changeStateFilter);
        window.addEventListener("popState", this.changeUrlFilter);
    },
    changeUrlFilter : function () {
        
    }
    changeStateFilter : function (e) {
        var href = this.getAttribute("href");
        // console.log(href)
        e.preventDefault();
        if(href === "index.html"){
            TODO.selectView({
                index:0, className:"", 
                method: "all", url: href});
        }else if(href === "active"){
            TODO.selectView({
                index:1, className:"all-active", 
                method:"active", url: href});
        }else if(href === "completed"){
            TODO.selectView({
                index:2, className:"all-completed", 
                method:"completed", url: href});
        }
    },
    selectView : function (nowState) {
        var navigatorList = $("#filters a");
        $(navigatorList.get(this.ShowState.index)).removeClass("selected");
        $("#todo-list").removeClass(this.ShowState.className);

        $(navigatorList.get(nowState.index)).addClass("selected");
        $("#todo-list").addClass(nowState.className);
        this.ShowState = nowState;
        // 히스토리 추가
        // 뒤로가기 이벤트 변경
        console.log(nowState);
        history.pushState(nowState.method, null, nowState.href);
    },
    selectedNavigator : function (index) {
        var navigatorList = $("#filters a");
        $(navigatorList.get(this.selectedIndex)).removeClass("selected");
        $(navigatorList.get(index)).addClass("selected");
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
    TODOSync.init();
});

