'use strict';

angular.module('pinterestClone')
.controller('PicsCtrl', function($scope, $http, UserService, $location){
  $scope.currentUser = UserService.getCurrentUserInfo();

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    $('.grid').masonry({
      // options
      itemSelector: '.grid-item',
      columnWidth: 330
    });
  });

  $scope.getPics = function(){
    $http(
    {
      method: 'GET',
      url: '/api/pics/all'
    })
    .then(function successCallback(response) {
        $scope.pics = response.data.pics;
      },
      function errorCallback(response) {
        alert(response);
      }
    );
  }

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

  $scope.getPics();
});