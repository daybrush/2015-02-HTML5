$(document).ready(function(){
  Todo.init();
});

var Todo = {
  init : function(){
    this.onKeyEvent();
    this.onClickEvent();
  },

  onKeyEvent : function(){
    $('#new-todo').keydown(function(e){
      if (e.which == 13){
        $('#todo-list').append(this.newTODO($('#new-todo').val()));
        $('#new-todo').val("");
      }
    }.bind(this));
  },

  onClickEvent : function(){
    $('#todo-list').on('click', function(e){
      var target = $(e.target);

      if (target.is('input.toggle')){
        target.parents('li').toggleClass('completed');
      } else if (target.is('button.destroy')){
        target.parents('li').css('-webkit-animation', 'fadeOut 500ms');
        target.parents('li').bind('webkitAnimationEnd',function(){
            target.parents('li').remove();
        });
      }
    });
  },

  newTODO : function(text){
    var template = Handlebars.compile($('#new-todo-template').html());

    return template({body: text});
  }
}