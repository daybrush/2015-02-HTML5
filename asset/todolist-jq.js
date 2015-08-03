var TODOOnline = {
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
    },
    sync : function () {
        // from offline to line
        $.each(localStorage, function (key, value) {
            var item = JSON.parse(value);
            if(item.method){
                if(item.method === "add"){
                    TODOOnline.add(item.todo, function (json) {
                        if(item.completed){
                            item.key = json.insertId;
                            TODOOnline.completed(item);
                        }
                    });
                }else{
                    TODOOnline[item.method](item);
                }
            }
        });
        localStorage.clear();
        // 위에 비동기로 처리되고 있는 로직이 완료 되면 refresh 가 하고 싶어요
        var temp = setTimeout(function () {
            location.reload();
        }, 1000);
    }
}

var TODOOffline = {
    count : 0,
    check: function () {
        if(!Storage){
            alert("sorry, your computer is not supported db");
        }
    },
    get : function(callback) {
        // console.log(there is off line);
    },
    add : function(todo,callback) {
        TODOOffline.check();
        var item = {"method": "add", "todo": todo, "key": TODOOffline.count,"only-local": true};
        localStorage.setItem(item.key, JSON.stringify(item));
        callback({insertId:item.key});
        TODOOffline.count++;
    },
    completed : function(param,callback) {
        TODOOffline.check();
        var item = JSON.parse(localStorage.getItem(param.key));
        if(!item.method){
            item.method = "completed";            
        }
        item.completed = param.completed;
        localStorage.setItem(param.key, JSON.stringify(item));
        callback();
    },
    remove : function(param,callback) {
        TODOOffline.check();
        var item = JSON.parse(localStorage.getItem(param.key));
        if(item["only-local"]){
            localStorage.removeItem(param.key);
        }else{
            item.method = "remove";
            localStorage.setItem(param.key, JSON.stringify(item));
        }
        callback();
        // debugger;
    },
    sync : function () {
        // from online to offline
        var list = $("#todo-list li");
        $.each(list, function (index, value) {
            var key = value.dataset.key;
            localStorage.setItem(key, JSON.stringify({"method": null, "key": key}));
        })
    }
}

var TODOSync = {
    DataManager : null,
    init : function () {
        window.addEventListener("online", this.onoffLineListener.bind(this));
        window.addEventListener("offline", this.onoffLineListener.bind(this));
        document.getElementById('header').classList[navigator.onLine?"remove":"add"]("offline");
        this.DataManager = navigator.onLine? TODOOnline : TODOOffline;

    },
    onoffLineListener : function () {
        document.getElementById('header').classList[navigator.onLine?"remove":"add"]("offline");
        this.DataManager = navigator.onLine? TODOOnline : TODOOffline;
        this.DataManager.sync();
    }
}

var TODO = {
    oInput: null,
    oList : null,
    ENTER_KEYCODE : 13,
    ShowState : "index.html",
    States : {
        "index.html" : {index: 0, name:""},
        "active" : {index: 1, name:"all-active"},
        "completed" : {index: 2, name:"all-completed"}
    },
    init: function () {
        this.oInput = $("#new-todo").eq(0);
        this.oList = $("#todo-list").eq(0);

        this.oInput.on("keydown", this.add.bind(this));
        this.oList.on("click", ".toggle", this.completed);
        this.oList.on("click", ".destroy", this.remove);
        this.get();
        $("#filters").on("click", "a", this.changeStateFilter);
        window.addEventListener("popstate", this.changeUrlFilter.bind(this));
    },
    changeUrlFilter : function (e) {
        if (e.state) {
            var href = e.state.href;
            this.selectView(href);
        }else{
            this.selectView("index.html");
        }
    },
    changeStateFilter : function (e) {
        var href = this.getAttribute("href");
        TODO.selectView(href, TODO.saveState);
        // callback 동작 않됌 ㅠㅠ
        // TODO.selectView(href, history.pushState);
        e.preventDefault();
    },
    selectView : function (nowState, callback) {
        var navigatorList = $("#filters a");
        var recent = this.States[this.ShowState];
        var newone = this.States[nowState];

        $(navigatorList.get(recent.index)).removeClass("selected");
        $(navigatorList.get(newone.index)).addClass("selected");
        this.oList.removeClass(recent.name);
        this.oList.addClass(newone.name);
        TODO.ShowState = nowState;

        if(callback){
            callback(nowState);
        }
    },
    saveState : function (nowState) {
        history.pushState({"href": nowState}, null, null);
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
        TODOSync.DataManager.get(function (json) {
            $("#todo-list").append(json.map(function (obj) {
                return TODO.build({target: obj.todo, key: obj.id, completed: obj.completed});
            }).join(''));
            $("li").get(0).offsetHeight;
            $("li").removeClass("appending");
        })
    },
    completed : function (e) {
        var li = $(e.currentTarget).closest("li");
        var checked = e.currentTarget.checked?"1":"0";

        TODOSync.DataManager.completed({
            "key" : li.data("key"),
            "completed" : checked
        }, function () {
            li.toggleClass("completed");
        });
    },
    remove : function (e) {
        var li = $(e.currentTarget).closest("li")
        li.one("transitionend", function () {
            TODOSync.DataManager.remove({
                "key": li.data("key")
            }, function () {
                li.remove();
            })
        });
        li.addClass("deleting");
    },
    add : function (e) {
        if (e.keyCode !== this.ENTER_KEYCODE) {return}
        var todo = this.oInput.val();
        TODOSync.DataManager.add(todo, function (json) {
            $("#todo-list").prepend(TODO.build({target: todo, key: json.insertId}));
            $("li").get(0).offsetHeight;
            $("li").removeClass("appending");
            TODO.oInput.val('')
        });
    }
}

$(function () {
    TODOSync.init();
    TODO.init();
});

