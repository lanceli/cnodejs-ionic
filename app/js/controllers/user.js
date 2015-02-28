'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:UserCtrl
 * @description
 * # UserCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('UserCtrl', function($scope, $rootScope, $log, $stateParams, $state, User) {
  $log.log('user ctrl');
  var loginName = $stateParams.loginname;

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('user view');
    }

    // load user data
    $scope.loadUser(true);
  });

  // load user data
  $scope.loadUser = function(reload) {
    var userResource;
    if (reload === true) {
      userResource = User.get(loginName);
    } else {
      userResource = User.getByLoginName(loginName);
    }
    return userResource.$promise.then(function(response) {
      $scope.user = response.data;
    });
  };

  // do refresh
  $scope.doRefresh = function() {
    return $scope.loadUser(true).then(function(response) {
        $log.debug('do refresh complete');
      }, function() {
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // reload user info from server if is current user view
  var currentUser = User.getCurrentUser();
  if (loginName === currentUser.loginname) {
    User.get(loginName).$promise.then(function(response) {
      $scope.user = response.data;
    });
  }

  // logout action
  $scope.logout = function() {
    $log.debug('logout button action');
    User.logout();
    $rootScope.$broadcast('logout');

    // track event
    if (window.analytics) {
      window.analytics.trackEvent('User', 'logout');
    }
  };
});
