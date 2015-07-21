/*
Question
*/
var TODOSync = {
    url: "http://128.199.76.9:8002/milooy",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    get: function(callback) {
        $.ajax({
            type: "GET",
            url: this.url,
            data: {},
            contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    },
    add: function(todo, callback) {
        $.ajax({
            type: "PUT",
            url: this.url,
            data: { todo: todo },
            contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    },
    completed: function(param, callback) {
        $.ajax({
            type: "POST",
            url: this.url+"/"+param.key,
            data: { completed: param.completed },
            contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    },
    remove: function(param, callback) {
        $.ajax({
            type: "DELETE",
            url: this.url+"/"+param.key,
            data: { completed: param.completed },
            contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    }
}

var TODO = {
    ENTER_KEYCODE: 13,
    init: function() { //즉시실행함수 삭제함
        this.initTODO();
        $('#new-todo').keydown(this.add.bind(this));
        $('#todo-list').on( "click", '.toggle', this.completed)
        .on( "click", '.destroy', this.remove);

    },
    completed: function(e){
        var completed = $(this).closest('li').hasClass('completed')? '0' : '1';
        TODOSync.completed({
            "key": $(this).closest('li').data('key'),
            "completed": completed
        }, $.proxy(function(){
            $(this).closest('li').toggleClass('completed');
        }, this));
    },
    remove: function(e) {
        var li = $(this).closest('li');

        TODOSync.remove({
            "key": $(this).closest('li').data('key'),
        }, $.proxy(function(){
            if (!$(this).hasClass('disabled')) {
                li.css('animation', 'fadeOut .5s');
                //jQuery 이벤트 훅으로 개선. 이건 두번 다 발생
                li.on('animationend webkitAnimationEnd',function(){
                    li.remove();
                    $(this).toggleClass('disabled');
                });
            }
        }, this));
    },
    appendTODOHTML: function(todo, key, completed){
        var source   = $("#todo-template").html();
        var template = Handlebars.compile(source);
        var data = {
            todo : todo,
            key: key,
            completed: completed
        };
        $("#todo-list").append(template(data));
    },
    add: function(e) {
        if($('#new-todo').val() && e.keyCode === this.ENTER_KEYCODE) {
            var todo = $('#new-todo').val();
            //그냥 하면 비동기라 꼬이므로 콜백으로 넣어준다.
            TODOSync.add(todo, function(json){
                var key = json.insertId;
                TODO.appendTODOHTML(todo, key, 0);
                $('#new-todo').val("");
            });
        }
    },
    initTODO: function(e) {
        TODOSync.get(function(json){
            /* TODO: for를 쓰지 않을 수 있을까?*/
            for(i in json){
                var item = json[json.length-i-1]; // item 역순정렬
                var completed = item.completed==1? 'completed' : null;

                TODO.appendTODOHTML(item.todo, item.id, completed);

                // 체크박스 속성 checked 추가.
                if(completed!=null) $("#todo-list li:last-child input").attr("checked", true);
            }
        });
    }
}
TODO.init();
