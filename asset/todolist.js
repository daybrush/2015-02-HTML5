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
};
TODO.init = function () {
  TODO.item = $('#new-item-script');
  TODO.board = $('#todo-list');
  TODO.template = Handlebars.compile(TODO.item.html());

  TODO.get();
};
TODO.addItem = function (sContents) {
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
};
TODO.get = function () {
  TODOsync.get(function (data) {
    data.sort(function (a, b) {
      if(a.id < b.id)
        return -1;
      else if(a.id > b.id)
        return 1;
      else
        return 0;
    });
    TODO.board.append(TODO.template({item:data}));
  })
};
TODO.removeItem = function ($cachedLi) {
  if (!$cachedLi) return;
  var itemId = $cachedLi.data('id');

  TODOsync.remove(itemId, function () {
    $cachedLi.css({
      'opacity': 0,
      'maxHeight': 0,
      'overflow': 'hidden'
    });
    var removeItem = function (event) {
      if (event.eventPhase !== 2) {
        // li 자신이 아니라 button 등 자식들에 의해 bubbling 받은 거면 무시.
        ////////// 더 좋은방식은 없나 애초에 자기자신 이벤트만 받는거 같은?
        return;
      }
      $cachedLi.off('webkitTransitionEnd transitionend', removeItem);
      $cachedLi.remove();
    };
    $cachedLi.on('webkitTransitionEnd transitionend', removeItem);
  });
};
TODO.completeItem = function ($item, $event) {
  var itemId = $item.closest('li').data('id');
  var checked = $item.is(':checked');
  
  TODOsync.complete(itemId, checked, function () {
    $item.prop("checked", checked);
    $item.closest('li').toggleClass('completed', checked);
  });

  $event.preventDefault();
};

$(document).ready(function () {
  TODO.init();
  $('#new-todo').on('keypress', function(event) {
    var ENTER_KEYCODE = 13;
    if(event.which === ENTER_KEYCODE) {
      var sContents = $('#new-todo').val();
      if(!sContents) return;
      TODO.addItem(sContents);
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function(e) {
    TODO.completeItem($(this), e);
  });
  $('#todo-list').on('click', 'li:not(.deleting) button.destroy', function() {
    TODO.removeItem($(this).closest('li'));
  });
});