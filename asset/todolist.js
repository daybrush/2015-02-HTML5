var listnum = 0;

var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		$("body").on("keydown","#new-todo", this.add);
		$("body").on("click", ".toggle", this.complete);
		$("body").on("click", ".destroy", this.remove);
	},
	build : function(){
		// 새 리스트 항목 생성
		var title = $(this).val();
		var newList = $("li.sample").clone();

		var data = {"title":title};
		var source = newList.html();
		var template = Handlebars.compile(source);
		newList.html(template(data));

		newList.prependTo($("#todo-list"))
			.css({opacity:0})
			.removeClass("sample");
			
		newList.animate({opacity:1.0},400);

		listnum++;
			
		// 폼 초기화
		$(this).val(null);
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
		if(e.keyCode == 13){
			// 새 리스트 항목 생성
			var title = $(this).val();
			var newList = $("li.sample").clone();

			var data = {"title":title};
			var source = newList.html();
			var template = Handlebars.compile(source);
			newList.html(template(data));

			newList.prependTo($("#todo-list"))
				.css({opacity:0})
				.removeClass("sample");
			
			newList.animate({opacity:1.0},400);

			listnum++;
			
			// 폼 초기화
			$(this).val(null);
		}
	}
};

TODO.init();
