var ssss = '<div class="view"><input class="toggle" type="checkbox"><label>타이틀</label><button class="destroy"></button></div>';
var elNewTodo = $('<li></li>');
elNewTodo.html(ssss);

$(document).ready(function () {
  $('#new-todo').on('keypress', function(event) {
    if(event.keyCode === 13) {
      var newItem = elNewTodo.clone();
      $('label', newItem).text($('#new-todo').val());
      $('#todo-list').append(newItem);
      $('#new-todo').val('');
    }
  });
  $('#todo-list').on('click', 'input.toggle', function() {
    console.log('destroy ',$(this), $(this).closest('li'));
    $(this).closest('li').addClass('completed');
  })
});
