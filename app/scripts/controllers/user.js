'use strict';

angular.module('pinterestClone')
.controller('UserCtrl', function($scope, $http, UserService, $location){
  $scope.currentUser = UserService.getCurrentUserInfo();

  if ($scope.currentUser)
      $location.path('/');

  $scope.signup = function() {
    if ($scope.formData.email != undefined
        && $scope.formData.password != undefined) {
      $scope.loading = true;

      $http.post('/api/signup', $scope.formData)

      .then(function successCallback(response) {
          if (response.data.success == true){
            UserService.setCurrentUserInfo(response.data.user);

            $location.path("/");
          }
          else
          {
            $scope.message = response.data.message;
          }
        }, function errorCallback(response) {
          alert(response.data);
        });
    }
  }

  $scope.login = function() {
    if ($scope.formData.email == undefined
        || $scope.formData.password == undefined)
      return;

    $scope.loading = true;

    $http.post('/api/login', $scope.formData)

    .then(
      function successCallback(response) {
        if (response.data.success == true){
          UserService.setCurrentUserInfo(response.data.user);

          $location.path("/");
        }
        else
        {
          $scope.message = response.data.message;
        }
      }, 
      function errorCallback(response) {
        alert(response.data);
      }
    );    
  } 
});