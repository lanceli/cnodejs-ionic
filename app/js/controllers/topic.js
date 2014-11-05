'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicCtrl
 * @description
 * # TopicCtrl
 * Topic Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $log, Topics, Topic) {
  $log.debug('topic ctrl', $stateParams);
  var id = $stateParams.id;
  var topic = Topics.getById(id);
  $scope.topic = topic;

  $scope.loadTopic = function() {
    Topic.getById(id, function(response) {
      $scope.topic = response;
    });
  };
  $scope.loadTopic();

  $scope.replyData  = {};
  // Create the new topic modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reply.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.replyModal = modal;
  });

  // show reply modal
  $scope.showReplyModal = function() {
    $scope.replyModal.show();
  };

  // close reply modal
  $scope.closeReplyModal = function() {
    $scope.replyModal.hide();
  };

  // save reply
  $scope.saveReply = function() {
    $log.debug('new reply data:', $scope.replyData);
    $ionicLoading.show({
      template: 'Loading...'
    });
    Topic.saveReply(id, $scope.replyData, function(response) {
      $ionicLoading.hide();
      $log.debug('post reply response:', response);
      if (response.success) {
        $scope.loadTopic();
        $scope.closeReplyModal();
      } else {
        alert(response.data['error_msg']);
      }
    });
  };
});
