'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicService
 * @description
 * # TopicService
 * Topic Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topic', function(ENV, $resource, $log, User) {
  var resource =  $resource(ENV.api + '/topic/:id', {
    id: '@id',
  }, {
    reply: {
      method: 'post',
      url: ENV.api + '/topic/:id/replies'
    }
  });
  return {
    getById: function(id, callback) {
      resource.get({id: id}, function(response) {
        return callback && callback(response.data);
      });
    },
    saveReply: function(id, replyData, callback) {
      var currentUser = User.getCurrentUser();
      $log.debug('current user:', currentUser);
      resource.reply({
        id: id,
        accesstoken: currentUser.accesstoken
      }, replyData, function(response) {
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    }
  };
});
