var listnum = 0;

// 엔터 이벤트 발생시
$("#new-todo").on("keydown",function(e){
	if(e.keyCode == 13){
		// 새 리스트 항목 생성
		var title = $(this).val();
		var newList = $("li.sample").clone();
		newList.prependTo($("#todo-list"))
			.css({opacity:0})
			.removeClass("sample")
			.find("label").text(title);

		newList.animate({opacity:1.0},400);

		listnum++;
		
		// 폼 초기화
		$(this).val(null);
	}
});

// 할일 체크
$("body").on("click", ".toggle", function(){
	var list = $(this).parent().parent();
	if($(this).is(":checked")){
		list.addClass("completed");
	}else{
		list.removeClass("completed");
	}
})

// 할일 삭제
$("body").on("click", ".destroy", function(){
	var list = $(this).parent().parent();

	list.animate({
		height:'0px'	
	},400,function(){
		list.remove();	
	});
})


var source = $("body").html();
var template = Handlebars.compile(source);