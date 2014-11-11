'use strict';

/**
 * @ngdoc function
 * @name cnodejs.filters:tabName
 * @description
 * # tabName
 * tab name filter of the cnodejs app
 */

angular.module('cnodejs.filters')
.filter('link', function($sce) {
  return function(content) {
    if (typeof content === 'string') {
      var userLinkRegex = /href="\/user\/([\S]+)"/g;
      var externalLinkRegex = /href="((?!#\/user\/)[\S]+)"/g;
      return $sce.trustAsHtml(
        content
        .replace(userLinkRegex, 'href="#/user/$1"')
        .replace(externalLinkRegex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"")
      );
    }
    return content;
  };
})
.filter('tabName', function(Tabs) {
  return function(tab) {
    return Tabs[tab];
  };
});
