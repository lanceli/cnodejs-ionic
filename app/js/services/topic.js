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
    },
    upReply: {
      method: 'post',
      url: ENV.api + '/reply/:id/ups'
    }
  });
  return {
    getById: function(id) {
      return resource.get({id: id});
    },
    saveReply: function(id, replyData) {
      var currentUser = User.getCurrentUser();
      return resource.reply({
        id: id,
        accesstoken: currentUser.accesstoken
      }, replyData
      );
    },
    upReply: function(id) {
      var currentUser = User.getCurrentUser();
      return resource.upReply({
        id: id,
        accesstoken: currentUser.accesstoken
      });
    }
  };
});
