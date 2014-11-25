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
  return [
    {
      value: 'all',
      label: '最新'
    },
    {
      value: 'share',
      label: '分享'
    },
    {
      value: 'ask',
      label: '问答'
    },
    {
      value: 'job',
      label: '招聘'
    },
    {
      value: undefined,
      label: '其他'
    }
  ];
});
