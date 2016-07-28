'use strict';

angular.module('pinterestClone')
.controller('SettingsCtrl', function($scope, $http, $location, UserService, $routeParams){
  $scope.currentUser = UserService.getCurrentUserInfo();

  $scope.loading = 0;

  if (!$scope.currentUser && !$routeParams.token)
  {
    $location.path('/login');
    return;
  }

  $scope.user = {};

  var headers = {
    'Authorization': $scope.currentUser.token,
    'Accept': 'application/json;odata=verbose'
  };

  $scope.updateUser = function(){
    $http(
    {
      method: 'POST',
      url: '/api/users/update/',
      headers : headers,
      data : { user : $scope.user }
    })
    .then(function successCallback(response) {
        UserService.setCurrentUserInfo(response.data.user);
        $location.url($location.path());
        $location.path('/');
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

  $scope.getCurrentUser = function() {
    $http(
    {
      method: 'GET',
      url: '/api/users/getCurrent',
      headers : headers
    })
    .then(function successCallback(response) {
        $scope.user = response.data.user
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

  if ($routeParams.token)
  {
    var userInfo =  {
                      token : 'JWT ' + $location.search().token,
                      name  :  $location.search().name,
                      id : $location.search().userId
                    };

    UserService.setCurrentUserInfo(userInfo);
    $scope.currentUser = UserService.getCurrentUserInfo();
    $scope.user.name = $location.search().name;
  }
  else
  {
    $scope.getCurrentUser();
  }
})