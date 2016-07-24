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

  $scope.getMyPics = function(){
    $http(
    {
      method: 'GET',
      url: '/api/pics/user/' + $scope.currentUser.id,
      headers : headers
    })
    .then(function successCallback(response) {
        $scope.pics = response.data.pics;
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

  $scope.removePic = function(picId){
    $http(
    {
      method: 'POST',
      url: '/api/pics/destroy/'+ picId,
      headers : headers
    })
    .then(function successCallback(response) {
        $scope.getMyPics();
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

  $scope.getMyPics();
})