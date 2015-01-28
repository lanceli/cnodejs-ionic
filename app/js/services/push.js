'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:PushService
 * @description
 * # PushService
 * Push Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Push', function(ENV, $log) {
  var push;
  return {
    setBadge: function(badge) {
      if (push) {
        $log.debug('jpush: set badge', badge);
        plugins.jPushPlugin.setBadge(badge);
      }
    },
    setAlias: function(alias) {
      if (push) {
        $log.debug('jpush: set alias', alias);
        plugins.jPushPlugin.setAlias(alias);
      }
    },
    check: function() {
      if (window.jpush && push) {
        plugins.jPushPlugin.receiveNotificationIniOSCallback(window.jpush);
        window.jpush = null;
      }
    },
    init: function(notificationCallback) {
      push = window.plugins && window.plugins.jPushPlugin;
      if (push) {
        $log.debug('jpush: init');
        plugins.jPushPlugin.init();
        plugins.jPushPlugin.setDebugMode(ENV.debug);
        plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
        plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
      }
    }
  };
});
