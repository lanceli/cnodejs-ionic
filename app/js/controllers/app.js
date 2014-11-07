'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:AppCtrl
 * @description
 * # AppCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('AppCtrl', function(ENV, $scope, $log, $ionicModal, $ionicLoading, Tabs, User) {
  $log.log('app ctrl');
  $scope.loginName = null;

  // login action callback
  var loginCallback = function(response) {
    $ionicLoading.hide();
    if (response.success) {
      $scope.loginName = response.loginname;
    } else {
      alert(response.error_msg);
    }
  };

  // on hold login action
  $scope.onHoldLogin = function() {
    if(window.cordova && window.cordova.plugins.clipboard) {
      cordova.plugins.clipboard.paste(function (text) {
        if (text) {
          $log.log('get Access Token', text);
          $ionicLoading.show({
            template: 'Loading...'
          });
          User.login(text, loginCallback(response));
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
            $ionicLoading.show({
              template: 'Loading...'
            });
            User.login(result.text, loginCallback(response));
          }
        },
        function (error) {
          alert('Scanning failed: ' + error);
        }
      );
    } else {
      if (ENV.debug) {
        $ionicLoading.show({
          template: 'Loading...'
        });
        User.login(ENV.accessToken, loginCallback(response));
      } else {
        $log.log('pls do this in device');
      }
    }
  };
});
