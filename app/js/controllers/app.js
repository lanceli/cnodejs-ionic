'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:AppCtrl
 * @description
 * # AppCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('AppCtrl', function(ENV, $scope, $log, $rootScope, $ionicModal, $ionicLoading, Tabs, User, Messages, Settings) {
  $log.log('app ctrl');
  $scope.ENV = ENV;
  var currentUser = User.getCurrentUser();
  $scope.loginName = currentUser.loginname || null;

  // get settings
  $scope.settings = Settings.getSettings();

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

  // login error action callback
  var loginErrorCallback = function(response) {
    var error = response.status + ' ' + response.statusText;
    if (response.data.error_msg) {
      error = response.data.error_msg;
    }
    $ionicLoading.show({
      template: error,
      duration: 1600
    });
  };

  // on hold login action
  $scope.onHoldLogin = function() {
    if(window.cordova && window.cordova.plugins.clipboard) {
      cordova.plugins.clipboard.paste(function (text) {
        if (text) {
          $log.log('get Access Token', text);
          $ionicLoading.show();
          User.login(text).$promise.then(loginCallback, loginErrorCallback);
        }
      });
    } else {
      $log.debug('no clipboad plugin');
    }
  };

  // assign tabs
  $scope.tabs = Tabs;

  // do login
  $scope.login = function() {
    if(window.cordova && window.cordova.plugins.barcodeScanner) {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled) {
            $log.log('get Access Token', result.text);
            $ionicLoading.show();
            User.login(result.text).$promise.then(loginCallback, loginErrorCallback);
          }
        },
        function (error) {
          alert('Scanning failed: ' + error);
        }
      );
    } else {
      if (ENV.debug) {
        $ionicLoading.show();
        User.login(ENV.accessToken).$promise.then(loginCallback, loginErrorCallback);
      } else {
        $log.log('pls do this in device');
      }
    }
  };
});
