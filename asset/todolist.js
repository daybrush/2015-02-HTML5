function addTODO(e) {
    var ENTER_KEYCODE = 13;

    if($('#new-todo').val() && e.keyCode === ENTER_KEYCODE) {
        var source   = $("#todo-template").html();
        var template = Handlebars.compile(source);
        var data = { todo : $('#new-todo').val()};
        $("#todo-list").append(template(data));

        var li = $('#todo-list li:last-child').css('opacity', 0);
        var i = 0;
        var key = setInterval(function() {
            if(i===50){clearInterval(key);}
            // TODO: js opacity와 jquery opacity가 다른가? 0.02하면 안된다.
            else {li.css('opacity', i*0.2)};
            i++;
        }, 12);

        $('#new-todo').val("");
    }
}

function completedTODO(e){
    $(e.currentTarget).closest('li').toggleClass('completed');;
}

function removeTODO(e){
    var li = $(e.currentTarget).closest('li');
    var i = 0;
    var key = setInterval(function() {
        if(i===50){
            clearInterval(key);
            li.remove();
        } else {li.css('opacity', 1-i*0.2)};
        i++;
    }, 12);
}

$(function() {
    $('#new-todo').keydown(addTODO);
    $('#todo-list').on( "click", '.toggle', completedTODO)
                    .on( "click", '.destroy', removeTODO);
});
