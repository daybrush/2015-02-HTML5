jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

var TODO = {
	ENTER_KEYCODE : 13,
	selectedTarget : null,
	TODO_URL : "http://128.199.76.9:8002/JB1021/",
	init : function(){
		$(window).on("online offline", this.onoffLineListener);
		$(window).on("popstate", this.changeURLFilter.bind(this));
		$(document).on("DOMContentLoaded", function(){
			$("#new-todo").on("keydown", this.add.bind(this)); 
			$("#todo-list").on("click", this.completed.bind(this));
			$("#todo-list").on("click", this.remove.bind(this));
			$("#filters").on("click", this.changeStateFilter.bind(this));
		}.bind(this));
		$.get(this.TODO_URL, function(result){
			for(var i in result){
				var li = this.build(result[i].todo, result[i].id, result[i].completed);
				$(li[0]).css("opacity", "1");
				$("#todo-list").append(li[0]);
			}
		}.bind(this));
		this.selectedTarget = $("#filters .selected");
		history.pushState({"href":"index.html"}, null, "index.html");
	},
	changeURLFilter : function(e){
		var href = e.originalEvent.state.href;
		if(href === "active"){
			this.activeView();
		} else if(href === "completed"){
			this.completeView();
		} else {
			this.allView();
		}
		this.changeSelectedClass(href);
	},
	onoffLineListener : function(){
		$(header).toggleClass("offline", navigator.offLine);
	},
	changeStateFilter : function(e){
		e.preventDefault();

		var target = $(e.target);
		if(target.get(0).tagName.toLowerCase() !== "a") return;
		
		var href = target.attr("href");
		if(href === "active"){
			history.pushState({"href":"active"}, null, "active");
			this.activeView();
		} else if(href === "completed"){
			history.pushState({"href":"completed"}, null, "completed");
			this.completeView();
		} else {
			history.pushState({"href":"index.html"}, null, "index.html");
			this.allView();
		}
		this.changeSelectedClass(href);
	},
	build : function(title, insertId, complete){
		var completed = (complete === 1)?"completed":"";
		var checked = (complete === 1)?"checked":"";
		var todoObj = { title : title , insertId : insertId, completed : completed, checked : checked};
		var template = Handlebars.compile(Templates.todoTemplate);
		return $(template(todoObj));
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = $("#new-todo").val();
			$.put(this.TODO_URL, {todo : todo}, function(result){
				var li = this.build(todo, result.insertId, result.completed);
				$("#todo-list").prepend(li);
				$("#new-todo").val("");
				setTimeout(function(){
					li.css("opacity", "1");
  				}, 10);			
			}.bind(this));
  		}
	},
	completed : function(e){
		var input = $(e.target);
		var li = input.parents("li");
		var completed = input.is(":checked")?1:0;
		$.post(this.TODO_URL+li.data("key"), {completed : completed}, function(result){
			li.toggleClass("completed", input.is(":checked"));
		});
	}, 
	remove : function(e){
		var destroy = $(e.target);
		if(destroy.attr("class") !== "destroy") return;
		var li = destroy.parents("li");
		$.delete(this.TODO_URL+li.data("key"), function(){
  			li.css("opacity", "0");
			li.on("transitionend", function(){
				li.remove();
			});
		}.bind(this));
	},
	allView : function(){
		$("#todo-list").removeClass("all-active").removeClass("all-completed");
	},
	activeView : function(){
		$("#todo-list").addClass("all-active").removeClass("all-completed");
	},
	completeView : function(){
		$("#todo-list").removeClass("all-active").addClass("all-completed");
	},
	changeSelectedClass : function(href){
		var target = $("#filters a[href='"+href+"']");
		target.addClass("selected");	
		this.selectedTarget.removeClass("selected");
		this.selectedTarget = target;
	}
}

Templates = {}; 
Templates.todoTemplate = [
	'<li data-key={{insertId}} class={{completed}}>',
		'<div class="view">',
			'<input class="toggle" type="checkbox" {{checked}}>',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
	'</li>'
].join("\n");

TODO.init();