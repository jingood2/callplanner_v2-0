angular.module('callplanner.setting')
.controller('SettingsCtrl', function($scope, $ionicHistory, AppContext, LoopBackAuth, ExchangeAccountService) {
  
  $scope.$on('$ionicView.enter', function(){
    $scope.setting_obj = {
      emailAddress: AppContext.getEmailAddress(),
      emailPassword: AppContext.getEmailPassword(),
      alias: AppContext.getAlias(),
      syncExchange: AppContext.getSyncEnabled()
    };
  });

  $scope.submit = function() {
  	AppContext.setAlias($scope.setting_obj.alias);
		AppContext.setEmailAddress($scope.setting_obj.emailAddress);
		AppContext.setEmailPassword($scope.setting_obj.emailPassword);
		AppContext.setSyncEnabled($scope.setting_obj.syncExchange);

		// // Updating exchange account to server
		ExchangeAccountService.update(LoopBackAuth.currentUserId, $scope.setting_obj.emailAddress, $scope.setting_obj.emailPassword);
    
	 $ionicHistory.goBack();
	};
});