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
            User.login(result.text, function(response) {
              $ionicLoading.hide();
              $scope.loginName = response.loginname;
            });
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
        User.login(ENV.accessToken, function(response) {
          $ionicLoading.hide();
          $scope.loginName = response.loginname;
        });
      } else {
        $log.log('pls do this in device');
      }
    }
  };
});
