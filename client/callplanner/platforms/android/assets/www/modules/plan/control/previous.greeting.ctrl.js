angular.module('callplanner.plan')
.controller('PreviousGreetingCtrl', function($rootScope, $scope, $ionicHistory, $stateParams, $state, $ionicPopup, Plan, LoopBackAuth, Subscriber, Contacts) {

  $scope.files = [{title:"Weekly Meeting", time: "2015-03-01 13:00:01"},{title:"Daily", time: "2015-03-01 13:00:01"}, {title:"Conference call", time: "2015-03-01 13:00:01"}];

  $scope.goBack = function() {
    // console.log("my goback");
    // Contacts.revert();
    $ionicHistory.goBack();
  }
  $scope.selectPreviousGreeting = function() {
    console.log("selectPreviousGreeting clicked");
    $ionicHistory.goBack();
  };

  return;
});
