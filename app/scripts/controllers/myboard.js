'use strict';

angular.module('pinterestClone')
.controller('MyBoardCtrl', function($scope, $location, $http, UserService){
  $scope.currentUser = UserService.getCurrentUserInfo();
  
  if (!$scope.currentUser)
  {
    $location.path('/login');
    return;
  }

  var headers = {
    'Authorization': $scope.currentUser.token,
    'Accept': 'application/json;odata=verbose'
  };

  $http(
    {
      method: 'GET',
      url: '/api/pics/user/' + $scope.currentUser.id,
      headers : headers
    })
    .then(function successCallback(response) {
        
      },
      function errorCallback(response) {
        alert(response);
      }
    );
})