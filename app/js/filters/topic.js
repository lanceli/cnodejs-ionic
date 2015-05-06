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
      var userLinkRegex = /href="\/user\/([\S]+)"/gi;
      var noProtocolSrcRegex = /src="\/\/([\S]+)"/gi;
      var externalLinkRegex = /href="((?!#\/user\/)[\S]+)"/gi;
      return $sce.trustAsHtml(
        content
        .replace(userLinkRegex, 'href="#/user/$1"')
        .replace(noProtocolSrcRegex, 'src="https://$1"')
        .replace(externalLinkRegex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"")
      );
    }
    return content;
  };
})
.filter('tabName', function(Tabs) {
  return function(tab) {
    for (var i in Tabs) {
      if (Tabs[i].value === tab) {
        return Tabs[i].label;
      }
    }
  };
})
.filter('protocol', function(ENV) {
  return function(src) {
    // filter avatar link
    if (/^\/agent\?/gi.test(src)) {
      return 'https://cnodejs.org' + src;
    }
    // add https protocol
    if (/^\/\//gi.test(src)) {
      return 'https:' + src;
    } else {
      return src;
    }
  };
});
