'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:AppCtrl
 * @description
 * # AppCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('AppCtrl', function(ENV, $scope, $log, $timeout, $rootScope, $ionicModal, $ionicLoading, Tabs, User, Messages, Settings) {
  $log.log('app ctrl');

  // environment config
  $scope.ENV = ENV;

  // get current user
  var currentUser = User.getCurrentUser();
  $scope.loginName = currentUser.loginname || null;

  // get user settings
  $scope.settings = Settings.getSettings();

  // error handler
  var errorMsg = {
    0: '网络出错啦，请再试一下',
    'wrong accessToken': '授权失败'
  };
  $rootScope.requestErrorHandler = function(options, callback) {
    return function(response) {
      var error;
      if (response.data && response.data.error_msg) {
        error = errorMsg[response.data.error_msg];
      } else {
        error = errorMsg[response.status] || 'Error: ' + response.status + ' ' + response.statusText;
      }
      var o = options || {};
      angular.extend(o, {
        template: error,
        duration: 1000
      });
      $ionicLoading.show(o);
      return callback && callback();
    };
  };

  var setBadge = function(num) {
    // Promot permission request to show badge notifications
    if (window.cordova && window.cordova.plugins.notification.badge) {
      cordova.plugins.notification.badge.hasPermission(function (granted) {
        $log.debug('Permission has been granted: ' + granted);
        if (granted) {
          cordova.plugins.notification.badge.set(num);
        }
      });
    }
  };

  // app resume event
  document.addEventListener('resume', function onResume() {
    $log.log('app on resume');
    Messages.getMessageCount(function(response) {
      $scope.messagesCount = response.data;
      setBadge($scope.messagesCount);
    }, function(response) {
      navigator.notification.alert(response.data.error_msg);
    });
  }, false);

  // logout
  $rootScope.$on('logout', function() {
    $log.debug('logout broadcast handle');
    $scope.loginName = null;
    setBadge(0);
  });

  // update unread messages count
  $rootScope.$on('messagesMarkedAsRead', function() {
    $log.debug('message marked as read broadcast handle');
    $scope.messagesCount = Messages.currentMessageCount();
    setBadge($scope.messagesCount);
  });

  // login action callback
  var loginCallback = function(response) {
    $ionicLoading.hide();
    $scope.loginName = response.loginname;
    Messages.getMessageCount().$promise.then(function(response) {
      $scope.messagesCount = response.data;
      setBadge($scope.messagesCount);
    }, function(response) {
      navigator.notification.alert(response.data.error_msg);
    });
  };

  // on hold login action
  $scope.onHoldLogin = function() {
    $scope.processing = true;
    if(window.cordova && window.cordova.plugins.clipboard) {
      cordova.plugins.clipboard.paste(function (text) {
        $scope.processing = false;
        if (text) {
          $log.log('get Access Token', text);
          $ionicLoading.show();
          User.login(text).$promise.then(loginCallback, $rootScope.requestErrorHandler());
        } else {
          $ionicLoading.show({
            noBackdrop: true,
            template: '粘贴板无内容',
            duration: 1000
          });
        }
      });

      // track event
      if (window.analytics) {
        window.analytics.trackEvent('User', 'clipboard login');
      }
    } else {
      $log.debug('no clipboad plugin');
    }
  };

  // assign tabs
  $scope.tabs = Tabs;

  // do login
  $scope.login = function() {
    if ($scope.processing) {
      return;
    }
    if(window.cordova && window.cordova.plugins.barcodeScanner) {
      $scope.processing = true;
      $timeout(function() {
        $scope.processing = false;
      }, 500);
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          $scope.processing = false;
          if (!result.cancelled) {
            $log.log('get Access Token', result.text);
            $ionicLoading.show();
            User.login(result.text).$promise.then(loginCallback, $rootScope.requestErrorHandler());
          }
        },
        function (error) {
          $scope.processing = false;
          $ionicLoading.show({
            noBackdrop: true,
            template: 'Scanning failed: ' + error,
            duration: 1000
          });
        }
      );

      // track event
      if (window.analytics) {
        window.analytics.trackEvent('User', 'scan login');
      }
    } else {
      if (ENV.debug) {
        $ionicLoading.show();
        User.login(ENV.accessToken).$promise.then(loginCallback, $rootScope.requestErrorHandler());
      } else {
        $log.log('pls do this in device');
      }
    }
  };
});
