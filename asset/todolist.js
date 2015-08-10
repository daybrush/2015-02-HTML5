var TODO = {
	selectedIndex : 0,
	init : function(){
		this.getAllTodoList();
		$('input').on('keydown', this.addList);
		$("ul").on("click", "li  div  input[type=checkbox]", this.completeList);
		$("ul").on("click", "li  div  .destroy", this.removeList);
		$("#filters").on("click", this.changeStateFilter.bind(this));
	},
	
	changeStateFilter : function(e){
		var target = e.target;
		var tagName = e.target.tagName.toLowerCase();
		if(tagName == "a"){
			var href = target.getAttribute("href");
			if(href === "index.html"){
				this.allView();
			}else if (href === "active"){
				this.activeView();
			}else if (href === "completed"){
				this.completedView();
			}
		}
		e.preventDefault();
	},

	allView : function(){
		document.getElementById("todo-list").className = "";
		this.selectNavigator(0);
		history.pushState({"method":"all"}, null, "index.html");
	},

	activeView : function(){
		document.getElementById("todo-list").className = "all-active";
		this.selectNavigator(1);
		history.pushState({"method":"active"}, null, "active");
	},

	completedView : function(){
		document.getElementById("todo-list").className = "all-completed";
		this.selectNavigator(2);
		history.pushState({"method":"completed"}, null, "completed");
	},
 
	selectNavigator : function(index){
		var navigatorList = document.querySelectorAll("#filters a");
		console.log(navigatorList);
		navigatorList[this.selectedIndex].classList.remove("selected");
		navigatorList[index].classList.add("selected");
		this.selectedIndex = index;
	},

	getAllTodoList : function(){
		TODOSync.get(function(json){
			for(i=json.length-1; i>=0; i--) {
				var completed;
				var checked;
				if (json[i].completed == 1) {
					completed = "completed";
					checked = "checked";
				} else {
					completed = "added";
					checked = null;
				}
				appendWithTemplateEngine("#addListElements", "#todo-list", { key:json[i].id, class:completed, checked:checked, text:json[i].todo});
			}
		})

		function appendWithTemplateEngine(template, elementToAppend, dataToBind) {
		    		var source   = $(template).html();
					var template = Handlebars.compile(source);
					var templateData = dataToBind;

					$(elementToAppend).append(template(templateData));	
		}
	},

	addList : function(e){
		if (e.which == 13) {
			var textValue = $("input").val();
			TODOSync.add(textValue, function(json){
		  	   	appendWithTemplateEngine("#addListElements", "#todo-list", { key:json.insertId, class:'added', text:textValue });
		  	   	animateFadeIn($("#todo-list li:last-child"));
		  	   	deleteTextAfterPutIn();
		    	e.preventDefault();

		    	function appendWithTemplateEngine(template, elementToAppend, dataToBind) {
		    		var source   = $(template).html();
					var template = Handlebars.compile(source);
					var templateData = dataToBind;

					$(elementToAppend).append(template(templateData));	
		    	}

		    	function animateFadeIn(elementToAnimate) {
					var i = 0;
					animation();

					function animation() {
						if (i === 50) {
							return;
						} else {
							elementToAnimate.css( "opacity", 0+i*0.2);
							i++;
						}
						requestAnimationFrame(animation);
					}		
				}

		    	function deleteTextAfterPutIn() {
		    		$("input").val('');  
		    	}
	    	}.bind(this));
	    }
	},

	completeList : function(e){
		var input = e.currentTarget;
		var elLi = input.closest("li");
		var completed = input.checked?"1":"0";

		TODOSync.completed({
			"key" : elLi.dataset.key,
			"completed" : completed
		},function(){
				if (completed==="1") {
				elLi.className = "completed"
			}
			else {
				elLi.className = "added"
			}
		})
	},

	removeList : function(e){
		var elLi = e.currentTarget.closest("li");

		TODOSync.remove(elLi.dataset.key, function(){		
			animateFadeOut($(elLi));

			function animateFadeOut(elementToAnimate) {
				var i = 0;
				animation();

				function animation() {
					if (i === 50) {
						elementToAnimate.remove();
						return;
					} else {
						elementToAnimate.css( "opacity", 1-i*0.2);
						i++;
					}
					requestAnimationFrame(animation);
				}		
			}
		})
	},
};

var TODOSync = {
	url : "http://128.199.76.9:8002/",
	id : "dohonext/",
	init : function(){
		window.addEventListener("online", this.onofflineListener);
		window.addEventListener("offline", this.onofflineListener);
	},
	onofflineListener : function(){
		//			document.getElementById("header").classList[navigator.online?"remove":"add"]("offline");
		if(navigator.onLine){
			document.getElementById("header").classList.remove("offline");
		}else{
			document.getElementById("header").classList.add("offline");
		}
	},
	get : function(callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.url+this.id, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	},

	add : function(todo, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", this.url+this.id, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("todo="+todo);
	},

	completed : function(param, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", this.url+this.id+param.key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send("completed="+param.completed);
	},

	remove : function(key, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", this.url+this.id+key, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xhr.addEventListener("load",function(e) {
			callback(JSON.parse(xhr.responseText));
		});
		xhr.send();
	}
}

window.addEventListener("load", function() {	
	TODO.init();	
	TODOSync.init();
}, false);
