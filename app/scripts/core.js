'use strict';

angular
  .module('pinterestClone', [
        'ngRoute',
        'ngCookies'
        ]
  )
  .factory('UserService', function($cookies) {
    var userInfo;

    return {
      getCurrentUserInfo : function(){
        if (!userInfo)
        {
          userInfo = JSON.parse($cookies.get('userInfo'));
        }

        return userInfo;
      },
      setCurrentUserInfo : function(value){
        userInfo = value;

        var expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 60);
        $cookies.put('userInfo', JSON.stringify(userInfo), {'expires' : expirationDate });
      },
      clearCurrentUserInfo: function() {
        userInfo = null;
        $cookies.remove('userInfo');
      }
    };
  })
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/settings', {
      templateUrl : 'views/settings/index.html',
      controller : 'SettingsCtrl'
    });

    $locationProvider.html5Mode(true);
  })
  .controller('SettingsCtrl', function($scope, $http, $location, UserService){
    $scope.user = {};
    if ($location.search().token != '')
    {
      var userInfo =  {
                        token : 'JWT ' + $location.search().token,
                        name  :  $location.search().name
                      };
      UserService.setCurrentUserInfo(userInfo);
      $scope.user.name = $location.search().name;
    }

    $scope.updateUser = function(){
      $http(
      {
        method: 'POST',
        url: '/api/users/update/',
        headers : headers
      })
      .then(function successCallback(response) {
          $scope.getMyBooks();
        },
        function errorCallback(response) {
          alert(response);
        }
      );
    }
  });