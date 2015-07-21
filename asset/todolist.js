var listnum = 0;

// 엔터 이벤트 발생시
$("#new-todo").on("keydown",function(e){
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
});

// 할일 체크
$("body").on("click", ".toggle", function(){
	var list = $(this).closest("li");
	list.toggleClass("completed");
})

// 할일 삭제
$("body").on("click", ".destroy", function(){
	var list = $(this).closest("li");

	list.animate({
		height:'0px'	
	},400,function(){
		list.remove();	
	});

	//list.animate({"height":"0px"},400).remove();
})