'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:TopicCtrl
 * @description
 * # TopicCtrl
 * Topic Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('TopicCtrl', function($scope, $stateParams, $log, Topics, Topic) {
  $log.debug('topic ctrl', $stateParams);
  var id = $stateParams.id;
  var topic = Topics.getById(id);
  $scope.topic = topic;
  Topic.get({id: id}, function(response) {
    $scope.topic = response.data;
  });
});
