/*
* requestAnimationFrame
* transition, transform
* new TODO() 는 굳이 ㄴㄴ. 어차피 딱 하나인데. 차라리 new Item().
* 클릭이미됐으면 무시
* TODO.removeItem
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

  var cacheDiv = $('li:last-child', TODO.board).find('div');
  cacheDiv.css('opacity', 0);
  var _fadeIn = setInterval(function () {

    var prev = cacheDiv.css('opacity');
    var prev = parseFloat(cacheDiv.css('opacity'));
    if(typeof(prev) !== "number") prev = 0;
    if(prev >= 1) {
      clearInterval(_fadeIn);
    }
    cacheDiv.css('opacity', prev+0.1);
  }, 30); // 0.3초 만에 끝나게 하려면, 30ms(==0.03초)마다 0.1씩.
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
    var cacheDiv = $(this).closest('div');
    var _fadeOut = setInterval(function () {
      var prev = parseFloat(cacheDiv.css('opacity'));
      if(typeof(prev) !== "number") prev = 1;
      if(prev <= 0) {
        console.log(cacheDiv);
        clearInterval(_fadeOut);
        cacheDiv.closest('li').remove()
      }
      cacheDiv.css('opacity', prev-0.1);
    }, 30); // 0.3초 만에 끝나게 하려면, 30ms(==0.03초)마다 0.1씩.
  });
});
