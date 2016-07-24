'use strict';

angular.module('pinterestClone')
.controller('LogoutCtrl', function(UserService, $location){
  UserService.clearCurrentUserInfo();

  $location.path('/');
});