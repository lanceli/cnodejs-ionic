'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicsCtrl
 * @description
 * # TopicsCtrl
 * Topics Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicsCtrl', function($scope, $stateParams, $timeout, $log, Topics) {
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
    Topics.refresh(function(response) {
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
});
