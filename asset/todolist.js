$(document).ready(function(){
  todos.init();
});

var todos = {
  init : function(){
    this.onKeyEvent();
  },

  onKeyEvent : function(){
    $('#new-todo').keydown(function(e){
      if (e.which == 13){
        $('#todo-list').append(this.newTODO($('#new-todo').val()));
        $('#new-todo').val("");
      }
    }.bind(this));
  },

  newTODO : function(text){
    var template = Handlebars.compile($('#new-todo-template').html());

    return template({body: text});
  }
}