angular.module('callplanner.user')
.controller('LoginCtrl',function($ionicPlatform, $scope, $ionicModal, Subscriber, LoopBackAuth, $location, AppContext){

  $ionicPlatform.registerBackButtonAction(function(e){
    ionic.Platform.exitApp();
  },101);

  $ionicModal.fromTemplateUrl('modules/user/view/modal-signup.html', {

    id: '2',      
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModal2 = modal;
  });

  $scope.closeModal = function(index) {
    if(index == 1) $scope.oModal1.hide();
    else
      $scope.oModal2.hide();
  };

  $scope.hideAll = function() {
    $scope.oModal2.hide();
  }

  $scope.showModal = function(index) {
    if(index == 1) $scope.oModal1.show();
    else
      $scope.oModal2.show();
  };

  $scope.$on('$destroy', function(){
    console.log('Destroying modals.....');
    // $scope.oModal1.remove();
    $scope.oModal2.remove();
  });

  $scope.$on('modal.shown', function(event, modal){

  });

  $scope.$on('modal.hidden', function(event, modal){

  });

  var TWO_WEEKS = 1000 * 60 *60 * 24 * 7 *2;

  $scope.credentials = {
    ttl: TWO_WEEKS,
    rememberMe :  true
  };

  $scope.call = function(p_num) {
    window.open('tel:'+p_num, '_system', 'location=yes');
  };

  $scope.login = function() {
    console.log("Trying to login");
    Subscriber.login({
      include: 'user',
      rememberMe: $scope.credentials.rememberMe
    },$scope.credentials,function(res){
      console.log("Success to login - " + JSON.stringify(res));
      AppContext.setMyNumber(LoopBackAuth.currentUserData.tel);
      var next = $location.nextAfterLogin || '/';
      $location.nextAfterLogin = null;

      if(next === '/login') {
        next = '/';
      }

     $scope.hideAll();

     $location.path('/tab/home');

    },function(res){

      console.log("Error on login - " + JSON.stringify(res));

    });

  };

});