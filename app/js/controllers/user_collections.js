'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:UserCollectionsCtrl
 * @description
 * # UserCollectionsCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('UserCollectionsCtrl', function($scope, $rootScope, $log, $stateParams, $state, User) {
  $log.log('user ctrl');
  var loginName = $stateParams.loginname;

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('user collections view');
    }
  });

  $scope.user = User.getCurrentUser();
});
