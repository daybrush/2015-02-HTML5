TODOsync = {
  get : function () {
    $.ajax({
      url: "http://128.199.76.9:8002/helloheesu"
    }).done(function (data) {
      TODO.addItems(data);
    });
  },
  add : function (sContents) {
    $.ajax({
      url: "http://128.199.76.9:8002/helloheesu",
      method: "PUT",
      data: "todo="+sContents
    }).done(function (e) {
      TODO.addItem(sContents);
    });
  },
  complete : function ($item, $event) {
    var itemId = $item.closest('li').data('id');
    var checked = ($item.is(':checked')) ? 1 : 0;

    $.ajax({
      url: "http://128.199.76.9:8002/helloheesu/"+itemId,
      method: "POST",
      data: "completed="+checked
    }).done(function (data) {
      $item.prop("checked", checked);
      TODO.completeItem($item);
    }).fail(function () {
      $item.prop("checked", !checked);
      var status = (checked)? "completed": "incomplete";
      alert("fail to mark item as "+status);
    });

    $event.preventDefault();
  },
  remove : function ($item) {
    var itemId = $item.closest('li').data('id');
    $.ajax({
      url: "http://128.199.76.9:8002/helloheesu/"+itemId,
      method: "DELETE"
    }).done(function (data) {
      TODO.removeItem($item.closest('li'));
    });
  }
};

TODO = {
  item : null,
  board : null,
  template : function(){}
};
TODO.init = function () {
  TODO.item = $('#new-item-script');
  TODO.board = $('#todo-list');
  TODO.template = Handlebars.compile(TODO.item.html());
};
TODO.addItem = function (data) {
  if (typeof(data) === "string") data = {todo:data};
  else if(typeof(data) !== "object") return;
  TODO.board.append(TODO.template(data));
  var lastLi = $('li:last-child');
  lastLi.css('opacity', 0);
  lastLi.css('opacity');
  lastLi.css('opacity', 1);
};
TODO.addItems = function (datas) {
  // TODO : 일단은 addItem 반복, 나중에 handlebar 로 개선.
  for (var i = 0; i < datas.length; i++) {
    TODO.addItem(datas[i]);
  };
}
TODO.removeItem = function (cachedLi) {
  if (!cachedLi) return;
  cachedLi.css({
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
    cachedLi.off('webkitTransitionEnd transitionend', removeItem);
    cachedLi.remove();
  };
  cachedLi.on('webkitTransitionEnd transitionend', removeItem);
};
TODO.completeItem = function ($item) {
  var checked = $item.is(':checked');
  $item.closest('li').toggleClass('completed', checked);
};

$(document).ready(function () {
  TODO.init();
  TODOsync.get();
  $('#new-todo').on('keypress', function(event) {
    var ENTER_KEYCODE = 13;
    if(event.which === ENTER_KEYCODE) {
      var sContents = $('#new-todo').val();
      if(!sContents) return;
      TODOsync.add(sContents);
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function(e) {
    TODOsync.complete($(this), e);
  });
  $('#todo-list').on('click', 'li:not(.deleting) button.destroy', function() {
    TODOsync.remove($(this));
  });
});