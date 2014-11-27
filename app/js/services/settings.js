'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:SettingsService
 * @description
 * # SettingsService
 * Message Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Settings', function(ENV, $resource, $log, User) {
  var settings = {
    saverMode: true
  };
  return {
    getSettings: function() {
      $log.debug('get settings', settings);
      return settings;
    }
  };
});
