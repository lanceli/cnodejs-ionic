'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicsCtrl
 * @description
 * # TopicsCtrl
 * Topics Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicsCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicModal, $timeout, $state, $location, $log, Topics, Tabs) {
  $log.debug('topics ctrl', $stateParams);

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('topics view');
    }
  });

  $scope.currentTab = Topics.currentTab();

  // check if tab is changed
  if ($stateParams.tab !== Topics.currentTab()) {
    $scope.currentTab = Topics.currentTab($stateParams.tab);
    // reset data if tab is changed
    Topics.resetData();
  }

  $scope.topics = Topics.getTopics();

  // pagination
  $scope.hasNextPage = Topics.hasNextPage();
  $scope.loadError = false;
  $log.debug('page load, has next page ? ', $scope.hasNextPage);
  $scope.doRefresh = function() {
    Topics.currentTab($stateParams.tab);
    $log.debug('do refresh');
    Topics.refresh().$promise.then(function(response) {
        $log.debug('do refresh complete');
        $scope.topics = response.data;
        $scope.hasNextPage = true;
        $scope.loadError = false;
      }, $rootScope.requestErrorHandler({
        noBackdrop: true
      }, function() {
        $scope.loadError = true;
      })
    ).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.loadMore = function() {
    $log.debug('load more');
    Topics.pagination().$promise.then(function(response) {
        $log.debug('load more complete');
        $scope.hasNextPage = false;
        $scope.loadError = false;
        $timeout(function() {
          $scope.hasNextPage = Topics.hasNextPage();
          $log.debug('has next page ? ', $scope.hasNextPage);
        }, 100);
        $scope.topics = $scope.topics.concat(response.data);
      }, $rootScope.requestErrorHandler({
        noBackdrop: true
      }, function() {
        $scope.loadError = true;
      })
    ).finally(function() {
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
    }, $rootScope.requestErrorHandler);
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

    // track view
    if (window.analytics) {
      window.analytics.trackView('new topic view');
    }

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
