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
            else {li.css('opacity', i*0.2)}; //js opacity와 jquery opacity가 다른가?
            i++;
        }, 12);

        $('#new-todo').val("");
    }
    $('.toggle').click(completedTODO); //이걸 밑에 실행함수에 넣으면 왜 안되지?
    $('.destroy').click(removeTODO);
}

function completedTODO(e){
    //e.curruntTarget.checked
    var li = $(this).closest('li');
    this.checked ? li.addClass('completed') : li.removeClass('completed');
}

function removeTODO(e){
    var li = $(this).closest('li');
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
});
