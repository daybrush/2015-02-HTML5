TODOsync = {
  URL : "http://128.199.76.9:8002",
  nickname : "helloheesu",
  ajax : function (options) {
    var itemId = options['id'] || "";
    var fSuccess = options['fSuccess'] || function () {};
    var fFail = options['fFail'] || function () {};

    $.ajax({
      url: TODOsync.URL+'/'+TODOsync.nickname+'/'+itemId,
      method: options['method'],
      data: options['data']
    }).done(fSuccess).fail(fFail);
  },
  get : function (callback) {
    TODOsync.ajax({
      method: "GET",
      fSuccess: callback
    });
  },
  add : function (sContents, callback) {
    TODOsync.ajax({
      method: "PUT",
      data: "todo="+sContents,
      fSuccess: callback
    });
  },
  complete : function (itemId, checked, callback) {
    if(typeof(checked) === "undefined") {console.error("checked not defined"); return;}
    checked = (checked) ? 1 : 0;

    TODOsync.ajax({
      method: "POST",
      data: "completed="+checked,
      id: itemId,
      fSuccess: callback
    });
  },
  remove : function (itemId, callback) {
    TODOsync.ajax({
      method: "DELETE",
      id: itemId,
      fSuccess: callback
    });
  }
};

TODO = {
  item : null,
  board : null,
  template : function(){},
  init : function () {
    TODO.item = $('#new-item-script');
    TODO.board = $('#todo-list');
    TODO.template = Handlebars.compile(TODO.item.html());

    TODO.bindEvent();
    TODO.get();
  },
  add : function (sContents) {
    TODOsync.add(sContents, function (data) {
      var elNewItem = $(TODO.template({'item':{
        'todo':sContents,
        'id':data.insertId
      }}));
      TODO.board.append(elNewItem);
      elNewItem.css('opacity', 0);
      elNewItem.css('opacity');
      elNewItem.css('opacity', 1);
    });
  },
  get : function () {
    TODOsync.get(function (data) {
      data.sort(function (a, b) {
        if(a.id < b.id) {return -1;}
        else if(a.id > b.id) {return 1;}
        else {return 0;}
      });
      TODO.board.append(TODO.template({item:data}));
    })
  },
  remove : function ($cachedLi) {
    if (!$cachedLi) {return;}
    var itemId = $cachedLi.data('id');

    TODOsync.remove(itemId, function () {
      $cachedLi.css({
        'opacity': 0,
        'max-height': 0,
        'overflow': 'hidden'
      });
      var remove = function (event) {
        if (event.eventPhase !== 2) {
          return;
        }
        $cachedLi.remove();
      };
      $cachedLi.on('webkitTransitionEnd transitionend', remove);
    });
  },
  complete : function ($item, $event) {
    var itemId = $item.closest('li').data('id');
    var checked = $item.is(':checked');
    
    TODOsync.complete(itemId, checked, function () {
      $item.prop("checked", checked);
      $item.closest('li').toggleClass('completed', checked);
    });

    $event.preventDefault();
  },
  bindEvent : function () {
    $('#new-todo').on('keypress', function(e) {
      var ENTER_KEYCODE = 13;
      if(e.which !== ENTER_KEYCODE) {return;}
      var sContents = $('#new-todo').val();
      if(!sContents) {return;}
      TODO.add(sContents);
      $('#new-todo').val('');
    });
    $('#todo-list').on('click', 'input.toggle', function(e) {
      TODO.complete($(this), e);
    });
    $('#todo-list').on('click', 'li:not(.deleting) button.destroy', function() {
      TODO.remove($(this).closest('li'));
    });
  }
};


$(document).ready(function () {
  TODO.init();
});