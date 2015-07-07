var listnum = 0;

// 엔터 이벤트 발생시
$("#new-todo").bind("keydown",function(e){
	if(e.keyCode == 13){
		// 새 리스트 항목 생성
		var title = $(this).val();
		
		$("li.sample").clone().appendTo($("#todo-list"))
			.removeClass("sample")
			.find("label").text(title);

		listnum++;
		
		// 폼 초기화
		$(this).val(null);
	}
});

var source = $("body").html();
var template = Handlebars.compile(source);