var OnlineSyncer = {
  destURL : "http://128.199.76.9:8002/minhyeok4dev/",

  save : function(text, callback){
    $.ajax({
      method: "PUT",
      url: this.destURL,
      data: {todo: text}
    }).done(function(res){
      callback(res)
    })
  },

  index : function(callback){
    $.get(this.destURL)
      .done(function(res){
        callback(res);
      });
  },

  complete : function(id, isCompleted, callback){
    $.post(this.destURL + id, {completed: +isCompleted})
      .done(function(res){
        callback(res);
      });
  },

  delete : function(id, callback){
    $.ajax({
      method: "DELETE",
      url: this.destURL + id
    }).done(function(res){
      callback(res);
    });
  }

}

var OfflineSyncer = {
  offlineHistory : [],

  save : function(text, callback){
    var id = new Date().toLocaleString();
    var query = "save-" + id + "-" + text;

    this.setItemToLocalForage(query, callback, { insertId: id });
  },

  index : function(callback){
    this.parseQueryFromLocalForage(callback);
  },

  complete : function(id, isCompleted, callback){
    var query = "complete-" + id + "-" + +isCompleted;

    this.setItemToLocalForage(query, callback, null);
  },

  delete : function(id, callback){
    var query = "delete-" + id;

    this.setItemToLocalForage(query, callback, null);
  },

  setItemToLocalForage : function(query, callback, params){
    localforage.getItem('offlineHistory').then(function(res){
      this.offlineHistory = res ? JSON.parse(res) : [];
      this.offlineHistory.unshift(query);

      localforage.setItem('offlineHistory', JSON.stringify(this.offlineHistory))
      .then(callback(params),
        function(err){
          this.offlineHistory.shift();
        }.bind(this));
    })
  },

  parseQueryFromLocalForage : function(callback){
    var parsedResult = [];
    
    localforage.getItem('offlineHistory').then(function(res){
      this.offlineHistory = JSON.parse(res).reverse();

      console.log(this.offlineHistory);

      for (oh of this.offlineHistory){
        switch (oh.split("-")[0]){
        case "save":
          parsedResult.push({
            id: oh.split("-")[1],
            todo: oh.split("-")[2]
          });
          break;
        case "complete":
          parsedResult.map(function(res) {
            if (res.id == oh.split("-")[1]){
              res["completed"] = parseInt(oh.split("-")[2]);
            }
          })
          break;
        case "delete":
          parsedResult.map(function(res) {
            if (res.id == oh.split("-")[1]){
              parsedResult.splice(parsedResult.indexOf(res),1);
            }
          })
          break;
        } 
      }
      callback(parsedResult.reverse());
    });
  },

  sync : function(){
    var syncedKeyHash = {};

    localforage.getItem('offlineHistory').then(function(res){
      this.offlineHistory = JSON.parse(res).reverse();
    
      var i = 0;
      var loop = function(){
        var oh = this.offlineHistory[i];

        switch (oh.split("-")[0]){
        case "save":
          OnlineSyncer.save(oh.split("-")[2], function(res){
            syncedKeyHash[oh.split("-")[1]] = res.insertId;
            if (res)
              loop();
          });
          break;
        case "complete":
          var id = !!syncedKeyHash[oh.split("-")[1]] ? syncedKeyHash[oh.split("-")[1]] : oh.split("-")[1];

          OnlineSyncer.complete(id, !!parseInt(oh.split("-")[2]), function(){
            if (i < this.offlineHistory.length)
              loop();
          });
          break;
        case "delete":
          var id = !!syncedKeyHash[oh.split("-")[1]] ? syncedKeyHash[oh.split("-")[1]] : oh.split("-")[1];

          OnlineSyncer.delete(id, function(){
            if (i < this.offlineHistory.length)
              loop();
          });
          break;
        } 

        i++;
      };
      loop();
    });

  localforage.clear();
  }
}