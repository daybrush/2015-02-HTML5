// handlebarsjs.com 에서 공식적으로 제공하는 샘플 코드
var source = document.getElementById("Todo-template").innerHTML;
var template = Handlebars.compile(source);

var context = {todoMessage : sTodoMessage};
var sHtml = template(context);
return sHtml;

// html상에 심어놓은 템플릿
<script id="Todo-template" type="text/x-handlebars-template">
	<li class="{}">
		<div class="view">
			<input class="toggle" type="checkbox" {}>
			<label>{{todoMessage}}</label>
			<button class="destroy"></button>
		</div>
	</li>
</script>

// 경륜이가 한 코드 
var TODO = {
	target : null,
	getContext:function () {
		return {target: this.target.value}
	},
	// 아래와 같이 사용 하면 컴파일을 한번만 해도 되니까 좋다
	get: function(context) {
		var html = $("#entry-template").html();
		var template = Handlebars.compile(html);
		this.get = template;
    	return template(context);
	}
}

// 교수님이 말씀하신 코드
var TODO = {
	target : null,
	getContext:function () {
		return {target: this.target.value}
	},
	get: function(context) {
		var html = $("#entry-template").html();
		var template = Handlebars.compile(html);
		this.get = function(context) {
			return template(context);
		}
		return template(context);
	}
}

// 교수님이 말씀하신 코드 (더 짧게)
var TODO = {
	target : null,
	getContext:function () {
		return {target: this.target.value}
	},
	get: function(context) {
		var html = $("#entry-template").html();
		var template = Handlebars.compile(html);
		return (this.get = function(context) {
			return template(context);
		})(context);
	}
}

// 경륜이 방식이 더 좋은것 같다고 하셨다