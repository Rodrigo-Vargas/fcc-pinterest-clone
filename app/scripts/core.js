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
    .when('/', {
      templateUrl : 'views/pics/index.html',
      controller : 'PicsCtrl'
    })
    .when('/settings', {
      templateUrl : 'views/settings/index.html',
      controller : 'SettingsCtrl'
    });

    $locationProvider.html5Mode(true);
  })
  .controller('PicsCtrl', function($scope, UserService){
    $scope.currentUser = UserService.getCurrentUserInfo();
    
    //alert($scope.currentUser.name);
  })
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
                        name  :  $location.search().name
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
  });