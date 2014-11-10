'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:MessagesService
 * @description
 * # MessagesService
 * Message Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Messages', function(ENV, $resource, $log, User) {
  var messages = {};
  var messagesCount = 0;
  var resource =  $resource(ENV.api + '/messages', {
    accesstoken: ''
  }, {
    count: {
      method: 'get',
      url: ENV.api + '/message/count'
    },
    markAll: {
      method: 'post',
      url: ENV.api + '/message/mark_all'
    }
  });
  return {
    currentMessageCount: function() {
      return messagesCount;
    },
    getMessageCount: function(callback) {
      $log.debug('get messages count');
      var currentUser = User.getCurrentUser();
      $log.debug('current user:', currentUser);
      resource.count({
        accesstoken: currentUser.accesstoken
      }, function(response) {
        $log.debug('messages count:', response);
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    },
    getMessages: function(callback) {
      $log.debug('get messages');
      var currentUser = User.getCurrentUser();
      $log.debug('current user:', currentUser);
      resource.get({
        accesstoken: currentUser.accesstoken
      }, function(response) {
        $log.debug('messages:', response.data);
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
      return messages;
    },
    markAll: function(callback) {
      $log.debug('mark all as read');
      var currentUser = User.getCurrentUser();
      $log.debug('current user:', currentUser);
      resource.markAll({
        accesstoken: currentUser.accesstoken
      }, function(response) {
        $log.debug('marked messages as read:', response);
        messagesCount = 0;
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    }
  };
});
