/*
* transition, transform
  * 개발자도구로 opacity 바꿔놓으면 destroy가 잘 안 되는 문제가 있음.
* new TODO() 는 굳이 ㄴㄴ. 어차피 딱 하나인데. 차라리 new Item().
* 클릭이미됐으면 무시
* TODO.removeItem
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
  // ????? setTimeout 안 하면 왜 transition 이 안 먹히지
  setTimeout(function () {
    $('li:last-child').removeClass('appending');
  }, 10);
  // 어차피 바로 먹힐 거 'appending' 이라는 클래스를 템플릿에 써 두지 말고
  // 여기서 추가했다가 삭제하는 걸로 할까.

  /* setTimeout 대신 requestAnimationFrame, 이렇게까지???
  * http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements
  * 위 스택오버플로 글에서 파폭에서는 setTimeout 잘 안된다고. 근데 해봤는데 잘됨;;;

  // var start;
  // function step(timestamp) {
  //   if (!start) start = timestamp;
  //   if (timestamp - start < 10) {
  //     window.requestAnimationFrame(step);
  //   } else {
  //     $('li:last-child').removeClass('appending');
  //   }
  // }
  // window.requestAnimationFrame(step);

  */
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
      // 사라지는 모습이 좀 못 생김. 애니메이션 끝 - 사라짐 연결이 부드럽지 않음. 근데 그 전에도 그랬네.

      // cachedLi.off('transitionend', removeItem);
      // remove 가 알아서 해 주니까 필요없음.
    };
    cachedLi.on('webkitTransitionEnd transitionend', removeItem);
    // https://developer.mozilla.org/ko/docs/Web/Guide/CSS/Using_CSS_transitions#.ED.8A.B8.EB.9E.9C.EC.A7.80.EC.85.98_.EC.99.84.EB.A3.8C_.EA.B0.90.EC.A7.80.ED.95.98.EA.B8.B0
  });
});
