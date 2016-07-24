'use strict';

angular.module('pinterestClone')
.controller('SettingsCtrl', function($scope, $http, $location, UserService){
  $scope.currentUser = UserService.getCurrentUserInfo();

  $scope.loading = 0;

  /*if (!$scope.currentUser)
  {
    $location.path('/login');
    return;
  }*/

  $scope.user = {};

  if ($location.search().token != '')
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
        $location.url($location.path());
        $location.path('/');
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }
})