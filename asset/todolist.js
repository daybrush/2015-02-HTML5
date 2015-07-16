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
	TODO_URL : "http://128.199.76.9:8002/JB1021/",
	init : function(){
		$(document).on("DOMContentLoaded", function(){
			$("#new-todo").on("keydown", this.add.bind(this)); 
			$("#todo-list").on("click", this.completed);
			$("#todo-list").on("click", this.remove.bind(this));
		}.bind(this));
		$.get(this.TODO_URL, function(result){
			for(var i in result){
				var li = this.build(result[i].todo, result[i].id);
				$(li[0]).css("opacity", "1");
				$("#todo-list").append(li[0]);
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
			$.put(this.TODO_URL, {todo : todo}, function(result){
				var li = this.build(todo, result.insertId);
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
		var completed = input.is(":checked")?"1":"0";
		$.post(this.TODO_URL+li.data("key"),completed, function(result){
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
			})
		}.bind(this));
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
	'</li>'
].join("\n");

TODO.init();