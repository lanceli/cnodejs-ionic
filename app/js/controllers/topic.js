'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicCtrl
 * @description
 * # TopicCtrl
 * Topic Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicActionSheet, $ionicScrollDelegate, $log, Topics, Topic, User) {
  $log.debug('topic ctrl', $stateParams);
  var id = $stateParams.id;
  var topic = Topics.getById(id);
  $scope.topic = topic;

  $scope.loadTopic = function() {
    return Topic.getById(id).$promise.then(function(response) {
      $scope.topic = response.data;
    });
  };
  $scope.loadTopic();

  $scope.replyData  = {};

  // save reply
  $scope.saveReply = function() {
    $log.debug('new reply data:', $scope.replyData);
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log();
    Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
      $ionicLoading.hide();
      $log.debug('post reply response:', response);
      $scope.loadTopic().then(function() {
        $ionicScrollDelegate.scrollBottom();;
      });
    }, function(response) {
      $ionicLoading.hide();
      navigator.notification.alert(response.data.error_msg);
    });
  };

  // show actions
  $scope.showActions = function(reply) {
    if (User.getCurrentUser() == undefined) {
      return;
    }
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
          $timeout(function() {
            document.querySelector('.reply-new input').focus();
          }, 1);
        }

        // up reply
        if (index === 1) {
          Topic.upReply(reply.id).$promise.then(function(response) {
            $log.debug('up reply response:', response);
            navigator.notification.alert(response.action === 'up' ? '点赞成功' : '点赞取消');
          }, function(response) {
            navigator.notification.alert(response.data.error_msg);
          });
        }
        return true;
      }
    });
  };
});
