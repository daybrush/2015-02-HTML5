var TODOSync = {
  URL : "http://128.199.76.9:8002/jsfumato/",
  
  get : function(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.URL, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(JSON.parse(xhr.responseText));
    });
    xhr.send();    
  },
  
  add : function(todo, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.URL, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(JSON.parse(xhr.responseText));
    });
    xhr.send("todo=" + todo);
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
  
  init : function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
      this.get.bind(this);
      $("#new-todo").keydown(this.add.bind(this));
    }.bind(this));
  },
  
  get : function(){
    TODOSync.get(function(json){
      console.log(json);
    })
  },
    
  add : function(e) {
    "use strict";
    var template = $("#todo-template").html();
    
    if (e.keyCode === this.ENTER_KEYCODE) {
      var todo = $("#new-todo").val();
      
      TODOSync.add(todo, function(json){
        var todoCompile = Handlebars.compile(template);

        var inputTodo = { newtodo : [] };
        inputTodo.newtodo.push({ content : todo });
        var todolist = todoCompile(inputTodo);
        
        $("#todo-list").prepend(todolist);
        $("#todo-list li").first().attr("data-key", json.insertId);
//        .data()가 먹히지 않습니다;;
        
        $("#new-todo").val("");
      }.bind(this));
    }
  },
  
  completed :
    $("body").on("click", ".toggle", function(e) {
      var input = $(e.currentTarget);
      var li = input.closest("li");
      var completed = input.is(":checked")? 1 : 0;
      
      TODOSync.completed({
        "key" : li.attr("data-key"),
        "completed" : completed
      }, function(){
        li.toggleClass("completed");
      })
    }),

  delete :
    $("body").on("click", ".destroy", function(e) {
      var button = $(e.currentTarget);
      var li = button.closest("li");
      
      TODOSync.delete({
        "key" : li.attr("data-key")
      }, function(){
        li.addClass("delete");
        li.on("transitionend", function(){
          li.remove();
      })
    })
  })
}

TODO.get();
TODO.init();
