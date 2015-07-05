/* todo
* new TODO() 는 굳이 ㄴㄴ. 어차피 딱 하나인데. 차라리 new Item().
* transition 이 opacity 와 max-height가 동시가 아니라 순서대로 실행되는 거 같은데.
* 아무것도없을때 입력칸 혹은 맨마지막 아이템, 위에 희미하게 회색선. 뭐지?
*/
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
TODO.addItem = function (sContents) {
  var data = {title:sContents};
  TODO.board.append(TODO.template(data));
  var lastLi = $('li:last-child');
  lastLi.addClass('appending');
  // ????? setTimeout 안 하면 왜 transition 이 안 먹히지
  setTimeout(function () {
    lastLi.removeClass('appending');
  }, 10);
};
TODO.removeItem = function (cachedLi) {
  if (!cachedLi) return;
  cachedLi.addClass('deleting');
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
}

$(document).ready(function () {
  TODO.init();
  $('#new-todo').on('keypress', function(event) {
    if(event.keyCode === 13) {
      var sContents = $('#new-todo').val();
      if(!sContents) return;
      TODO.addItem(sContents);
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function() {
    var checked = $(this).is(':checked');
    $(this).closest('li').toggleClass('completed', checked);
  });
  $('#todo-list').on('click', 'li:not(.deleting) button.destroy', function() {
    TODO.removeItem($(this).closest('li'));
  });
});
