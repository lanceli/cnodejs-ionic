'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:StorageService
 * @description
 * # StorageService
 * Storage Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Storage', function(ENV, $log) {

  return {
    set: function(key, data) {
      return window.localStorage.setItem(key, window.JSON.stringify(data));
    },
    get: function(key) {
      return window.JSON.parse(window.localStorage.getItem(key));
    },
    remove: function(key) {
      return window.localStorage.removeItem(key);
    }
  };
});

