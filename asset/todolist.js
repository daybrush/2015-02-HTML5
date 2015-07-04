/*
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

  var start;
  var duration = 300; // [ms]
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start; // [ms]
    cacheDiv.css('opacity', progress/duration);
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
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

    var start;
    var duration = 300; // [ms]
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start; // [ms]
      cacheDiv.css('opacity', 1 - progress/duration);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        console.log(cacheDiv);
        cacheDiv.closest('li').remove()
      }
    }
    window.requestAnimationFrame(step);
  });
});
