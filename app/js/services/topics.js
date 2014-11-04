'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicsService
 * @description
 * # TopicsService
 * Topics Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topics', function(ENV, $resource, $log) {
  var topics = [];
  var currentTab = 'all';
  var currentPage = 1;
  var hasNextPage = true;
  var resource =  $resource(ENV.api + '/topics', {
    tab: 'all',
    page: 1,
    limit: 10,
    mdrender: true
  });
  var getTopics = function(tab, page, callback) {
    resource.get({
      tab: tab,
      page: page
    }, function(r) {
      $log.debug('get topics tab:', tab, 'page:', page, 'data:', r.data);
      return callback && callback(r);
    });
  };
  return {
    refresh: function(callback) {
      getTopics(currentTab, 0, function(response) {
        currentPage = 1;
        topics = response.data;
        return callback && callback(response);
      });
    },
    pagination: function(callback) {
      getTopics(currentTab, currentPage, function(response) {
        if (response.data.length < 10) {
          $log.debug('response data length', response.data.length);
          hasNextPage = false;
        }
        currentPage++;
        topics = topics.concat(response.data);
        return callback && callback(response);
      });
    },
    currentTab: function(newTab) {
      if (typeof newTab !== 'undefined') {
        currentTab = newTab;
      }
      return currentTab;
    },
    hasNextPage: function(has) {
      if (typeof has !== 'undefined') {
        hasNextPage = has;
      }
      return hasNextPage;
    },
    resetData: function() {
      topics = [];
      currentPage = 0;
      hasNextPage = true;
    },
    getCurrentPage: function() {
      return currentPage;
    },
    getTopics: function() {
      return topics;
    },
    getById: function(id) {

      if (!!topics) {
        for (var i = 0; i < topics.length; i++) {
          if (topics[i].id === id) {
            return topics[i];
          }
        }
      } else {
        return null;
      }
    }
  };
});
