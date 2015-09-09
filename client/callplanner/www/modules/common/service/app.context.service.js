angular.module('callplanner.common')
.factory('AppContext', function() {
  var myNumber = "01093645432";
  var emailAddress = "minsookim@realnetworks.com";
  var emailPassword = "!Q2w#E4r";
  var enableSync = true;
  var alias = "MinSoo Kim";
  return { 
    // getMyEmail: function() {
    //   return "minsookim@realnetworks.com";
    // },
    // getMyEmailPassword: function() {
    //   return "!Q2w#E4r";
    // },
    getSyncEnabled: function() {
      return enableSync;
    },
    setSyncEnabled: function(enable) {
      enableSync = enable;
    },
    getMyNumber: function() {
      return myNumber;
    },
    setMyNumber: function(number) {
      myNumber = number;
    },
    getAlias: function() {
      return alias;
    },
    setAlias: function(_alias) {
      alias = _alias;
    },
    getEmailPassword: function() {
      return emailPassword;
    }, 
    setEmailPassword: function(_emailPass) {
      emailPassword = _emailPass;
    },
    getEmailAddress: function() {
      return emailAddress;
    },
    setEmailAddress: function(_emailAddr) {
      emailAddress = _emailAddr;
    }
  }
});