'use strict';

/**
 * @ngdoc function
 * @name cnodejs.filters:tabName
 * @description
 * # tabName
 * tab name filter of the cnodejs app
 */

angular.module('cnodejs.filters')
.filter('tabName', function(Tabs) {
  return function(tab) {
    return Tabs[tab];
  };
});
