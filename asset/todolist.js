/*
Question
- domcontentloaded안해도 됨?

TODO
-완료하기
삭제하기
초기에 모두 불러오기
TODOSync를 개선하기(코드반복)
*/

/*
var xhr = new XMLHttpRequest();
xhr.open(, ,);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
xhr.addEventListener("load", function(e) {

});
xhr.send();
*/
var TODOSync = {
    get: function() {

    },
    add: function(todo, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://128.199.76.9:8002/milooy", true); //api
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); //헤더설정
        xhr.addEventListener("load", function(e) {
            callback(JSON.parse(xhr.responseText)); //JSON.parse하면 객체화된다.
        });
        xhr.send("todo="+todo);
    },
    completed: function(param, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://128.199.76.9:8002/milooy/"+param.key, true); //api
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); //헤더설정
        xhr.addEventListener("load", function(e) {
            callback(JSON.parse(xhr.responseText)); //JSON.parse하면 객체화된다.
        });
        xhr.send("completed="+param.completed);
    },
    remove: function() {

    }
}

var TODO = {
    ENTER_KEYCODE: 13,
    init: function() { //즉시실행함수 삭제
        $('#new-todo').keydown(this.add.bind(this));
        $('#todo-list').on( "click", '.toggle', this.completed)
        .on( "click", '.destroy', this.remove);

    },
    completed: function(e){
        var completed = $(this).closest('li').hasClass('completed')? '1' : '0';
        TODOSync.completed({
            "key": $(this).closest('li').data('key'),
            "completed": completed
        }, $.proxy(function(){
            $(this).closest('li').toggleClass('completed');
        }, this));
    },
    remove: function(e) {
        var li = $(this).closest('li');
        if (!$(this).hasClass('disabled')) {
            li.css('animation', 'fadeOut .5s');
            //jQuery 이벤트 훅으로 개선. 이건 두번 다 발생
            li.on('animationend webkitAnimationEnd',function(){
                li.remove();
                $(this).toggleClass('disabled');
            });
        }
    },
    add: function(e) {
        if($('#new-todo').val() && e.keyCode === this.ENTER_KEYCODE) {
            var todo = $('#new-todo').val();
            //그냥 하면 비동기라 꼬이므로 콜백으로 넣어준다.
            TODOSync.add(todo, function(json){
                var key = json.insertId;

                var source   = $("#todo-template").html();
                var template = Handlebars.compile(source);
                var data = {
                    todo : todo,
                    key: key
                };
                $("#todo-list").append(template(data));
                $('#new-todo').val("");
            });
        } //왜 강의에선 bind this?
    }
}
TODO.init();
