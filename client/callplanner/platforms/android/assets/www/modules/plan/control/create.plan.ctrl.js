angular.module('callplanner.plan')
.controller('CreatePlanCtrl', function($rootScope, $scope, $http, $ionicHistory, $stateParams, $state, $ionicPopup, $location, Plan, LoopBackAuth, Subscriber, Contacts, Exchange, AppContext) {
    
  $scope.createtype = $stateParams.createtype;
  $scope.contactList = Contacts.getAll();
  
  var init = function() {
    console.log("test")
    Contacts.clear();
    $scope.contactList = Contacts.getAll();

    $scope.plan = {
      "callType": "time",
      "ment": {
        "container": LoopBackAuth.currentUserData == null ? "01093645432" : LoopBackAuth.currentUserData.tel,
        "file": "default.wav"
      },
      "scheduledAt": new Date(),
      "title": "",
      "repeat": "once",
      "enabled": true,
      "callState": "Disconnected",
      "attendees": [],
      "record": "false",
      "scheduledTo": new Date(new Date().getTime() + 3600000),
    };
  };

  init();

  // var refreshList = function() {
  //   $scope.contactList = Contacts.getAll();
  // };

  $scope.$on('$stateChangeSuccess', function () {
    $scope.contactList = Contacts.getAll();
  });  

  if($scope.createtype != 'advance') {
    $scope.plan.repeat = "now";
  };

  // $scope.$on('$stateChangeSuccess', function () {
  //   // console.log("stateChangeSuccess event called");
  //   // init();
  // });  

  $scope.removeNumber = function(tel) {
    Contacts.uncheck(tel);
  };

  $scope.prefilter = function(contactList) {
    var result = [];
    for(var i=0 ; i<contactList.length ; i++) {
      if(contactList[i].checked)
        result.push(contactList[i]);
    }
    return result;
  }

  $rootScope.$on('SYNC_SUCC', function(event, args) {
    alert("Succeeded to sync created plan to Exchange.");
  });

  $rootScope.$on('SYNC_FAIL', function(event, args) {
    alert("Failed to sync created plan to Exchange.");
  });

  $scope.group = 'advance';
  $scope.shownGroup = $stateParams.createtype;
  
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = 'simple';
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup == group;
  };

  var savedGreetingPopup;
  $scope.showGreetingMenu = function() {

   // An elaborate, custom popup
    var greetingPopup = $ionicPopup.show({
      templateUrl: 'modules/plan/view/greeting-select.html',
      title: 'Greeting',
      scope: $scope

    });
    greetingPopup.then(function(res) {
      console.log('res:' + JSON.stringify(res));
    });

    savedGreetingPopup = greetingPopup;
  };

  $scope.setGreeting = function(data) {
    $scope.plan.ment.file = data.file;
    savedGreetingPopup.close();
  };
  
  $rootScope.$on('record_done', function(event, args) {
    if(args[0] === true) {
      $scope.plan.ment.file = args[1];
    }
  });

  $scope.goBack = function() {
    init();
    $ionicHistory.goBack();
  };

  var validate = function() {
    if($scope.plan.repeat == "now") {
      $scope.plan.scheduledAt = new Date();  
    } 

    if($scope.plan.title == '') {
      $scope.plan.title = "Conference Call at " + $scope.plan.scheduledAt;
    }

    // $scope.plan.scheduledTo = new Date($scope.plan.scheduledAt.getTime() + 3600000);

    $scope.plan.attendees=[];
    $scope.plan.attendees.push({
      "role": "owner",
      "status": "absent",
      "name": AppContext.getAlias(),
      "tel": LoopBackAuth.currentUserData == null ? "01093645432" : LoopBackAuth.currentUserData.tel,
      "accept":"in",
      "connected":"false"
    });

    for(var i=0 ; i<$scope.contactList.length ; i++) {
      if($scope.contactList[i].checked) {
        console.log("added attendant : " + $scope.contactList[i].name + " " + $scope.contactList[i].tel);
        $scope.plan.attendees.push(
          {
            "role": "member",
            "status": "absent",
            "name": $scope.contactList[i].name,
            "tel": $scope.contactList[i].tel,
            "accept":"in",
            "connected":"false"
          }
        );
      }
    }

  };

  $scope.goPreviousGreetingPage = function() {
    savedGreetingPopup.close();
    $state.go('previousgreeting');
    // $location.path('/createplan/previousgreeting');
  };

  $scope.goRecordPage = function() {
    savedGreetingPopup.close();
    $state.go('record');
  };

  $scope.submit = function() {
    validate();
    // console.log("Plan to be created : " + JSON.stringify($scope.plan));
    Plan.create(
      $scope.plan,
      function(res){
        console.log("res for plan creation :" + JSON.stringify(res));
        if(AppContext.getSyncEnabled())
          Exchange.create(res);
      },
      function(err){
        console.log("error on create Plans - " + JSON.stringify(err));
        console.error(err);
      }
    );

    //file upload progress bar
    // var savedProgressPopup;
    // function() {
    //   var progressPopup = $ionicPopup.show({
    //     templateUrl: 'modules/plan/view/progress-popup.html',
    //     title: 'Uploading',
    //     scope: $scope

    //   });
    //   progressPopup.then(function(res) {
    //     console.log('res:' + JSON.stringify(res));
    //   });

    //   savedGreetingPopup = progressPopup;
    // }();

    // var fd = new FormData();
    // fd.append('file', $scope.plan.ment.file);
    // // $http.post('http://192.168.4.29:3003/api/v2/mentstorages/' + LoopBackAuth.currentUserData.tel + '/upload?access_token=' + LoopBackAuth.accessTokenId, fd, {
    //   $http.post('http://192.168.4.29:3003/api/v2/mentstorages/0220145559/upload?access_token=' + LoopBackAuth.accessTokenId, fd, {
    //   transformRequest: angular.identity,
    //   headers: {'Content-Type': undefined}
    // })
    //       .success(function (data, status, headers) {
    //         console.log('success : ' + JSON.stringify(data));
    //         console.log('success : ' + JSON.stringify(status));
    //         console.log('success : ' + JSON.stringify(headers));

    //           // $scope.ServerResponse = data;
    //       })
    //       .error(function (data, status, header, config) {
    //           console.log('err : ' + JSON.stringify(data));
    //           console.log('err : ' + JSON.stringify(status));
    //           console.log('err : ' + JSON.stringify(header));
    //           console.log('err : ' + JSON.stringify(config));

    //       });


    $rootScope.$emit('refresh-plan-list', [1]);
    
    $state.go('tab.plans');
    init();
  }

});