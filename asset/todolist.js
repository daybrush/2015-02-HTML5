//NEXT 2015_2학기_HTML5 : shinyoung

/* 150702
 * enter키(keycode : 13) 입력 이벤트 발생 시 todo(li element) 추가
 * AddTodoItemToList()
 * createTodoItem()
 */

/* 150707
 * 할일목록에서 완료처리, 삭제처리....하드코딩.... 
 * event delegation 적용. 
 * completeTodoItem()
 * destroyTodoItem()
 */

/* 1507011
 * 등록/삭제 애니메이션 추가 
 * 왜 투명도가 바뀌는데 보이는건 똑같으냐......!!!!!!
 */

/* 150713
 * keyframe(transform) 사용 css애니메이션 코드 추가. 띠용띠용.
 * custom.css - shake
 */

/* 150803 게으름에서 복귀.....3주차-
 * object로 정리 / AJAX(TODOSync)
 * onoffline / filters / history 관리
 *
 * Object literal pattern
 */

/* 남은 할일
 * 싹다 jquery로 바꾸기 + 코드정리
 * localStorage - sessionStorage / indexedDB / Service Worker / navigator.connection
 */

var AJAX = function(params){
    var xhr = new XMLHttpRequest();
    xhr.open(params.method, params.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.addEventListener("load", function(){
        params.callback(JSON.parse(xhr.responseText));
    });
    xhr.send(params.sendParams);
}
    //[질문!] 원래는 sendParams나, 혹은 다른 것들도-뭐든...?꼭 AJAX가 아니라 다른 사례에서도요- 추가될 수 있는 여지를 생각해서 
    //정말 기본으로 xhr을 만들고, open하고, load이벤트리스너를 걸고하는 기본 틀이 (예를 들면) commonAJAX라고 해서 있고,
    //거기에 추가적으로 조금씩 달라지는 부분을 commonAJAX를 확장한 함수로 만들고 싶었지만 오히려 불필요한 코드가 늘어나게만 되서 못했는데요.
    //제 생각에는 비슷하게 할 수 있는게 extend가 있었는데, 이렇게 작은 단위 함수를 위한 건 아닌 것 같고...
    //오브젝트도 프로토타입도 extend해서 쓰기는 하던데, JS에서도 이런 상속을 잘 쓰나요..??

var TODOSync = {
    init : function(){
        window.addEventListener("online", this.onOffLineListener);
        window.addEventListener("offline", this.onOffLineListener);
    },
    onOffLineListener: function(){
        document.getElementById("header").classList[navigator.onLine? "remove" : "add"]("offline");
        
        //===
        //if(navigator.onLine){
        //    document.getElementById("header").classList.remove("offline");
        //}else{
        //    document.getElementById("header").classList.add("offline");
        //}
    },
    get : function(callback){
        AJAX({
            "method" : "GET",
            "url" : "http://128.199.76.9:8002/fairesy",
            "sendParams" : null,
            "callback" : callback
        });
    },
    add : function(newTodo, callback){
        AJAX({
            "method" : "PUT",
            "url" : "http://128.199.76.9:8002/fairesy",
            "sendParams" : "todo="+newTodo,
            "callback" : callback
        });
    },
    completed : function(params, callback){
        AJAX({
            "method" : "POST",
            "url" : "http://128.199.76.9:8002/fairesy/" + params.key,
            "sendParams" : "completed="+params.completed,
            "callback" : callback
        });
    },
    destroy : function(params, callback){
        AJAX({
            "method" : "DELETE",
            "url" : "http://128.199.76.9:8002/fairesy/" + params.key,
            "sendParams" : null,
            "callback" : callback
        });
    }
}

var TODO = {
    ENTER_KEYCODE : 13,
    selectedIndex : 0,
    
    /****************************************************************************************
    * initializing
    *****************************************************************************************/
    init: function(){
        document.addEventListener("DOMContentLoaded", function(){
            this.initEventBinding();
            this.getExistingList();
        }.bind(this));
    },
    initEventBinding : function(){ 
        var newTodo = document.getElementById("new-todo");
        newTodo.addEventListener("keydown", this.add.bind(this), false);
        var todoWrapper = document.getElementById("main");
        todoWrapper.addEventListener("click", this.complete ,false);
        todoWrapper.addEventListener("click", this.destroy, false);
        var filters = document.getElementById("filters");
        filters.addEventListener("click", this.getFilteredList.bind(this), false);
        
        window.addEventListener("popstate", this.changeURLWithFilter.bind(this), false);
    },
    
    /****************************************************************************************
    * view&state 관리 
    *****************************************************************************************/
    changeURLWithFilter : function(event){
        if(event.state){
            var method = event.state.method;
            if(method === "all"){
                this.getAllList();
            }else if(method === "active"){
                this.getActiveList();
            }else if(method === "completed"){
                this.getCompletedList();
            }
            
            //이럴줄 모르고 함수이름 다르게...ㅠㅜㅠUppercase...
            //this["get" + method + "List"](); : object literal pattern
            
        }else{
            this.getAllList();
        }
    },
    getFilteredList : function(event){
        event.preventDefault();
        var target = event.target;
        var tagName = target.tagName.toLowerCase();
        if(tagName === "a"){
            var href = target.getAttribute("href");
            if(href === "index.html"){
                this.getAllList();
            }else if(href === "active"){
                this.getActiveList();
            }else if(href === "completed"){
                this.getCompletedList();
            }
        }
    },
    getAllList : function(){
        document.getElementById("todo-list").className = "";
        this.changeFilterStateTo(0);
        history.pushState({"method" : "all"}, null, "index.html");
    },
    getActiveList : function(){
        document.getElementById("todo-list").className = "all-active";
        this.changeFilterStateTo(1);
        history.pushState({"method" : "active"}, null, "active");
        //#없이 "active"라고만 하니 에러가 난다. 
        //상대주소로 지정을 해야한다고 하지만 그냥 쓰면 기본으로 현재주소에 상대적으로 들어간다고도 나오는데,
        //왜 "cannot be created in a document with origin 'null'" 에러가 나지?!
    },
    getCompletedList : function(){
        document.getElementById("todo-list").className = "all-completed";
        this.changeFilterStateTo(2);
        history.pushState({"method" : "completed"}, null, "#/completed");
    },
    changeFilterStateTo : function(index){
        var filters = document.querySelectorAll("#filters a");
        filters[this.selectedIndex].classList.remove("selected");
        filters[index].classList.add("selected");
        this.selectedIndex = index;
    },
    
    /****************************************************************************************
    * TodoItem 관리
    *****************************************************************************************/
    getExistingList : function(){
        TODOSync.get(function(JSON){
            console.log(JSON);
            var todoList = document.getElementById("todo-list");
            for (var index in JSON){
                var existingTodo = this.create(JSON[index].todo, JSON[index].id);
                if(JSON[index].completed === 1){
                    existingTodo.classList.add("completed");
                    existingTodo.firstChild.firstChild.checked = true;
                }
                todoList.insertBefore(existingTodo, todoList.firstChild);
            }
        }.bind(this));
    },
    create : function(todoLabel, key){
        var todoItem = document.createElement("li");
        todoItem.setAttribute("class", "shake");
        var source = '<div class="view"><input class="toggle" type="checkbox" {}><label>{{todoLabel}}</label><button class="destroy"></button></div>';
        var template = Handlebars.compile(source);
        var data = {"todoLabel" : todoLabel};
        var result = template(data);
        todoItem.innerHTML = result;
        todoItem.dataset.key = key;
        
        return todoItem;
    },
    add : function(event){
        if(event.keyCode === this.ENTER_KEYCODE){
            var newTodo = document.getElementById("new-todo");
            var todoLabel = newTodo.value;
            if(todoLabel === ""){
                alert("할 일을 입력해주세요!");
                return;
            }
            
            TODOSync.add(todoLabel, function(JSON){
                console.log(JSON);                
                var createdTodoItem = this.create(todoLabel, JSON.insertId);
                document.getElementById("todo-list").appendChild(createdTodoItem);
                newTodo.value = "";
            }.bind(this));

        }
    },   
    complete : function(event){
        var checkbox = event.target;
        var todoItem = checkbox.parentNode.parentNode;
        var completed = checkbox.checked ? "1" : "0";
        if(checkbox.className === "toggle"){
            TODOSync.completed({
                "key" : todoItem.dataset.key,
                "completed" : completed
            },function(){
                if(completed === "1"){
                    todoItem.classList.add("completed");	
                }
                else{
                    todoItem.classList.remove("completed");
                }
            });
        }
    },
    destroy : function(event){
        var itemToDestroy = event.target.parentNode.parentNode;
        if(event.target.className === "destroy"){
            TODOSync.destroy({
                "key" : itemToDestroy.dataset.key
            },function(){
                itemToDestroy.classList.add("fadeOut");
                itemToDestroy.addEventListener("animationend", function(){
                    itemToDestroy.parentNode.removeChild(itemToDestroy);
                });
            });
        }
    }
}

TODO.init();
TODOSync.init();
