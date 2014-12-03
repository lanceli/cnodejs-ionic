'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicCtrl
 * @description
 * # TopicCtrl
 * Topic Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicCtrl', function($scope, $rootScope, $stateParams, $timeout, $ionicLoading, $ionicActionSheet, $ionicScrollDelegate, $log, Topics, Topic, User) {
  $log.debug('topic ctrl', $stateParams);
  var id = $stateParams.id;
  var topic = Topics.getById(id);
  $scope.topic = topic;

  // track view
  if (window.analytics) {
    window.analytics.trackView('topic view');
  }

  $scope.loadTopic = function() {
    return Topic.getById(id).$promise.then(function(response) {
      $scope.topic = response.data;
    });
  };
  $scope.loadTopic();

  $scope.replyData  = {
    content: ''
  };

  // save reply
  $scope.saveReply = function() {
    $log.debug('new reply data:', $scope.replyData);
    $ionicLoading.show();
    Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
      $ionicLoading.hide();
      $log.debug('post reply response:', response);
      $scope.loadTopic().then(function() {
        $ionicScrollDelegate.scrollBottom();
      });
    }, $rootScope.requestErrorHandler);
  };

  // show actions
  $scope.showActions = function(reply) {
    var currentUser = User.getCurrentUser();
    if (currentUser.loginname === undefined || currentUser.loginname === reply.author.loginname) {
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
            $ionicLoading.show({
              noBackdrop: true,
              template: response.action === 'up' ? '点赞成功' : '点赞已取消',
              duration: 1000
            });
          }, $rootScope.requestErrorHandler({
            noBackdrop: true,
          }));
        }
        return true;
      }
    });
  };
});
