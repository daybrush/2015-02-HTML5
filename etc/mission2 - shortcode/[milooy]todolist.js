// NHNNEXT 1기 진유림님 코드

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

function completedTODO(e){
    $(e.currentTarget).closest('li').toggleClass('completed');;
}

function removeTODO(e){
    var li = $(e.currentTarget).closest('li');
    if (!$(this).hasClass('disabled')) {
        li.css('animation', 'fadeOut .5s');
        li.on('animationend || webkitAnimationEnd',function(){
            li.remove();
            $(this).toggleClass('disabled');
        });
    }
}

$(function() {
    $('#new-todo').keydown(addTODO);
    $('#todo-list').on( "click", '.toggle', completedTODO)
                    .on( "click", '.destroy', removeTODO);
});
