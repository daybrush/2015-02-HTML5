var logStyle = "font-size: 12px; color: red; font-weight: 800;";

var TODOLocalStorage = {
  
  local : window.localStorage,
  localContextArray : [],
  
//  init : function() {
//    var contextArray = [];
//
//    for(key in this.local){
//      var context = JSON.parse(this.local.getItem(key));
//      contextArray.push(context);
//    }
//    
//    return contextArray;
//  },
  
  clearLocal : function(){
    console.log("%c Clear local storage :", logStyle);
    this.local.clear();
    console.log(this.local);
    this.localContextArray = [];
  },
    
  addLocal : function(context) {
    console.log("%cadd to localStorage", logStyle);

    var index = context.id;
    console.log(context);
    this.local.setItem(index, JSON.stringify(context));
  },
  
  completedLocal : function(param) {
    console.log("%ccomplete adjust to localStorage", logStyle);
    
    var completedTodo = JSON.parse(this.local.getItem(param.key));
    completedTodo.isCompleted = param.completed;
    completedTodo.completed = (param.completed === 1)?true:false;
    this.local.setItem(param.key, JSON.stringify(completedTodo));
    
  },
  
  deleteLocal : function(param) {
    console.log("%cremove adjust to localStorage", logStyle);
    this.local.removeItem(param.key);
  },
  
  getLocal : function() {
    
    var contextArray = [];
    
    for( key in this.local ){
      var context = JSON.parse(this.local.getItem(key));
      contextArray.push(context);
    }
    return contextArray;
  }
}


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
      
//      오프라인일 때!!!!
    }else{
//      data를 localStorage에 저장
      
      var localresponseText = { insertId : "local:"+TODOLocalStorage.local.length };
      console.log(localresponseText);
      callback(localresponseText);
      console.log(TODOLocalStorage.local);

    }
  },
  
  get : function(callback){
    
    if(navigator.onLine){

      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.URL, true);
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      xhr.addEventListener("load", function(e){
        callback(JSON.parse(xhr.responseText));
      });
      xhr.send();
      
    }else{
      
      var localContextArray = TODOLocalStorage.getLocal();
      console.log("%coffline :: Get List from LocalStorage", logStyle);
      callback(localContextArray);
      
    }
  },
    
  completed : function(param, callback){
    
    if(navigator.onLine){
    
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.URL+param.key, true);
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      xhr.addEventListener("load", function(e){
        callback(JSON.parse(xhr.responseText));
      });
      xhr.send("completed=" + param.completed);
    
    }else{
      callback();
    }
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
    if(e.state){
      var method = e.state.method;
      this[method+"View"]();        
    }
  },
  
  changeStateFilter : function(e){
    var target = $(e.target);
    var tagName = target.prop("tagName").toLowerCase();
    if(tagName == "a"){
      var href = target.attr("href");
      
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
        var isCompleted = (json[i].completed === true)?"completed" : '';
        context = { 
          id : json[i].id, 
          isCompleted : isCompleted,
          completed : json[i].completed,
          todo : json[i].todo
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
        var context = { id : json.insertId, isCompleted : '', completed : false, todo : todo };
        TODOLocalStorage.addLocal(context);
        var context_fix = [context];
        $("#todo-list").prepend(this.build(context));
        $("#new-todo").val("");
      }.bind(this));
    }
  },
  
  completed : function(e) {
    
    var input = $(e.currentTarget);
    var li = input.closest("li");  
    var completed = input.is(":checked")? 1 : 0;
    
    var param = {
      "key" : li.data("key"),
      "completed" : completed
    }
    
    TODOSync.completed(param, function(){
      li.toggleClass("completed");
      TODOLocalStorage.completedLocal(param);
    })
  },
    
  delete : function(e) {  
    var button = $(e.currentTarget);
    var li = button.closest("li");
    var param = {
      "key" : li.data("key")
    }
    
    TODOSync.delete(param, function(){
      li.addClass("delete");
      li.on("transitionend", function(){
        li.remove();
      })
      TODOLocalStorage.deleteLocal(param);
    })
  }
}

//TODOLocalStorage.clearLocal();
console.log(TODOLocalStorage.local);
TODO.init();
TODOSync.init();