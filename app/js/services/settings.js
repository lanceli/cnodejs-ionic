'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:SettingsService
 * @description
 * # SettingsService
 * Message Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Settings', function(ENV, $resource, $log, Storage) {
  var storageKey = 'settings';
  var settings = Storage.get(storageKey) || {
    sendFrom: false,
    saverMode: true
  };
  return {
    getSettings: function() {
      $log.debug('get settings', settings);
      return settings;
    },
    save: function() {
      Storage.set(storageKey, settings);
    }
  };
});
