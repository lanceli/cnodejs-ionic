'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicCtrl
 * @description
 * # TopicCtrl
 * Topic Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $ionicActionSheet, $log, Topics, Topic) {
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
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $scope.replyData.content = '';
    $scope.replyData.reply_id = '';
    $scope.replyModal.show();
  };

  // close reply modal
  $scope.closeReplyModal = function() {
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
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

  // show actions
  $scope.showActions = function(reply) {
    $log.debug('action reply:', reply);
    var replyContent = '@' + reply.author.loginname;
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: '回复'},
        {text: '赞'}
      ],
      titleText: replyContent,
      cancel: function() {
      },
      buttonClicked: function(index) {

        // reply to someone
        if (index === 0) {
          $scope.replyData.content = replyContent + ' ';
          $scope.replyData.reply_id = reply.id;
          $scope.replyModal.show();
        }

        // up reply
        if (index === 1) {
          Topic.upReply(reply.id, function(response) {
            $log.debug('up reply response:', response);
            if (response.success) {
              alert('done');
            } else {
              alert(response.data['error_msg']);
            }
          });
        }
        return true;
      }
    });
  };
});
