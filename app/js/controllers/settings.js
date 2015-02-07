'use strict';

/**
 * @ngdoc function
 * @name cnodejs.controllers:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Main Controller of the cnodejs app
 */

angular.module('cnodejs.controllers')
.controller('SettingsCtrl', function($scope, $log, ENV, Settings) {
  $log.log('settings ctrl');

  // before enter view event
  $scope.$on('$ionicView.beforeEnter', function() {
    // track view
    if (window.analytics) {
      window.analytics.trackView('settings view');
    }
  });

  $scope.now = new Date();

  // mail feedback
  var feedbackMailAddr = 'hi@lanceli.com';
  var feedbackMailSubject = 'CNode社区 Feedback v' + ENV.version;
  var device = ionic.Platform.device();
  var feedbackMailBody = device.platform + ' ' + device.version + ' | ' + device.model;
  $scope.feedback = function() {
    if (window.cordova && window.cordova.plugins.email) {
      window.cordova.plugins.email.open({
        to:      feedbackMailAddr,
        subject: feedbackMailSubject,
        body:    feedbackMailBody
      });
    } else {
      window.open('mailto:' + feedbackMailAddr + '?subject=' + feedbackMailSubject);
    }
  };

  // save settings on destroy
  $scope.$on('$stateChangeStart', function(){
    $log.debug('settings controller on $stateChangeStart');
    Settings.save();
  });
});
