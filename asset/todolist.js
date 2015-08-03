var TODOOnline = {
    URL : "http://128.199.76.9:8002/nickname",
    xhrManager:function (param, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(param.reqMethod, param.url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        if(callback){
            xhr.addEventListener("load", function (e) {
                callback(JSON.parse(xhr.responseText));
            });
        }
        xhr.send(param.reqBody);
    },
    get : function (callback) {
        var param = {reqMethod: "GET", url: TODOOnline.URL};
        TODOOnline.xhrManager(param, callback);
    },
    add : function (data, callback) {
        var param = {reqMethod: "PUT", url: TODOOnline.URL, reqBody : "todo="+data.todo};
        TODOOnline.xhrManager(param, callback);
    },
    completed : function (data, callback) {
        var param = {reqMethod: "POST", url : TODOOnline.URL+"/"+data.key, reqBody : "completed="+data.completed};
        TODOOnline.xhrManager(param, callback);
    },
    remove : function(data, callback) {
        var param = {reqMethod: "DELETE", url : TODOOnline.URL+"/"+data.key};
        TODOOnline.xhrManager(param, callback);
    },
    sync : function () {
        // from offline to line
        $.each(localStorage, function (key, value) {
            var item = JSON.parse(value);
            if(item.method){
                if(item.method === "add"){
                    debugger;
                    TODOOnline.add({"todo":item.todo}, function (json) {
                        if(item.completed){
                            item.key = json.insertId;
                            TODOOnline.completed(item);
                            debugger;
                        }
                    });
                }else{
                    TODOOnline[item.method](item);
                }
            }
        });
        localStorage.clear();
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
    add : function(data,callback) {
        TODOOffline.check();
        var item = {"method": "add", "todo": data.todo, "key": TODOOffline.count,"only-local": true};
        localStorage.setItem(item.key, JSON.stringify(item));
        callback({insertId:item.key});
        TODOOffline.count++;
    },
    completed : function(data,callback) {
        TODOOffline.check();
        var item = JSON.parse(localStorage.getItem(data.key));
        if(!item.method){
            item.method = "completed";            
        }
        item.completed = data.completed;
        debugger;
        localStorage.setItem(data.key, JSON.stringify(item));
        callback();
    },
    remove : function(data,callback) {
        TODOOffline.check();
        var item = JSON.parse(localStorage.getItem(data.key));
        if(item["only-local"]){
            localStorage.removeItem(data.key);
        }else{
            item.method = "remove";
            localStorage.setItem(data.key, JSON.stringify(item));
        }
        callback();
        // debugger;
    },
    sync : function () {
        // from online to offline
        var list = $("#todo-list li");
        $.each(list, function (index, value) {
            var key = value.dataset.key;
            debugger;
            localStorage.setItem(key, JSON.stringify({"method": null, "key": key}));
        })
    }
}



var TODO = {
    ENTER_KEYCODE : 13,
    oInput : null,
    oList : null,
    oHeader : null,
    oFilter : null,
    DataManager : null,
    ShowState : "index.html",
    States : {
        "index.html" : {index: 0, name: null},
        "active" : {index: 1, name:"all-active"},
        "completed" : {index: 2, name:"all-completed"}
    },
    init: function () {
        document.addEventListener("DOMContentLoaded", function() {
            this.oInput = document.getElementById("new-todo");
            this.oList = document.getElementById("todo-list");
            this.oHeader = document.getElementById("header");
            this.oFilter = document.getElementById("filters");

            this.oInput.addEventListener("keydown",this.add.bind(this));
            this.oList.addEventListener("click", this.completed.bind(this));
            this.oList.addEventListener("click", this.remove.bind(this));

            this.oFilter.addEventListener("click", this.changeStateFilter.bind(this));
            window.addEventListener("popstate", this.changeUrlFilter.bind(this));

            window.addEventListener("online", this.onoffLineListener.bind(this));
            window.addEventListener("offline", this.onoffLineListener.bind(this));
            this.oHeader.classList[navigator.onLine?"remove":"add"]("offline");
            this.DataManager = navigator.onLine? TODOOnline : TODOOffline;


            this.get();
        }.bind(this));
    },
    changeStateFilter : function (e) {
        if(e.target.tagName === 'A'){
            var href = e.target.getAttribute("href");
            this.selectView(href, this.saveState);
            e.preventDefault();
        }
    },
    selectView : function (nowState, callback) {
        var navigatorList = this.oFilter.getElementsByTagName('A');
        var recent = this.States[this.ShowState];
        var newone = this.States[nowState];

        navigatorList[recent.index].classList.remove("selected");
        navigatorList[newone.index].classList.add("selected");
        this.oList.classList.remove(recent.name);
        this.oList.classList.add(newone.name);
        
        TODO.ShowState = nowState;

        if(callback){
            callback(nowState);
        }
    },
    saveState : function (nowState) {
        history.pushState({"href": nowState}, null, null);
    },
    changeUrlFilter : function (e) {
        if (e.state) {
            var href = e.state.href;
            this.selectView(href);
        }else{
            this.selectView("index.html");
        }
    },
    onoffLineListener : function () {
        this.oHeader.classList[navigator.onLine?"remove":"add"]("offline");
        this.DataManager = navigator.onLine? TODOOnline : TODOOffline;
        this.DataManager.sync();
        debugger;
    },
    build: function(context) {
    	var html = $("#entry-template").html();
    	var template = Handlebars.compile(html);
    	this.build = template;
        return template(context);
    },
    get : function () {
        this.DataManager.get(function (json) {
            json.forEach(function (obj) {
                var sTodo = TODO.build({target: obj.todo, key: obj.id});
                TODO.oList.insertAdjacentHTML("beforeend", sTodo);
            });
            this.playAnimation();
        }.bind(this))
    },
    completed : function (e) {
        if(e.target.classList.contains("toggle")){
            var li = e.target.closest("li");
            var data = { "key" : li.dataset.key, "completed" : e.target.checked?"1":"0" };
            this.DataManager.completed(data, function () {
                li.classList[e.target.checked?"add":"remove"]("completed");
            })
        };
    },
    remove : function (e) {
        if(e.target.classList.contains("destroy")){
            var li = e.target.closest("li");
            if(li.classList.contains("deleting")){
                return;
            }
            var data = {"key" : li.dataset.key};
            var callback = function () {
                this.DataManager.remove(data, function () {
                    this.oList.removeChild(li);
                }.bind(this));
                li.removeEventListener("transitionend", callback);
            }
            li.addEventListener("transitionend", callback.bind(this));
            li.classList.add("deleting");
        }
    },
    add : function (e) {
        if (e.keyCode === this.ENTER_KEYCODE) {
            var data = {todo: this.oInput.value};
            this.DataManager.add(data, function (json) {
                this.oList.insertAdjacentHTML('afterbegin', this.build({target: data.todo, key: json.insertId}));
                this.playAnimation();
                this.oInput.value = "";
            }.bind(this));
        }
    },
    playAnimation : function () {
        setTimeout(function () {
            var list = TODO.oList.querySelectorAll("li.appending");
            for(var i=0; i<list.length; i++){
                list[i].classList.remove("appending");
            }
        }, 0);
    }
}

TODO.init();

