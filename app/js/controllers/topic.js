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

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('topic view');
    }
  });

  // load topic data
  $scope.loadTopic = function(reload) {
    var topicResource;
    if (reload === true) {
      topicResource = Topic.get(id);
    } else {
      topicResource = Topic.getById(id);
    }
    return topicResource.$promise.then(function(response) {
        $scope.topic = response.data;
      }, $rootScope.requestErrorHandler({
        noBackdrop: true
      }, function() {
        $scope.loadError = true;
      })
    );
  };
  $scope.loadTopic();

  // do refresh
  $scope.doRefresh = function() {
    return $scope.loadTopic(true).then(function(response) {
        $log.debug('do refresh complete');
      }, function() {
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.replyData = {
    content: ''
  };

  // save reply
  $scope.saveReply = function() {
    $log.debug('new reply data:', $scope.replyData);
    $ionicLoading.show();
    Topic.saveReply(id, $scope.replyData).$promise.then(function(response) {
      $ionicLoading.hide();
      $scope.replyData.content = '';
      $log.debug('post reply response:', response);
      $scope.loadTopic(true).then(function() {
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
    var upLabel = '赞';
    // detect if current user already do up
    if (reply.ups.indexOf(currentUser.id) !== -1) {
      upLabel = '已赞';
    }
    var replyContent = '@' + reply.author.loginname;
    $ionicActionSheet.show({
      buttons: [
        {text: '回复'},
        {text: upLabel}
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
