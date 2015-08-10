/*
## 강의
1. 온라인 / 오프라인
- 오프라인일 때 localStorage에 저장하기
- 온라인일 때 서버에 싱크 맞추기
2. 뒤로 가기.
- pushState활용하기

## Offline Sync
(ls == localStorage)
### 온라인
1. ls에서 삭제된 것 목록을 받아와 서버에서 지운다
2. ls에서 업뎃된 것(sync가 false인것)들을 서버에 저장하고 되면 true로 바꾼다.
2. ls를 비우고, 서버의 todo들을 모두 ls에 새로 저장한다.
3. 서버에서 todo 받아와서 그려준다
5. todo추가나 삭제 하면 서버에도 ls에도 모두 한다.
### 오프라인
1. ls에서 todo 받아와서 그린다
2. todo추가나 삭제 하면 ls에 업뎃 (sync를 false로 한다)
3. todo삭제할땐 ls에 저장된 'removed'에 삭제된 id들을 넣어준다.
*/
var TODOSync = {
    offlineID: 1,
    sync: navigator.onLine? true:false,
    url: "http://128.199.76.9:8002/milooy",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    init: function() {
        $(window).load(function(){
            //handlebar가 로드된 후에 마지막 key값을 받아오기 위한 로직. 개선 필요.
            window.setTimeout(function() {
                TODOSync.offlineID = $("#todo-list li:last-child").data('key')+1 || 1;
            }, 500);
        });

        $(window).on('online offline', this.onofflineListener);
    },
    onofflineListener: function() {
        $('#header')[navigator.onLine? "removeClass" : "addClass"]('offline');
    },
    get: function(callback) {
        if(navigator.onLine) {
            $.ajax({ type: "GET", url: this.url, contentType: this.contentType,
            }).done(callback);
        }
    },
    add: function(todo, callback) {
        if(navigator.onLine) {
            $.ajax({ type: "PUT", url: this.url, data: { todo: todo }, contentType: this.contentType,
            }).done(function(data){
                callback(data);
            });
        } else {
            callback({todo:todo, insertId:TODOSync.offlineID});
        }

        //ls에 저장
        var todoObj = { 'todo': todo, 'completed':null, 'sync': TODOSync.sync };
        localStorage.setItem(TODOSync.offlineID, JSON.stringify(todoObj));
        TODOSync.offlineID++;
    },
    completed: function(param, callback) {
        if(navigator.onLine) {
            $.ajax({ type: "POST", url: this.url+"/"+param.key, data: { completed: param.completed }, contentType: this.contentType,
            }).done(function(data){
                callback(data);
            });
        } else {
            callback({ completed: param.completed });
        }

        //ls에 업데이트
        var todoObj = JSON.parse(localStorage.getItem(param.key));
        todoObj.completed = todoObj.completed=='completed'? null : 'completed';
        localStorage.setItem(param.key, JSON.stringify(todoObj));
    },
    remove: function(param, callback) {
        if(navigator.onLine) {
            $.ajax({ type: "DELETE", url: this.url+"/"+param.key, data: { completed: param.completed }, contentType: this.contentType,
            }).done(function(data){
                console.log("UP REMOVED", param.key);
                callback(data);
            });
        } else {
            callback({ completed: param.completed }); //필요한가?

            //ls의 removed에 키 넣기
            var removedArr = JSON.parse(localStorage.getItem('removed'));
            removedArr.push(param.key);
            localStorage.setItem('removed', JSON.stringify(removedArr));
        }

        //ls에 업데이트
        localStorage.removeItem(param.key);
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
    getTODO: function() {
        TODOSync.get(function(json){
            //sync가 false인것들을 모두 서버에 올리고 sync를 true로 바꾼다.
            var keys = Object.keys(localStorage), i = 0;
            for (; i < keys.length; i++) {
                var data = JSON.parse(localStorage.getItem(keys[i]));

                if(data.sync == false) {
                    TODOSync.add(data.todo, function(json){
                        var key = json.insertId;
                    });
                }
            }

            //ls를 비우고, 서버의 TODO들을 모두 ls에 저장
            localStorage.clear();
            for(i in json) {
                var item = json[json.length-i-1];
                var completed = item.completed==1? 'completed' : null;
                var todoObj = { 'todo': item.todo, 'completed': completed, 'sync': true };
                localStorage.setItem(item.id, JSON.stringify(todoObj));
            }

            /* TODO: for를 쓰지 않을 수 있을까?*/
            /* TODO: map으로 개선. append를 TODO내에서 하지 않는다.*/
            for(i in json){
                var item = json[json.length-i-1]; // item 역순정렬
                console.log(item);
                var completed = item.completed==1? 'completed' : null;
                TODO.appendTODOHTML(item.todo, item.id, completed);
                if(completed!=null) $("#todo-list li:last-child input").attr("checked", true);
            }
        });
    },
    removeFromOffline: function() {
        //오프라인에서 지웠던 것들의 배열을 받아와 서버에서도 지워준다.
        var removedArr = JSON.parse(localStorage.getItem('removed'));

        for(i in removedArr) {
            console.log('arr: ', removedArr[i])
            TODOSync.remove({
                "key": removedArr[i]
            }, function() {
                console.log('remove succed');
            });
        }
    },
    initTODO: function(e) {
        // online: offline에서 지운 것들이 남아있다면 지운 후 TODO를 받아 그려준다.
        if(navigator.onLine) {
            if(localStorage.getItem('removed')) {
                // ##디버그 필요: removeFromOffline이 모두 끝난 후 getTODO를 하고싶은데 그게 안된다.
                $.when( TODO.removeFromOffline() ).done(function() {
                    console.log("getTODO!!!!!");
                    TODO.getTODO();
                });
            } else {
                TODO.getTODO();
            }
        } else {
            // offline: ls에서 데이터를 가져와 넣어준다.
            var keys = Object.keys(localStorage), i = 0;
            for (; i < keys.length; i++) {
                var data = JSON.parse(localStorage.getItem(keys[i]));
                if(keys[i]!== 'removed') TODO.appendTODOHTML(data.todo, keys[i], data.completed);
            }

            //removed된 obj들의 key가 들어갈 ls를 만든다.
            if(!localStorage.getItem('removed')) {
                localStorage.setItem('removed', '[]');
            }
        }
    }
}
TODO.init();
TODOSync.init();
