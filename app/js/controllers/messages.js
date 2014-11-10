'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('MessagesCtrl', function($scope, $log, $stateParams, $rootScope, Messages) {
  $log.log('messages ctrl');
  Messages.getMessages(function(response) {
    $scope.messages = response.data;
    if ($scope.messages.hasnot_read_messages.length > 0) {
      Messages.markAll(function(response) {
        $log.debug('mark all response:', response);
        if (response.success) {
          $rootScope.$broadcast('messagesMarkedAsRead');
        }
      });
    }
  });
});
