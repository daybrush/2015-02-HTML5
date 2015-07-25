var TODOSync = {
  URL : "http://128.199.76.9:8002/jsfumato",
  
  get : function(){
    
  },
  add : function(todo, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.URL, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(e){
      callback(xhr.responseText);
    });
    xhr.send("todo=" + todo);
  },
  complete : function(){
    
  },
  delete : function(){
    
  }
}

var TODO = {
  ENTER_KEYCODE : 13,
  
  init : function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
      $("#new-todo").keydown(this.add.bind(this));
    }.bind(this));
  },
  
  add : function(e) {
    "use strict";
    var template = $("#todo-template").html();
    
    if (e.keyCode === this.ENTER_KEYCODE) {
      
      var todo = $("#new-todo").val();
      TODOSync.add(todo, function(json){
        console.log(json);
        var todoCompile = Handlebars.compile(template);

        var inputTodo = { newtodo : [] };

        inputTodo.newtodo.push({ content : todo });
        var todolist = todoCompile(inputTodo);

        $("#todo-list").prepend(todolist);
        $("#new-todo").val("");
      }.bind(this));
    }
  },
  
  completed :
    $("body").on("click", ".toggle", function(e) {
      var input = $(e.currentTarget);
      var li = input.closest("li");

      li.toggleClass("completed");
    }),

  delete :
    $("body").on("click", ".destroy", function(e) {
      var button = $(e.currentTarget);
      var li = button.closest("li");
      
      li.addClass("delete");
      
      li.on("transitionend", function(){
        li.remove();
      })
    })
}

TODO.init();
