'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:UserService
 * @description
 * # UserService
 * User Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('User', function(ENV, $resource, $log, $q) {
  var user = {};
  var resource =  $resource(ENV.api + '/accesstoken', {
    accesstoken: ''
  });
  var userResource =  $resource(ENV.api + '/user/:loginname', {
    loginname: ''
  });
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
        });
        user.loginname = response.loginname;
      });
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
