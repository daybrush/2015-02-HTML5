TODO = {
  item : null,
  board : null,
  template : function(){},
  data : {},
};
TODO.init = function () {
  TODO.item = $('#item');
  TODO.board = $('#todo-list');
  TODO.template = Handlebars.compile(TODO.item.html());
  TODO.board.append(TODO.template(TODO.data));
  TODO.data = {item : []};
};
TODO.addItem = function (sContents) {
  TODO.data.item.push({title:sContents,completed:''});
};
TODO.update = function () {
  // debugger;
  TODO.board.html(TODO.template(TODO.data));
};

$(document).ready(function () {
  TODO.init();
  $('#new-todo').on('keypress', function(event) {
    if(event.keyCode === 13) {
      var sContents = $('#new-todo').val();
      TODO.addItem(sContents);
      console.log(TODO.data);
      TODO.update();
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function() {
    console.log('complete ',$(this), $(this).closest('li'));
    $(this).closest('li').addClass('completed');
  })
  $('#todo-list').on('click', 'button.destroy', function() {
    console.log('destroy ',$(this).closest('div'));
    $(this).closest('div').fadeOut('slow', function() {
      // 왜 li 가 아니고 div?
      console.log($(this), $(this).parent('li'));
      $(this).parent('li').remove();
    });
  })
});
