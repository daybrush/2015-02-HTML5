/*
* week 5
* history 객체 관리하기
   filters의 a 태그가 눌리면 그 해당 a tag만 selected되고, todo-list 에 클래스네임 바꾸기 - push state!
   뒤로가기 했을 때, 해당 페이지로 잘 보여줌
*/

var TODO = {
	elTodoList: null,

	init: function() {
		this.elTodoList = $("#todo-list");
		this.get(); //여기에 있으면 반응속도가 너무 느린 것 같다... 한번에 투두가 확 보였으면 좋겠다...
		$("#new-todo").on("keydown", this.add.bind(this));
		this.elTodoList.on("click", "input", this.complete);
		this.elTodoList.on("click", "button", this.startDeleteAnimation);
		this.elTodoList.on("animationend", "li", this.remove);

		$("#filters").on("click", "a", this.changeStateFilter.bind(this));
		$(window).on("popstate", this.changeURLFilter.bind(this));
		//popstate 가 발생하면, history의 top을 빼는 건가? 아니면 top을 빼지않고 top을 반환한 뒤, top = top-1 로 하는 건가? '앞으로' 가 가능한 걸 보면 후자인 것 같다...
	},

	changeURLFilter: function (ev) {
		this.changeTodoState(history.state === null? "index.html" : history.state.method);
	},

	changeStateFilter: function (ev) {
		ev.preventDefault();
		var selectedAnchor = $(ev.currentTarget);
		var href = selectedAnchor.attr("href");

		this.removeClassName("#filters a");
		selectedAnchor.addClass("selected");
		this.changeTodoState(href);
	
		// history.pushState({"method": href}, null, href); //에러 발생시킴: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///Users/kimdahye/Workspace/NEXT/2015-02/2015-02-HTML5/active' cannot be created in a document with origin 'null'.
		history.pushState({"method": href}, null, "#/"+href); //url이 이상하게 붙는다. 마지막 param은 떼고 붙여야 함...
	},

	changeTodoState: function(href) {
		var todoList = this.elTodoList;
		todoList.removeClass();
		todoList.addClass(href === "index.html"? "" : "all-" + href);
	},

	removeClassName: function(selector) {
		$.each($(selector), function(i, el) {
			$(el).removeClass();
		});
	},

	get: function() {
		TODOSync.get(function (json) {
			$.each(json, function(i, item) {
				var completed =  item.completed===1? true : false;
			    var todoList = this.makeTodoList({key: item.id, title: item.todo, completed: completed}); // "id", "todo", "completed"는 api 상수니까 나중에 따로 뺴서 정리하자
			    $(todoList).prependTo("#todo-list");
			}.bind(this));
		}.bind(this));
	},	

	add: function (ev) {
		var ENTER_KEYCODE = 13;
		if(ev.keyCode === ENTER_KEYCODE) {
			var sTodo = ev.target.value;
			
			TODOSync.add(sTodo, function(json) {
				var todoList = this.makeTodoList({key: json.id, title: sTodo}); //TODO.todoList와 이름 겹친다. 바꿀 필요 있음
				this.elTodoList.append(todoList);
				$("#new-todo").val("");
			}.bind(this));
		}
	},

	makeTodoList: function (oTodo) {
		var source = $("#todo-template").html();
		var template = Handlebars.compile(source);
		var context = { completed:oTodo.completed, todoKey: oTodo.key, todoTitle: oTodo.title };
		return template(context);
	},

	complete: function (ev) {
		var input = ev.currentTarget;
		var li = input.parentNode;
		var oParam = {
			todoKey: li.dataset.todoKey,
			complete: input.checked? 1 : 0
		}
		TODOSync.complete(oParam, function(json){
			li.className = (oParam.complete === 1)? "completed" : ""; //$(li)를 쓰면, 이게 removeClass한번 하고, addClass 한번하고 이렇게 두줄로 바뀌게 되는 건가?
		});
	},

	startDeleteAnimation: function (ev) {
		var button = ev.currentTarget;
		var li = button.parentNode.parentNode;
		var oParam = {
			todoKey: li.dataset.todoKey
		};
		TODOSync.remove(oParam, function() {
			li.className = "deleting";
		});
	},

	remove: function (ev) {
		var li = ev.currentTarget;
		if(li.className === "deleting"){
			li.parentNode.removeChild(li);
		}
	}	
};

$(document).ready(function () {
	TODO.init();
	TODOSync.init();
});
