'use strict';

angular.module('pinterestClone')
.controller('TwitterCtrl', function($scope, $http, $location, UserService, $routeParams){

  var headers = {
    'Authorization': 'JWT ' + $routeParams.token,
    'Accept': 'application/json;odata=verbose'
  };

  $scope.getCurrentUser = function() {
    $http(
    {
      method: 'GET',
      url: '/api/users/getCurrent',
      headers : headers
    })
    .then(function successCallback(response) {
        UserService.setCurrentUserInfo( 
                                        {
                                          name : response.data.user.name,
                                          token : response.data.user.token,
                                          id :  response.data.user.id
                                        }
                                      );
        $location.path('/');
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

  $scope.getCurrentUser();
});