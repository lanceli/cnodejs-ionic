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

  // track view
  if (window.analytics) {
    window.analytics.trackView('settings view');
  }

  $scope.now = new Date();

  // mail feedback
  var feedbackMailAddr = 'hi@lanceli.com';
  var feedbackMailSubject = 'CNodeJs Feedback v' + ENV.version;
  $scope.feedback = function() {
    if (window.cordova && window.cordova.plugins.email) {
      window.cordova.plugins.email.open({
        to:      feedbackMailAddr,
        subject: feedbackMailSubject,
        body:    ''
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
