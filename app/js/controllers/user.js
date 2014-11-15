'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:UserCtrl
 * @description
 * # UserCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('UserCtrl', function($scope, $log, $stateParams, User) {
  $log.log('user ctrl');
  var loginName = $stateParams.loginname;
  User.getUserInfo(loginName).$promise.then(function(response) {
    $scope.user = response.data;
  });
});
