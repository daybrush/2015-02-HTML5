function addTODO(e) {
    var ENTER_KEYCODE = 13;
    if($('#new-todo').val() && e.keyCode === ENTER_KEYCODE) {
        var source   = $("#todo-template").html();
        var template = Handlebars.compile(source);
        var data = { todo : $('#new-todo').val()};
        $("#todo-list").append(template(data));
        $('#new-todo').val("");
    }
}

$(function() {
  $('#new-todo').keydown(addTODO);
});
