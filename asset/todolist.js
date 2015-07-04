function makeTODO(todo) {
    var li = document.createElement('li');
    var div = document.createElement('div');
    div.className = "view";
    var input = document.createElement('input');
    input.className = "toggle";
    input.setAttribute("type", "checkbox")
    var label = document.createElement('label');
    label.innerText = todo;
    var button = document.createElement('button');
    button.className = "destroy";

    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(button);
    li.appendChild(div);

    return li;
}

function addTODO(e) {
    var ENTER_KEYCODE = 13;
    if($('#new-todo').val() && e.keyCode === ENTER_KEYCODE) {
        var todo = makeTODO($('#new-todo').val());

        $("#todo-list").append(todo);
        $('#new-todo').val("");
    }
}

$(function() {
    $('#new-todo').keydown(addTODO);
});
