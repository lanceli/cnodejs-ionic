'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicService
 * @description
 * # TopicService
 * Topic Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topic', function(ENV, $resource, $log, $q, User, Settings) {
  var topic;
  var resource =  $resource(ENV.api + '/topic/:id', {
    id: '@id',
  }, {
    reply: {
      method: 'post',
      url: ENV.api + '/topic/:topicId/replies'
    },
    upReply: {
      method: 'post',
      url: ENV.api + '/reply/:replyId/ups'
    }
  });
  return {
    getById: function(id) {
      if (topic !== undefined && topic.id === id) {
        var topicDefer = $q.defer();
        topicDefer.resolve({
          data: topic
        });
        return {
          $promise: topicDefer.promise
        };
      }
      return this.get(id);
    },
    get: function(id) {
      return resource.get({id: id}, function(response) {
        topic = response.data;
      });
    },
    saveReply: function(topicId, replyData) {
      var reply = angular.extend({}, replyData);
      var currentUser = User.getCurrentUser();
      // add send from
      if (Settings.getSettings().sendFrom) {
        reply.content = replyData.content + '\n 自豪地采用 [CNodeJS ionic](https://github.com/lanceli/cnodejs-ionic)';
      }
      return resource.reply({
        topicId: topicId,
        accesstoken: currentUser.accesstoken
      }, reply
      );
    },
    upReply: function(replyId) {
      var currentUser = User.getCurrentUser();
      return resource.upReply({
        replyId: replyId,
        accesstoken: currentUser.accesstoken
      }, null, function(response) {
        if (response.success) {
          angular.forEach(topic.replies, function(reply, key) {
            if (reply.id === replyId) {
              if (response.action === 'up') {
                reply.ups.push(currentUser.id);
              } else {
                reply.ups.pop();
              }
            }
          });
        }
      }
      );
    }
  };
});
