'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:UserService
 * @description
 * # UserService
 * User Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('User', function(ENV, $resource, $log, $q, Storage) {
  var storageKey = 'user';
  var resource = $resource(ENV.api + '/accesstoken', {
    accesstoken: ''
  });
  var userResource = $resource(ENV.api + '/user/:loginname', {
    loginname: ''
  });
  var user = Storage.get(storageKey) || {};
  return {
    login: function(accesstoken) {
      var $this = this;
      return resource.save({
        accesstoken: accesstoken
      }, function(response) {
        $log.debug('post accesstoken:', response);
        user.accesstoken = accesstoken;
        $this.getUserInfo(response.loginname).$promise.then(function(r) {
          user = r.data;
          user.accesstoken = accesstoken;
          Storage.set(storageKey, user);
        });
        user.loginname = response.loginname;
      });
    },
    logout: function() {
      user = {};
      Storage.remove(storageKey);
    },
    getCurrentUser: function() {
      return user;
    },
    getUserInfo: function(loginName) {
      var userDefer = $q.defer();
      if (user && loginName === user.loginname) {
        $log.debug('get user info from storage:', user);
        userDefer.resolve({
          data: user
        });
        return {
          $promise: userDefer.promise
        };
      }
      return userResource.get({
        loginname: loginName
      }, function(response) {
        $log.debug('get user info:', response);
      });
    }
  };
});
