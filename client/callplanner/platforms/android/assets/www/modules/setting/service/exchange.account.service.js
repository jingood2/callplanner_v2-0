angular.module('callplanner.setting')
.factory('ExchangeAccountService', function($http, $rootScope, AppContext, Subscriber, LoopBackAuth) {
  return {
  	update: function(userId_, addr_, pwd_) {
      // var obj = {exchangeEmail: _userId, _addr, exchangePassword: _pwd};
      // Subscriber.update(
      //   {
      //     where: {id: _userId}
      //   },
      //   obj,
    		// function(res) {
    		// 	console.log("res for update Exchange account : " + JSON.stringify(res));
    		// },
    		// function(err) {
    		// 	console.log("err for update Exchange account : " + JSON.stringify(err));
    		// }
      // );
      console.log("auth:" + userId_);
      console.log("addr_:" + addr_);
      console.log("pwd_:" + pwd_);
      // var update = $resource('/Subscribers/:userId?access_token='+LoopBackAuth.accessTokenId, {userId: '@userId'}, {
      //   update: {
      //     method: 'PUT'
      //   }
      // });
      // console.log("before update");
      // update.update({userId:userId_}, {exchangeEmail: addr_, exchangePassword: pwd_});
      // console.log("after update");

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

  //     $http.get('/api/v2/').
  // then(function(response) {
  //   // this callback will be called asynchronously
  //   // when the response is available
  // }, function(response) {
  //   // called asynchronously if an error occurs
  //   // or server returns response with an error status.
  // });

  		return;
  	}
    
  };
})