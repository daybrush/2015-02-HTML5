var StateManager = {
  init : function(){
    this.onClickEvents();
    this.onStateEvents();    
  },
  onClickEvents : function(){
    $('#filters').on('click', 'a', function(e){
      e.preventDefault();

      var selectedState = $(e.target).attr('href');
      this.showState(selectedState);
      
      history.pushState({'method': selectedState}, null, selectedState);
    }.bind(this));
  },
  onStateEvents : function(){
    $(window).on('popstate',function(e){
      var selectedState = e.originalEvent.state.method;
      this.showState(selectedState); 
    }.bind(this));
  },
  showState : function(selectedState){
    $('#todo-list').removeClass().addClass('all-'+selectedState);
    $('#filters a').removeClass('selected').filter('a[href=\"'+ selectedState +'\"]').addClass('selected');
  }
}

$(document).ready(function(){
  StateManager.init();
});