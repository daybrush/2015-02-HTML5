/*
* transition, transform
  * 개발자도구로 opacity 바꿔놓으면 destroy가 잘 안 되는 문제가 있음.
* new TODO() 는 굳이 ㄴㄴ. 어차피 딱 하나인데. 차라리 new Item().
* 클릭이미됐으면 무시
* TODO.removeItem
* 아무것도없을때 입력칸 혹은 맨마지막 아이템, 위에 희미하게 회색선. 뭐지?
* 사라지는 모습이 좀 못 생김. 애니메이션 끝 - 사라짐 연결이 부드럽지 않음. 근데 그 전에도 그랬네.
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
  $('#todo-list').on('click', 'button.destroy', function() {
    var cachedLi = $(this).closest('li');
    cachedLi.addClass('deleting');
    var removeItem = function () {
      cachedLi.remove();
    };
    cachedLi.on('webkitTransitionEnd transitionend', removeItem);
  });
});
