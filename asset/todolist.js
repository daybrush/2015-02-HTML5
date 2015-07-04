/*
* Handlebars 사용 방식 변경
* TODO.removeItem
* .addItem 할때 애니메이션
* 클릭이미됐으면 무시
* requestAnimationFrame
* transition, transform
* new TODO()
*/
TODO = {
  item : null,
  board : null,
  template : function(){}
};
TODO.init = function () {
  TODO.item = $('#item');
  TODO.board = $('#todo-list');
  TODO.template = Handlebars.compile(TODO.item.html());
};
TODO.addItem = function (sContents) {
  var data = {title:sContents};
  TODO.board.append(TODO.template(data));
};

$(document).ready(function () {
  TODO.init();
  $('#new-todo').on('keypress', function(event) {
    if(event.keyCode === 13) {
      var sContents = $('#new-todo').val();
      TODO.addItem(sContents);
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function() {
    var checked = $(this).is(':checked');
    $(this).closest('li').toggleClass('completed', checked);
  });
  $('#todo-list').on('click', 'button.destroy', function() {
    var cacheDiv = $(this).closest('div');
    // 여전히 li 가 아니고 div. 왜?
    // li로 하면 매우 오랜 시간이 걸려서 fadeOut 됨.
    // 심지어 그 속도가 내 숫자와 상관없이 상수인 듯;
    var _fadeOut = setInterval(function () {
      var prev = cacheDiv.css('opacity');
      if(typeof(prev) != "string") prev = 1;
      if(prev <= 0) {
        console.log('end!');
        clearInterval(_fadeOut);
        console.log(cacheDiv.closest('li').remove());
      }
      // console.log(prev, typeof(prev));
      cacheDiv.css('opacity', prev-0.1);
      console.log(cacheDiv.css('opacity'));
    }, 30); // 0.3초 만에 끝나게 하려면, 30ms(==0.03초)마다 0.1씩.
    // 인데 실제로는 그렇지 않은 느낌. 느리다.
  });
});
