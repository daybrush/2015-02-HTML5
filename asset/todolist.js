var listnum = 0;



var TODOSync = {
	url : "http://128.199.76.9:8002/cca-company",
	nickname : "cca-company",
	ajaxRequest : function(url, method, data, callback){

		var callback = callback || function(){};

		$.ajax({
			url : url,
			method : method,
			data : data,
			dataType : "json",
		}).done(callback);

	},
	get : function(callback){
		this.ajaxRequest(this.url, "GET", {nickname : this.nickname}, callback);
	},
	add : function(todo,callback){
		var data = {
			nickname : this.nickname,
			todo : todo
		}
		this.ajaxRequest(this.url, "PUT", data, callback);
	},
	complete:function(id, completed){
		var data = {
			nickname : this.nickname,
			id : id,
			completed : completed
		}
		this.ajaxRequest(this.url + '/' + id, "POST", data);
	},
	remove:function(id){
		var data = {
			nickname : this.nickname,
			id : id
		}
		this.ajaxRequest(this.url + '/' + id, "DELETE", data);
	}
}


var TODO = {
	listData : null,
	template : Handlebars.compile( $("#template").html() ),

	ENTER_KEYCODE : 13,
	init : function(){
		$("body").on("keydown","#new-todo", this.add);
		$("body").on("click", ".toggle", this.complete);
		$("body").on("click", ".destroy", this.remove);

		TODOSync.get(function(data){
			var list = data;

			for(var i = list.length-1; i >= 0; --i)
			{
				TODO.build(list[i].todo, list[i].id, list[i].completed);
			}
		});
	},
	build : function(todo, insertId, completed){

		// 새 리스트 항목 생성
		var data = {
			title : todo,
			id : insertId,
			completed : completed
		}

		var newItem = $(TODO.template(data));

		newItem.prependTo("#todo-list")
			.css({opacity:0})
			.removeClass("sample");
			
		newItem.animate({opacity:1.0},400);

	},
	complete: function(){
		var item = $(this).closest("li");
		var id = item.data("id");
		var completed = $(this).is(":checked");

		item.toggleClass("completed");

		TODOSync.complete(id, (completed)?1:0);
	},
	remove: function(){
		var list = $(this).closest("li");
		var id = list.data("id");

		list.animate({
			height:'0px'	
		},400,function(){
			list.remove();	
		});

		TODOSync.remove(id);
	},
	add: function(e){
		// 여기에서 this.ENTER_KEYCODE를 호출하면 undefined가 뜹니다....왜....?
		if(e.keyCode == 13){
			// 새 리스트 항목 생성
			var todo = $(this).val();

			TODOSync.add(todo, function(data){
				TODO.build(todo, data.insertId, 0);
			});
			
			// 폼 초기화
			$(this).val(null);
		}
	}
};

Handlebars.registerHelper('completed', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  }
});

TODO.init();
