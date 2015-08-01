var TODOSync = {
  URL : "http://128.199.76.9:8002/jsfumato/",
  
  init : function(){
    window.addEventListener("online", this.onofflineListener);
    window.addEventListener("offline", this.onofflineListener);
  },
  
  onofflineListener : function(){
    if(navigator.onLine){
      $("#header").removeClass("offline");
//      서버로 Sync
      
    }else{
      $("#header").addClass("offline");
    }
  },
  
  add : function(todo, callback){
    
    if(navigator.onLine){
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', this.URL, true);
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      xhr.addEventListener("load", function(e){
        callback(JSON.parse(xhr.responseText));
      });
      xhr.send("todo=" + todo);
    }else{
//      data를 클라이언트에 저장 -> localStorage, indexedDB, (요즘은 안쓰는)websql
    }
  },
  
  get : function(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.URL, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(JSON.parse(xhr.responseText));
    });
    xhr.send();    
  },
    
  completed : function(param, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.URL+param.key, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(JSON.parse(xhr.responseText));
    });
    xhr.send("completed=" + param.completed);    
  },
  
  delete : function(param, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', this.URL+param.key, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(JSON.parse(xhr.responseText));
    });
    xhr.send("delete=" + param.key); 
  }
}

var TODO = {
  ENTER_KEYCODE : 13,
  selectedIndex: 0,
  
  init : function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
      $("#new-todo").keydown(this.add.bind(this));
      this.get();
      
      $("body").on("click", ".toggle", this.completed);
      $("body").on("click", ".destroy", this.delete);
      $("#filters").on("click", ".btn", this.changeStateFilter.bind(this));
      
      window.addEventListener("popstate",this.changeURLFilter.bind(this));
      
    }.bind(this));
  },
  
  changeURLFilter : function(e){
    console.log(e.state.method);
    if(e.state){
      var method = e.state.method;
      this[method+"View"]();
//      
//      if(method == "all"){
//        this.allView();
//      }else if(method == "active"){
//        this.activeView();
//      }else if(method == "completed"){
//        this.completedView();
//      }
//            
    }
  },
  
  changeStateFilter : function(e){
    var target = $(e.target);
    var tagName = target.prop("tagName").toLowerCase();
    if(tagName == "a"){
      var href = target.attr("href");
      console.log(href);
      
      if(href == "todo.html"){
        this.allView();
        history.pushState({"method":"all"}, null, "todo.html");
        
      }else if(href == "active"){
        this.activeView();
        history.pushState({"method":"active"}, null, "active");
        
      }else if(href == "completed"){
        this.completedView();
        history.pushState({"method":"completed"}, null, "completed");
      }
    }
    e.preventDefault();
  },
  
  allView : function(){
    $("#todo-list").removeClass();
    this.selectNavigator(0);
  },
  
  activeView : function(){
    $("#todo-list").removeClass();
    $("#todo-list").addClass("all-active");
    this.selectNavigator(1);
  },
  
  completedView : function(){
    $("#todo-list").removeClass();
    $("#todo-list").addClass("all-completed");
    this.selectNavigator(2);
  },
  
  selectNavigator : function(index){
    var navigatorList = $("#filters a");
    $(navigatorList[this.selectedIndex]).removeClass();
    $(navigatorList[index]).addClass("selected");
    this.selectedIndex = index;
  },
  
  build : function(param){
    var template = $("#todo-template").html();
    var todoCompile = Handlebars.compile(template);
    var inputTodo = { newtodo : [] };
    inputTodo.newtodo = param;
  
    var todolist = todoCompile(inputTodo);
    return todolist;
  },
  
  get : function(){
    TODOSync.get(function(json){
      var contextArray = [];
      
      for(var i=0; i<json.length; i++){
        var isCompleted = json[i].completed === 1?"completed" : '';
        context = { 
          key : json[i].id, 
          isCompleted : isCompleted,
          isChecked : json[i].completed,
          content : json[i].todo
        };
        contextArray.push(context);
      }
      $("#todo-list").append(this.build(contextArray));
    }.bind(this))
  },
    
  add : function(e) {    
    if (e.keyCode === this.ENTER_KEYCODE) {
      var todo = $("#new-todo").val();
      
      TODOSync.add(todo, function(json){
        var context = [{ key : json.insertId, isCompleted : '', isChecked : false, content : todo }]
        $("#todo-list").prepend(this.build(context));
        $("#new-todo").val("");
      }.bind(this));
    }
  },
  
  completed : function(e) {
    
    var input = $(e.currentTarget);
    var li = input.closest("li");  
    var completed = input.is(":checked")? 1 : 0;
    
    TODOSync.completed({
      "key" : li.data("key"),
      "completed" : completed
    }, function(){
      li.toggleClass("completed");
    })
  },
    
  delete : function(e) {  
    var button = $(e.currentTarget);
    var li = button.closest("li");

    TODOSync.delete({
      "key" : li.data("key")
    }, function(){
      li.addClass("delete");
      li.on("transitionend", function(){
        li.remove();
      })
    })
  }
}

TODO.init();
TODOSync.init();
