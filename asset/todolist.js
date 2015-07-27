var listnum = 0;



var TODOSync = {
	url : "http://128.199.76.9:8002/cca-company",
	add : function(todo,callback){

		$.ajax({
			url : this.url,
			method : "PUT",
			data : {
				nickname : "cca-company",
				todo : todo
			},
			dataType: "json"
		}).done(callback);

	}
}


var TODO = {
	list : $("#todo-list"),
	data : null,

	ENTER_KEYCODE : 13,
	init : function(){
		$("body").on("keydown","#new-todo", this.add);
		$("body").on("click", ".toggle", this.complete);
		$("body").on("click", ".destroy", this.remove);
	},
	build : function(todo, insertId){
		// 새 리스트 항목 생성
		var newItem = $("li.sample").clone();

		var data = {"title":todo, "insertId":insertId};
		var source = newItem.prop('outerHTML');
		var template = Handlebars.compile(source);
		newItem = $(template(data));

		newItem.prependTo("#todo-list")
			.css({opacity:0})
			.removeClass("sample");
			
		newItem.animate({opacity:1.0},400);

	},
	complete: function(){
		var list = $(this).closest("li");
		list.toggleClass("completed");
	},
	remove: function(){
		var list = $(this).closest("li");

		list.animate({
			height:'0px'	
		},400,function(){
			list.remove();	
		});
	},
	add: function(e){
		// 여기에서 this.ENTER_KEYCODE를 호출하면 undefined가 뜹니다....왜....?
		if(e.keyCode == 13){
			// 새 리스트 항목 생성
			var todo = $(this).val();

			insertId = TODOSync.add(todo, function(data){
				TODO.build(todo, data.insertId);
			});
			
			// 폼 초기화
			$(this).val(null);
		}
	}
};

TODO.init();
