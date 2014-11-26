'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicsCtrl
 * @description
 * # TopicsCtrl
 * Topics Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicsCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $timeout, $state, $location, $log, Topics, Tabs) {
  $log.debug('topics ctrl', $stateParams);

  $scope.currentTab = Topics.currentTab();

  // check if tab is changed
  if ($stateParams.tab !== Topics.currentTab()) {
    $scope.currentTab = Topics.currentTab($stateParams.tab);
    // reset data if tab is changed
    Topics.resetData();
  }

  $scope.topics = Topics.getTopics();
  $scope.getItemHeight = function() {
    return 75;
  };

  // pagination
  $scope.hasNextPage = Topics.hasNextPage();
  $log.debug('page load, has next page ? ', $scope.hasNextPage);
  $scope.doRefresh = function() {
    $log.debug('do refresh');
    Topics.refresh().$promise.then(function(response) {
      $log.debug('do refresh complete');
      $scope.topics = response.data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadMore = function() {
    $log.debug('load more');
    Topics.pagination(function(response) {
      $log.debug('load more complete');
      $scope.hasNextPage = false;
      $timeout(function() {
        $scope.hasNextPage = Topics.hasNextPage();
        $log.debug('has next page ? ', $scope.hasNextPage);
      }, 100);
      $scope.topics = $scope.topics.concat(response.data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  // Create the new topic modal that we will use later
  $ionicModal.fromTemplateUrl('templates/newTopic.html', {
    tabs: Tabs,
    scope: $scope
  }).then(function(modal) {
    $scope.newTopicModal = modal;
  });

  $scope.newTopicData = {
    tab: 'share',
    title: '',
    content: ''
  };
  $scope.newTopicId;

  // save new topic
  $scope.saveNewTopic = function() {
    $log.debug('new topic data:', $scope.newTopicData);
    $ionicLoading.show();
    Topics.saveNewTopic($scope.newTopicData).$promise.then(function(response) {
      $ionicLoading.hide();
      $scope.newTopicId = response['topic_id'];
      $scope.closeNewTopicModal();
      $timeout(function() {
        $state.go('app.topic', {
          id: $scope.newTopicId
        });
        $timeout(function() {
          $scope.doRefresh();
        }, 300);
      }, 300);
    }, function(response) {
      $ionicLoading.hide();
      navigator.notification.alert(response.data.error_msg);
    });
  };
  $scope.$on('modal.hidden', function() {
    // Execute action
    if ($scope.newTopicId) {
      $timeout(function() {
        $location.path('/app/topic/' + $scope.newTopicId);
      }, 300);
    }
  });
  // show new topic modal
  $scope.showNewTopicModal = function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $scope.newTopicModal.show();
  };

  // close new topic modal
  $scope.closeNewTopicModal = function() {
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
    $scope.newTopicModal.hide();
  };
});
