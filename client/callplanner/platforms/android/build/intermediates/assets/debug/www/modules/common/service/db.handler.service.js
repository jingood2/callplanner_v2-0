angular.module('callplanner.common')
.factory('DBHandlerService', function(){
  return {
    createdb: function() {
    	db = $cordovaSQLite.openDB("callplanner.db");
	    $cordovaSQLite.execute(db, 
	      "CREATE TABLE IF NOT EXISTS plan_list (id integer primary key, title text, scheduledAt text)");
	},
    getPhoneNumber: function() {

    },
    getPlanList: function() {
      
    }
  }
});