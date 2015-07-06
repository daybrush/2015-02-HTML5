/*
* 사라지는 모습이 좀 못 생김. 애니메이션 끝 - 사라짐 연결이 부드럽지 않음.
  * 다른 아이템들 위치가 갑자기 바뀌니까 그런 것 같다. slideUp 추가하면 될 듯.
  * 근데 transition 이 opacity 와 max-height가 동시가 아니라 순서대로 실행되는 거 같은데.
* todo
* transition으로 애니메이션 하면, 개발자도구로 opacity 바꿔놓으면 destroy가 잘 안 되는 문제가 있음.
* 게다가 몇개 삭제하고 있으면 transition 아예 안 먹기 시작.
* new TODO() 는 굳이 ㄴㄴ. 어차피 딱 하나인데. 차라리 new Item().
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
  console.log(Date.now(), 'tttt', cachedLi.find('label').text()); // 뭐가 언제 찍히나 보자.
  if (!cachedLi) return;
  cachedLi.addClass('deleting');
  // setTimeout(function () {cachedLi.addClass('deleting');}, 10);
  var removeItem = function (event) {
    // console.log(event.target, event.target.nodeName, event.eventPhase);
    if (event.eventPhase !== 2) {
      // li 자신이 아니라 button 등 자식들에 의해 bubbling 받은 거면 무시.
      console.log('don\'t');
      return;
    }
    // console.log(event);
    cachedLi.off('webkitTransitionEnd transitionend', removeItem);
    console.log(Date.now(), 'ssss', cachedLi.find('label').text()); // 뭐가 언제 찍히나 보자.
    cachedLi.remove();
  };
  cachedLi.on('webkitTransitionEnd transitionend', removeItem);
  // one() 은 각 이벤트에 대해서 다 한번씩 해주니까 on + remove 가 딱.
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
    // event.stopPropagation();
    TODO.removeItem($(this).closest('li'));
  });
});
