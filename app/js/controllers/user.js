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

  // track view
  if (window.analytics) {
    window.analytics.trackView('user view');
  }

  User.getByLoginName(loginName).$promise.then(function(response) {
    $scope.user = response.data;
  });

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
