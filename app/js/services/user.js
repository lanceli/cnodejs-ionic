'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:UserService
 * @description
 * # UserService
 * User Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('User', function(ENV, $resource, $log) {
  var user = {};
  var resource =  $resource(ENV.api + '/accesstoken', {
    accesstoken: ''
  });
  var userResource =  $resource(ENV.api + '/user/:loginname', {
    loginname: ''
  });
  return {
    login: function(accesstoken, callback) {
      var $this = this;
      resource.save({
        accesstoken: accesstoken
      }, function(response) {
        $log.debug('post accesstoken:', response);
        $this.getUserInfo(response.loginname, function(r) {
          user = r.data;
          user.accesstoken = accesstoken;
        });
        user.loginname = response.loginname;
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    },
    getCurrentUser: function() {
      return user;
    },
    getUserInfo: function(loginName, callback) {
      if (user && loginName === user.loginname) {
        $log.debug('get user info from storage:', user);
        return callback && callback({
          data: user
        });
      }
      userResource.get({
        loginname: loginName
      }, function(response) {
        $log.debug('get user info:', response);
        return callback && callback(response);
      }, function(response) {
        return callback && callback(response);
      });
    }
  };
});
