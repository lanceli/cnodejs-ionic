'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:MessageService
 * @description
 * # MessageService
 * Message Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Message', function(ENV, $resource, $log, User) {
  var messages = {};
  var messagesCount = {};
  var resource =  $resource(ENV.api + '/messages', {
    accesstoken: ''
  }, {
    count: {
      method: 'get',
      url: ENV.api + '/message/count'
    }
  });
  return {
    getMessageCount: function(callback) {
      $log.debug('get messages count');
      var currentUser = User.getCurrentUser();
      $log.debug('current user:', currentUser);
      resource.count({
        accesstoken: currentUser.accesstoken
      }, function(response) {
        $log.debug('messages count:', response.data);
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    },
    getMessages: function() {
      return messages;
    }
  };
});
