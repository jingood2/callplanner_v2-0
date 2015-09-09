// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'callplanner' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'callplanner.services' is found in services.js
// 'callplanner.controllers' is found in controllers.js
angular.module('callplanner', [
  'ionic',
  'config',
  'ui.router',
  'ngCordova', 
  'ngResource',
  'lbServices',
  'callplanner.common', 
  'callplanner.user',
  'callplanner.plan',
  'callplanner.setting',
  'ionic-datepicker',
  'ionic-timepicker'
  ])

.run(function($ionicPlatform, $cordovaSQLite) {

  {{$ionicPlatform}}
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
    
  });

  // $ionicPlatform.registerBackButtonAction(function (event) {
  //   console.log("OnDeviceReady");
  //                   event.preventDefault();
  //           }, 100);
  // var success = function(message) {
  //   console.log("Test");
  //       alert(message);

  //   };

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // , $ionicAppProvider

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider
  .state('router',{
    url:'/router',
    controller: 'RouteCtrl'
  })

  .state('login',{
    url: '/login',
    templateUrl: 'modules/user/view/login.html',
    controller: 'LoginCtrl'
  })

  .state('settings', {
    url: "/settings",
    templateUrl: "modules/setting/view/settings.html",
    controller: "SettingsCtrl"
  })

  .state('createplan', {
    url: "/createplan",
    views: {
      '': {
        templateUrl: "modules/plan/view/createPlan.html",
        controller: "CreatePlanCtrl"  
      }
    },
    params: {
      createtype: 'simple'
    }
  })

  .state('previousgreeting', {
    url: "/previousgreeting",
    templateUrl: "modules/plan/view/previous-greeting.html",
    controller: "PreviousGreetingCtrl"  
  })

  .state('record', {
    url: "/record",
    templateUrl: "modules/plan/view/record.html",
    controller: "RecordCtrl"  
  })

  .state('contacts', {
    url: "/contacts",
    templateUrl: "modules/plan/view/contacts.html",
    controller: "ContactsCtrl"
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "modules/common/view/tabs.html"
  })
  
  .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'modules/common/view/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
  .state('tab.plans', {
      url: '/plans',
      views: {
        'tab-plans': {
          templateUrl: 'modules/plan/view/plans.html',
          controller: 'PlansCtrl'
        }
      }
    })
  .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'modules/plan/view/history.html',
          controller: 'HistoryCtrl'
        }
      }
    })
  .state('tab.plan-detail', {
      url: '/plans/:plan',
      views: {
        'tab-plans': {
          templateUrl: 'modules/plan/view/plan-detail.html',
          controller: 'PlanDetailCtrl'
        }
      }
  })

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/home');
  
  $urlRouterProvider.otherwise('/router');

  // $ionicAppProvider.identify({
  //   // Your App ID
  //   app_id: 'dd0207b350b746622233d766ec15e694',
  //   // The public API key services will use for this app
  //   api_key: 'eb353ad21d7840769ddfbfdaf815a467b00e1e54a597c8bb',
  //   // Your GCM sender ID/project number (Uncomment if supporting Android)
  //   // gcm_id: '676639914279'
  // });

})

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


// .run(function($ionicPlatform, $cordovaPush) {

//   var androidConfig = {
//     "senderID": "676639914279"
//   };

//   var pushNotification = window.plugins.pushNotification;
//   console.log(pushNotification);
//   $ionicPlatform.ready(function(){
//     console.log("test");
//     $cordovaPush.register(androidConfig).then(function(result) {
//       console.log("success : " + JSON.stringify(result));
//     }, function(err) {
//       console.log("fail : " + JSON.stringify(err));
//     })

//     $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
//       switch(notification.event) {
//         case 'registered':
//           if (notification.regid.length > 0 ) {
//             alert('registration ID = ' + notification.regid);
//           }
//           break;

//         case 'message':
//           // this is the actual push notification. its format depends on the data model from the push server
//           alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
//           break;

//         case 'error':
//           alert('GCM error = ' + notification.msg);
//           break;

//         default:
//           alert('An unknown GCM event has occurred');
//           break;
//       }
//     });


//     // WARNING: dangerous to unregister (results in loss of tokenID)
//     // $cordovaPush.unregister(options).then(function(result) {
//       // Success!
//     // }, function(err) {
//       // Error
//     // })

//   });
// })
;
