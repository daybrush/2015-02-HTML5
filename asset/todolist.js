/* TODO
* unsynced item, add 후에 id update 해서 다시 처리.
* addSync 성공하면 front에서 data-id 값 update 해주기.
* online 이벤트시에 get - update ...?
  * 는 양방향 watch 가 필요할 거 같으니까 pass.
* TODOstorage.items 너무 취약. 바로 접근하지 말고 getItems()로 뭔가 처리해줘야.
  * +, watching between localStorage - 데이터상의 items : object pattern?
* synced/unsynced item에 따라 object를 아예 나누자.
* on/offline 이벤트 외에, sync.ajax에서 실패시에도 storage에 저장.
* typeof(a) 말고 typeof a.
* promise pattern!
*/

TODOsync = {
  URL : "http://128.199.76.9:8002",
  nickname : "helloheesu",
  ajax : function (options) {
    var itemId = options['id'] || "";
    var fSuccess = options['fSuccess'] || function () {};
    var fFail = options['fFail'] || function () {};

    $.ajax({
      url: TODOsync.URL+'/'+TODOsync.nickname+'/'+itemId,
      method: options['method'],
      data: options['data']
    }).done(fSuccess).fail(fFail);
  },
  get : function (callback) {
    TODOsync.ajax({
      method: "GET",
      fSuccess: callback
    });
  },
  add : function (sContents, callback) {
    TODOsync.ajax({
      method: "PUT",
      data: "todo="+sContents,
      fSuccess: callback
    });
  },
  complete : function (itemId, checked, callback) {
    if(typeof(itemId) === "undefined") {console.error("itemId not defined"); return;}
    if(typeof(checked) === "undefined") {console.error("checked not defined"); return;}
    checked = (checked) ? 1 : 0;

    TODOsync.ajax({
      method: "POST",
      data: "completed="+checked,
      id: itemId,
      fSuccess: callback
    });
  },
  remove : function (itemId, callback) {
    TODOsync.ajax({
      method: "DELETE",
      id: itemId,
      fSuccess: callback
    });
  }
};

TODOstorage = {
  // window.localStorage 는 무조건 존재한다고 가정....
  items : null,
  newItemPrefix : 'new',
  init : function () {
    var prevItems = window.localStorage.getItem('items');
    if (prevItems) {
      TODOstorage.items = JSON.parse(window.localStorage.getItem('items'));
    } else {
      TODOstorage.items = {};
      window.localStorage.setItem('items', JSON.stringify(TODOstorage.items));
    }
  },
  setProperty : function (id, key, value) {
    if (!TODOstorage.items[id]) {
      TODOstorage.items[id] = {};
    }
    TODOstorage.items[id][key] = value;
    window.localStorage.setItem('items', JSON.stringify(TODOstorage.items));
  },
  getProperty : function (id, key) {
    return TODOstorage.items[id][key];
  },
  removeProperty : function (id, key) {
    delete TODOstorage.items[id][key];
    window.localStorage.setItem('items', JSON.stringify(TODOstorage.items));
  },
  removeItem : function (id) {
    delete TODOstorage.items[id];
    window.localStorage.setItem('items', JSON.stringify(TODOstorage.items));
  },
  getItem : function (id) {
    return TODOstorage.items[id];
  },
  get : function (callback) {
    // do nothing
  },
  add : function (sContents, callback) {
    var newId = TODOstorage.newItemPrefix+Date.now();
    TODOstorage.setProperty(newId, 'todo', sContents);
    callback({'insertId':newId});
  },
  complete : function (itemId, checked, callback) {
    if(typeof checked !== "boolean") {console.error("checked:", checked, "is not boolean"); return;}

    /* 가능한 case
    * synced item
      * new push(undefined in items) : TODOstorage.getItem(itemId) 검사해야함. 오류방지.
      * complete을 처음 바꾸는 경우 declare, 다시 바꾸는(돌리는) 경우 removeItem.
        * removeProperty로 함수를 통일하고, sync에서 처리.
    * unsynced item
      * new push - 불가. add를 반드시 거침. : TODOstorage.getItem(itemId) 무조건 통과.
      * complete을 on하는 경우 declare, off의 경우 무조건 removeProperty.
    */
    if(TODOstorage.getItem(itemId) && typeof TODOstorage.getProperty(itemId, 'completed') === "boolean") {
      TODOstorage.removeProperty(itemId, 'completed');
    } else {
      TODOstorage.setProperty(itemId, 'completed', checked);
    }

    callback();
  },
  remove : function (itemId, callback) {
    if (typeof itemId === "number" || itemId.indexOf(TODOstorage.newItemPrefix) < 0) {
      TODOstorage.setProperty(itemId, 'remove', true);
    } else {
      TODOstorage.removeItem(itemId);
    }
    callback();
  },
  dealItem : function(item, itemId) {
    // 순서대로 검사, 있으면 그 하나만 실행하고 종료. 더 깔끔한 방법 없나.
    if ('remove' in item) {
      TODOsync.remove(itemId, function(){
        TODOstorage.removeItem(itemId);
        console.log('remove', itemId, localStorage.items);
      });
      return;
    }
    if ('todo' in item) {
      TODOsync.add(item.todo, function (data) {
        TODOstorage.removeProperty(itemId, 'todo');
        console.log('todo', itemId, localStorage.items);
        TODOstorage.dealItem(item, itemId);
      });
      return;
    }
    if ('completed' in item) {
      TODOsync.complete(itemId, item.completed, function () {
        TODOstorage.removeItem(itemId); // complete 외에는 '수정'할 property가 없다고 가정.
        console.log('completed', itemId, localStorage.items);
      });
      return;
    }
    TODOstorage.removeItem(itemId);
    console.log('none', itemId, localStorage.items);
  },
  sync : function () {
    for (var itemId in TODOstorage.items) {
      var item = TODOstorage.items[itemId];
      TODOstorage.dealItem(item, itemId);
    }
  }
};

