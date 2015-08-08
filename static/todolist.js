$(document).ready(function(){
  Todo.init();
});

var Todo = {
  syncer : navigator.onLine?OnlineSyncer:OfflineSyncer,

  init : function(){
    this.onKeyEvent();
    this.onClickEvent();
    this.onNetworkEvent();
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

  onNetworkEvent : function(){
    $(window).on('offline online', function(){
      if (navigator.onLine)
        this.syncer.sync();

      this.syncer = navigator.onLine?OnlineSyncer:OfflineSyncer;
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
    this.syncer.save(text, function(res){
      $('#todo-list').append(this.newTODOWithData(text, res.insertId, false));
      $('#new-todo').val("");
    }.bind(this));
  },

  loadTODOs : function(){
    this.syncer.index(function(res){
      var res = res.reverse();

      for (var i=0;i<res.length;i++){
        var loadedTODO = this.newTODOWithData(res[i].todo, res[i].id, !!res[i].completed);
        $('#todo-list').append(loadedTODO);
      }
    }.bind(this));
  },

  completeTODO : function($targetTODO, isCompleted){
    this.syncer.complete($targetTODO.data('id'), isCompleted, function(){
      $targetTODO.toggleClass('completed');
    });
  },

  deleteTODO : function($targetTODO){
    this.syncer.delete($targetTODO.data('id'), function(){
      $targetTODO.css('animation', 'fadeOut 500ms');
      $targetTODO.on('webkitAnimationEnd animationend',function(){
          $targetTODO.remove();
      });      
    });
  }
}