'use strict';

angular
  .module('pinterestClone', [
        'ngRoute',
        'ngCookies'
        ]
  )
  .directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
    }
  })
  .factory('UserService', function($cookies) {
    var userInfo;

    return {
      getCurrentUserInfo : function(){
        if (!userInfo)
        {
          if ($cookies.get('userInfo'))
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
      templateUrl : 'views/pics/board.html',
      controller : 'PicsCtrl'
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'UserCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'UserCtrl'
    })
    .when('/logout', {
      controller : 'LogoutCtrl',
      templateUrl : 'views/logout.html'
    })
    .when('/auth/twitter',{
      redirectTo: function(obj, requestedPath) {
        window.location.href = '/auth/twitter';
      }
    })
    .when('/myboard',{
      templateUrl: 'views/pics/myboard.html',
      controller: 'MyBoardCtrl'
    })
    .when('/board/:boardId',{
      templateUrl: 'views/pics/board.html',
      controller: 'PicsCtrl'
    })
    .when('/pics/my/add',{
      templateUrl: 'views/pics/add.html',
      controller: 'AddPicsCtrl'
    })
    .when('/settings', {
      templateUrl : 'views/settings/index.html',
      controller : 'SettingsCtrl'
    })
    .when('/settings/:token', {
      templateUrl : 'views/settings/index.html',
      controller : 'SettingsCtrl'
    });

    $locationProvider.html5Mode(true);
  });