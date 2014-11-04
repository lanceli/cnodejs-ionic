'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TabsService
 * @description
 * # TabsService
 * Tabs Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Tabs', function() {
  return {
    all: '最新',
    ask: '问答',
    share: '分享',
    job: '招聘',
    undefined: '其他'
  };
});
