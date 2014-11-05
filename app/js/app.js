'use strict';

// Ionic cnodejs App
angular.module('cnodejs', ['ionic', 'angularMoment', 'cnodejs.controllers', 'cnodejs.filters', 'cnodejs.config'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function(ENV, $stateProvider, $urlRouterProvider, $logProvider) {

  $logProvider.debugEnabled(ENV.debug);
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.user', {
      url: '/user/:loginname',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
        }
      }
    })
    .state('app.topics', {
      url: '/topics/:tab',
      views: {
        'menuContent': {
          templateUrl: 'templates/topics.html',
          controller: 'TopicsCtrl'
        }
      }
    })
    .state('app.topic', {
      url: '/topic/:id',
      views: {
        'menuContent': {
          templateUrl: 'templates/topic.html',
          controller: 'TopicCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/topics/all');
});

angular.module('cnodejs.controllers', ['cnodejs.services']);

angular.module('cnodejs.services', ['ngResource', 'cnodejs.config']);

angular.module('cnodejs.filters', ['cnodejs.services']);
