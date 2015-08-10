/*
수업시간에 할거
Service worker(구 application cache)
indexedDB(or localStorage)
navigator.connection
*/
var TODOSync = {
    url: "http://128.199.76.9:8002/milooy",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    init: function() {
        $(window).on('online offline', this.onofflineListener);
    },
    onofflineListener: function() {
        $('#header')[navigator.onLine? "removeClass" : "addClass"]('offline');
        if(navigator.onLine) {
            //서버로 sync맞추기
        }
    },
    get: function(callback) {
        $.ajax({ type: "GET", url: this.url, contentType: this.contentType,
        }).done(callback);
    },
    add: function(todo, callback) {
        if(navigator.onLine) {
            $.ajax({ type: "PUT", url: this.url, data: { todo: todo }, contentType: this.contentType,
            }).done(function(data){
                callback(data);
            });
        } else {
            //data를 클라에 저장 -> localstorage, indexdDB, webSQL
        }
    },
    completed: function(param, callback) {
        $.ajax({ type: "POST", url: this.url+"/"+param.key, data: { completed: param.completed }, contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    },
    remove: function(param, callback) {
        $.ajax({ type: "DELETE", url: this.url+"/"+param.key, data: { completed: param.completed }, contentType: this.contentType,
        }).done(function(data){
            callback(data);
        });
    }
}

var TODO = {
    ENTER_KEYCODE: 13,
    selectedIndex: 0,
    init: function() {
        this.initTODO();
        $('#new-todo').keydown(this.add.bind(this));
        $('#todo-list').on( "click", '.toggle', this.completed)
        .on( "click", '.destroy', this.remove);
        $('#filters').on('click', 'a', this.changeStateFilter);
        $(window).on('popstate', this.changeURLFilter);
    },
    changeURLFilter: function(e) {
        if(history.state){
            TODO[history.state.method+"View"]();
        } else {
            TODO.allView();
        }
    },
    changeStateFilter: function(e) {
        var method = $(this).text().toLowerCase();
        var href = method==="all"? "index.html" : "#/"+method;

        TODO[method+"View"]();
        history.pushState({"method": method}, null, href);

        e.preventDefault();
    },
    allView: function() {
        $('#todo-list').removeClass();
        this.selectNavigator(0);

    },
    activeView: function() {
        $('#todo-list').removeClass().addClass('all-active')
        this.selectNavigator(1);

    },
    completedView: function() {
        $('#todo-list').removeClass().addClass('all-completed')
        this.selectNavigator(2);

    },
    selectNavigator: function(index) {
        var navigatorList = $('#filters a');
        navigatorList[this.selectedIndex].classList.remove('selected');
        navigatorList[index].classList.add('selected');
        this.selectedIndex = index;
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
            /* TODO: map으로 개선. append를 TODO내에서 하지 않는다.*/
            for(i in json){
                var item = json[json.length-i-1]; // item 역순정렬
                var completed = item.completed==1? 'completed' : null;
                TODO.appendTODOHTML(item.todo, item.id, completed);
                if(completed!=null) $("#todo-list li:last-child input").attr("checked", true);
            }
        });
    }
}
TODO.init();
TODOSync.init();
