angular.module('callplanner.setting')
.factory('ExchangeAccountService', function($http, $rootScope, AppContext, Subscriber, LoopBackAuth) {
  return {
  	update: function(userId_, addr_, pwd_) {
      console.log("auth:" + userId_);
      console.log("addr_:" + addr_);
      console.log("pwd_:" + pwd_);

      var data = {
        exchangeEmail: addr_,
        exchangePassword: pwd_,
      };

      console.log("PUT " + '/api/v2/Subscribers/' + userId_ + '?access_token=' + LoopBackAuth.accessTokenId);
      console.log("data : " + JSON.stringify(data));

      $http.put('/api/v2/Subscribers/' + userId_ + '?access_token=' + LoopBackAuth.accessTokenId, data)
            .success(function (data, status, headers) {
              console.log('success : ' + JSON.stringify(data));
              console.log('success : ' + JSON.stringify(status));
              console.log('success : ' + JSON.stringify(headers));

                // $scope.ServerResponse = data;
            })
            .error(function (data, status, header, config) {
                console.log('err : ' + JSON.stringify(data));
                console.log('err : ' + JSON.stringify(status));
                console.log('err : ' + JSON.stringify(header));
                console.log('err : ' + JSON.stringify(config));

            });

  		return;
  	}
    
  };
})