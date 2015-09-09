angular.module('callplanner.common')
.factory('Exchange', function($rootScope, AppContext) {
  return {
    create: function(data) {
      
      var success = function(message) {
        console.log("normal response from exchange integration");
        alert(message);
        $rootScope.$emit("SYNC_SUCC");
      };

      var failure = function(err) {
        console.log("abnormal response from exchange integration");
        alert(err);
        $rootScope.$emit("SYNC_FAIL");
      };
      
      console.log("try to sync to exchange server");

      exchange.create(data, success, failure);
      console.log("contents of data : " + JSON.stringify(data));
    
      return true;
    }
  };
})