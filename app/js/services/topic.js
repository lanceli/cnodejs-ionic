'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicService
 * @description
 * # TopicService
 * Topic Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topic', function(ENV, $resource) {
  return $resource(ENV.api + '/topic/:id', {
    id: '@id',
    mdrender: true
  },
  {
    cache: true
  });
});
