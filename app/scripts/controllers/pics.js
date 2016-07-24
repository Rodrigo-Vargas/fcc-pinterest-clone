'use strict';

angular.module('pinterestClone')
.controller('PicsCtrl', function($scope, $http, UserService, $location){
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

  $scope.addPic = function(){
    $http(
    {
      method: 'POST',
      url: '/api/pics/add',
      headers : headers,
      data : { image : $scope.image }
    })
    .then(function successCallback(response) {
        $location.path('/myboard')
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }
});