TODO = {
  item : null,
  board : null,
  syncmanager : TODOsync,
  template : function(){},
  init : function () {
    TODO.item = $('#new-item-script');
    TODO.board = $('#todo-list');
    TODO.template = Handlebars.compile(TODO.item.html());

    TODO.bindEvent();
    TODO.get();

    TODOstorage.init();
  },
  onofflineHandler : function () {
    if (navigator.onLine) {
      TODO.syncmanager = TODOsync;
      $('#header').removeClass('offline');
      TODOstorage.sync();
    } else {
      TODO.syncmanager = TODOstorage;
      $('#header').addClass('offline');
    }
  },
  add : function (sContents) {
    TODO.syncmanager.add(sContents, function (data) {
      var elNewItem = $(TODO.template({'item':{
        'todo':sContents,
        'id':data.insertId
      }}));
      TODO.board.append(elNewItem);
      elNewItem.css('opacity', 0);
      elNewItem.css('opacity');
      elNewItem.css('opacity', 1);
    });
  },
  get : function () {
    TODO.syncmanager.get(function (data) {
      data.sort(function (a, b) {
        if(a.id < b.id) {return -1;}
        else if(a.id > b.id) {return 1;}
        else {return 0;}
      });
      TODO.board.append(TODO.template({item:data}));
    })
  },
  remove : function () {
    var $cachedLi = $(this).closest('li');
    if (!$cachedLi) {return;}
    var itemId = $cachedLi.data('id');

    TODO.syncmanager.remove(itemId, function () {
      $cachedLi.css({
        'opacity': 0,
        'max-height': 0,
        'overflow': 'hidden'
      });
      var remove = function (event) {
        if (event.eventPhase !== 2) {
          return;
        }
        $cachedLi.remove();
      };
      $cachedLi.on('webkitTransitionEnd transitionend', remove);
    });
  },
  complete : function (e) {
    var $item = $(this);
    var itemId = $item.closest('li').data('id');
    var checked = $item.is(':checked');
    
    TODO.syncmanager.complete(itemId, checked, function () {
      $item.prop("checked", checked);
      $item.closest('li').toggleClass('completed', checked);
    });
    // e.preventDefault(); // 어차피 안 먹는다??
    // 성공하기 전까지는 checked 속성이 바뀌지 않았으면 했는데.
    // 심지어, TODOstorage.complete()에서 callback 부른 후에 깨지게(checked는 안바뀌고 complete만 바뀜) 만듦.
    // 이 줄 없애니까 잘 됨.
  },
  bindEvent : function () {
    $('#new-todo').on('keypress', function(e) {
      var ENTER_KEYCODE = 13;
      if(e.which !== ENTER_KEYCODE) {return;}
      var sContents = $('#new-todo').val();
      if(!sContents) {return;}
      TODO.add(sContents);
      $('#new-todo').val('');
    });
    $('#todo-list').on('click', 'input.toggle', TODO.complete);
    $('#todo-list').on('click', 'li:not(.deleting) button.destroy', TODO.remove);
    $('#filters a').on('click', HistoryFilter.clickFilter);
    $(window).on('popstate',HistoryFilter.popstateFilter);
    $(window).on('online offline',TODO.onofflineHandler);
  }
};

HistoryFilter = {
  filterInfo : {
    // Uncaught SecurityError: Failed to execute 'pushState' on 'History': A history state object with URL 'file:///2015-02-HTML5/active' cannot be created in a document with origin 'null'.
    // 일단 로컬에서 개발용.
    'index.html' : {'url':'index.html'},
    'active' : {'class':'all-active','url':'#active'},
    'completed' : {'class':'all-completed','url':'#completed'}
    // 실제 서버 올리면 테스트.
    // 'index.html' : {'url':'index.html'},
    // 'active' : {'class':'all-active','url':'active'},
    // 'completed' : {'class':'all-completed','url':'completed'}
  },
  clickFilter : function (e) {
    var $prevSelected = $('#filters a.selected');
    var $currentSelected = $(this);
    var prevFilter = $prevSelected.attr('href');
    var currentFilter = $currentSelected.attr('href');

    if ($currentSelected.is($prevSelected)) { return; } // 같은 필터를 클릭했을 때는 무시.
    HistoryFilter.changeView($currentSelected, currentFilter, $prevSelected, prevFilter);

    history.pushState({'filter':currentFilter},null,HistoryFilter.filterInfo[currentFilter]['url']);
    e.preventDefault();
  },
  popstateFilter : function (e) {
    var currentFilter = e.originalEvent.state['filter'];
    var $prevSelected = $('#filters a.selected');
    var $currentSelected = $('#filters a[href="'+currentFilter+'"]');
    var prevFilter = $prevSelected.attr('href');

    if ($currentSelected.is($prevSelected)) { return; } // 같은 필터를 클릭했을 때는 무시.
    HistoryFilter.changeView($currentSelected, currentFilter, $prevSelected, prevFilter);
  },
  changeView : function ($currentSelected, currentFilter, $prevSelected, prevFilter) {    
    var $list = $('#todo-list');
    $prevSelected.removeClass('selected');
    $currentSelected.addClass('selected');
    $list.removeClass(HistoryFilter.filterInfo[prevFilter]['class']);
    console.log('filter : '+currentFilter);
    console.log('class : '+HistoryFilter.filterInfo[currentFilter]['class']);
    $list.addClass(HistoryFilter.filterInfo[currentFilter]['class']);
  },
};

$(document).ready(function () {
  TODO.init();
});