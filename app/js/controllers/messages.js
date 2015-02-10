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

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('messages view');
    }

    // load messages
    loadMessages();
  });

  var loadMessages = function() {
    Messages.getMessages().$promise.then(function(response) {
      $scope.messages = response.data;
      if ($scope.messages.hasnot_read_messages.length === 0) {
        $rootScope.$broadcast('messagesMarkedAsRead');
      } else {
        Messages.markAll().$promise.then(function(response) {
          $log.debug('mark all response:', response);
          if (response.success) {
            $rootScope.$broadcast('messagesMarkedAsRead');
          }
        }, function(response) {
          $log.debug('mark all response error:', response);
        });
      }
    }, function(response) {
      $log.debug('get messages response error:', response);
    });
  };
});
