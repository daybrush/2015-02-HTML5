const TODO_URL = "http://128.199.76.9:8002/JB1021/";

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
	init : function(){
		$(document).on("DOMContentLoaded", function(){
			$("#new-todo").on("keydown", this.add.bind(this)); 
			$("#todo-list").on("click", this.completed);
			$("#todo-list").on("click", this.remove);
		}.bind(this));
		$.get(TODO_URL, function(result){
			for(var i in result){
				var todoLi = this.build(result[i].todo, result[i].id);
				$(todoLi[0]).css('opacity', '1');
				$("#todo-list").prepend(todoLi[0]);
			}
		}.bind(this));
	},
	build : function(todo, key){
		var todoObj = { title : todo , insertId : key}
		var template = Handlebars.compile(Templates.todoTemplate);
		return $(template(todoObj));
	},
	add : function(e){
		if(e.keyCode === this.ENTER_KEYCODE) {
			var todo = $("#new-todo").val();
			$.put(TODO_URL, todo, function(result){
				var todoLi = this.build(todo, result.insertId);
				$("#todo-list").prepend(todoLi[0]);
				$("#new-todo").val("");
				setTimeout(function() {
					todoLi.addClass("appending");
  				}, 10);			
			}.bind(this));
  		}
	},
	completed : function(e){
		var input = $(e.target);
		var li = input.parents("li");
		var completed = input.is(":checked")?"1":"0";
		$.post(TODO_URL+li.data("key"),completed, function(result){
			li.toggleClass("completed", input.is(":checked"));
		});
	}, 
	remove : function(e){
		var destroy = $(e.target);
		var li = destroy.parents("li");
		if(e.target.className !== "destroy") return;
		$.delete(TODO_URL+li.data("key"), function(){
  			li.addClass("deleting");
			li.on("transitionend" , function () {
  				li.remove();
			});
		})
	}
}

Templates = {}; 
Templates.todoTemplate = [
	'<li data-key={{insertId}} >',
		'<div class="view">',
			'<input class="toggle" type="checkbox">',
			'<label>{{title}}</label>',
			'<button class="destroy"></button>',
		'</div>',
	'<li>'
].join("\n");

TODO.init();