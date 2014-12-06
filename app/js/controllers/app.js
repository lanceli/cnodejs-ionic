'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:AppCtrl
 * @description
 * # AppCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('AppCtrl', function(ENV, $scope, $log, $timeout, $rootScope, $ionicPopup, $ionicLoading, Tabs, User, Messages, Settings) {
  $log.log('app ctrl');

  // get message count
  var getMessageCount = function() {
    Messages.getMessageCount().$promise.then(function(response) {
      $scope.messagesCount = response.data;
      setBadge($scope.messagesCount);
    }, function(response) {
      $log.log('get messages count fail', response);
    });
  };

  // environment config
  $scope.ENV = ENV;

  // get current user
  var currentUser = User.getCurrentUser();
  $scope.loginName = currentUser.loginname || null;
  if ($scope.loginName !== null) {
    getMessageCount();
  }

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

  // set badge of app icon
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
    getMessageCount();
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
    getMessageCount();
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
      // auto login if in debug mode
      if (ENV.debug) {
        $ionicLoading.show();
        User.login(ENV.accessToken).$promise.then(loginCallback, $rootScope.requestErrorHandler());
      } else {
        $scope.data = {};
        // show login popup if no barcodeScanner in pc browser
        var loginPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="data.token">',
          title: '输入Access Token',
          scope: $scope,
          buttons: [
            { text: '取消' },
            {
              text: '<b>提交</b>',
              type: 'button-positive',
              onTap: function(e) {
                e.preventDefault();
                if ($scope.data.token) {
                  User.login($scope.data.token).$promise.then(function(response) {
                    loginPopup.close();
                    loginCallback(response);
                  }, $rootScope.requestErrorHandler());
                }
              }
            }
          ]
        });
      }
    }
  };
});
