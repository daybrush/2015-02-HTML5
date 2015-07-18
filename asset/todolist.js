$(document).ready(function(){
  Todo.init();
});

var Todo = {
  destURL : "http://128.199.76.9:8002/minhyeok4dev/",

  init : function(){
    this.onKeyEvent();
    this.onClickEvent();

    this.loadTODOs();
  },

  onKeyEvent : function(){
    $('#new-todo').keydown(function(e){
      if (e.which == 13){
        this.saveTODO($('#new-todo').val());
      }
    }.bind(this));
  },

  onClickEvent : function(){
    $('#todo-list').on('click', 'input.toggle', function(e){
      var $targetTODO = $(e.target).closest('li');
      
      this.completeTODO($targetTODO, !$targetTODO.hasClass('completed'));
    }.bind(this));

    $('#todo-list').on('click', 'button.destroy', function(e){
      var $targetTODO = $(e.target).closest('li');

      this.deleteTODO($targetTODO);
    }.bind(this));
  },

  newTODOWithData : function(text, id, isCompleted){
    var $template = $(Handlebars.compile($('#new-todo-template').html())({body: text}));

    $template.data('id', id);
    if (isCompleted){
      $template.addClass('completed');
      $template.find('.toggle').attr('checked', true);
    }

    return $template;
  },

  saveTODO : function(text){
    $.ajax({
      method: "PUT",
      url: this.destURL,
      data: {todo: text}
    }).done(function(res){
      $('#todo-list').append(this.newTODOWithData(text, res.insertId, false));
      $('#new-todo').val("");
    }.bind(this));
  },

  loadTODOs : function(){
    $.get(this.destURL)
      .done(function(res){
        var res = res.reverse();

        for (var i=0;i<res.length;i++){
          var loadedTODO = this.newTODOWithData(res[i].todo, res[i].id, !!res[i].completed);
          $('#todo-list').append(loadedTODO);
        }
      }.bind(this));
  },

  completeTODO : function($targetTODO, isCompleted){
    $.post(this.destURL + $targetTODO.data('id'), {completed: +isCompleted})
      .done(function(res){
        $targetTODO.toggleClass('completed');
      });
  },

  deleteTODO : function($targetTODO){
    $.ajax({
      method: "DELETE",
      url: this.destURL + $targetTODO.data('id')
    }).done(function(res){
      $targetTODO.css('animation', 'fadeOut 500ms');
      $targetTODO.on('webkitAnimationEnd animationend',function(){
          $targetTODO.remove();
      });      
    });
  }
}