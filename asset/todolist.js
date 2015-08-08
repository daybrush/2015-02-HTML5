window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


var TODOSync = {
	url : "http://128.199.76.9:8002/cca-company",
	nickname : "cca-company",
	IDBRequest : null,
	maxId : 0,
	init : function(){
		$(window).on("online offline", this.onofflineListner);

		this.IDBRequest = window.indexedDB.open(this.nickname, 3);
		this.IDBRequest.onupgradeneeded = this.upgradeDB;

	},
	upgradeDB : function(e){
		var db = e.target.result;
		db.createObjectStore("todolist",{keyPath: "localId", autoIncrement : true});
	},
	onofflineListner : function(){
		$("#header")[(navigator.onLine)?"removeClass":"addClass"]("offline");

		if(navigator.onLine){
			// 서버와 데이터 싱크
			var objectStore = TODOSync.IDBRequest.result.transaction(["todolist"],"readwrite").objectStore("todolist");

			objectStore.openCursor(null,"prev").onsuccess = function(event){
				var cursor = event.target.result;

				if(cursor){
					var data = {
						nickname : TODOSync.nickname,
						todo : cursor.value.todo,
						id : cursor.value.id,
						completed : cursor.value.completed
					};

					var url = TODOSync.url;
					if(cursor.value.method != "PUT") url+='/'+cursor.value.id;

					TODOSync.ajaxRequest(url, cursor.value.method, data);

					cursor.delete();	// 커서가 가리키는 오브젝트를 삭제
					cursor.continue();	// 6시간 삽질의 스페셜 게스트... 현재 커서에서 지정된 방향으로 한 칸 움직이고 해당 커서에 대해 onsuccess를 한번 더 호출하는 것 같음...

				}else{
					console.log('sync complete');
				}
			}

		}
	},
	ajaxRequest : function(url, method, data, callback){

		var callback = callback || function(){};

		$.ajax({
			url : url,
			method : method,
			data : data,
			dataType : "json",
		}).done(callback);

	},
	localChange : function(data){
		var objectStore = this.IDBRequest.result.transaction(["todolist"],"readwrite").objectStore("todolist");

		objectStore.add(data).onsuccess = function(){
			console.log("local change complete");
		};
	},
	get : function(callback){
		this.ajaxRequest(this.url, "GET", {nickname : this.nickname}, callback);
	},
	add : function(todo,callback){
		this.maxId += 1;

		if(navigator.onLine){

			var data = {
				nickname : this.nickname,
				todo : todo
			}
			this.ajaxRequest(this.url, "PUT", data, callback);

		}else{
			// 오프라인 연결시 로컬에 저장
			var data = {
				id : this.maxId,
				todo : todo,
				completed : 0,
				method : "PUT"
			};
			this.localChange(data);

			callback({insertId : this.maxId});
		}
	},
	complete:function(id, completed){

		if(navigator.onLine){
			var data = {
				nickname : this.nickname,
				id : id,
				completed : completed
			}
			this.ajaxRequest(this.url + '/' + id, "POST", data);
		}else{
			var data = {
				id : id,
				completed : completed,
				method : "POST"
			};
			this.localChange(data);
		}

	},
	remove:function(id){

		if(navigator.onLine){
			var data = {
				nickname : this.nickname,
				id : id
			}
			this.ajaxRequest(this.url + '/' + id, "DELETE", data);
		}else{
			var data = {
				id : id,
				method : "DELETE"
			};
			this.localChange(data);
		}
	}
}


var TODO = {
	ENTER_KEYCODE : 13,
	init : function(){
		$("body").on("keydown","#new-todo", this.add);
		$("body").on("click", ".toggle", this.complete);
		$("body").on("click", ".destroy", this.remove);

		this.getlist();
	},
	getlist : function(){
		TODOSync.get(function(list){
			var template = Handlebars.compile( $("#template").html() );
			var itemList = [];

			TODOSync.maxId = list[0].id;

			for(var i = 0; i < list.length; ++i)
			{
				var data = {
					title : list[i].todo,
					id : list[i].id,
					completed : list[i].completed
				}

				var newItem = $(template(data));
				itemList.push(newItem);
			}
			$("#todo-list").append(itemList);
		});
	},
	build : function(todo, insertId, completed){
		var template = Handlebars.compile( $("#template").html() );

		// 새 리스트 항목 생성
		var data = {
			title : todo,
			id : insertId,
			completed : completed
		}

		var newItem = $(template(data));

		newItem.prependTo("#todo-list")
			.css({opacity:0})
			.animate({opacity:1.0},400);

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

TODOSync.init();
TODO.init();
