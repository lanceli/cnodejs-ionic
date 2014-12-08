'use strict';

/**
 * @ngdoc function
 * @name cnodejs.services:TopicsService
 * @description
 * # TopicsService
 * Topics Service of the cnodejs app
 */

angular.module('cnodejs.services')
.factory('Topics', function(ENV, $resource, $log, User) {
  var topics = [];
  var currentTab = 'all';
  var nextPage = 1;
  var hasNextPage = true;
  var resource =  $resource(ENV.api + '/topics', {
  }, {
    query: {
      method: 'get',
      params: {
        tab: 'all',
        page: 1,
        limit: 10,
        mdrender: true
      },
      timeout: 20000
    }
  });
  var getTopics = function(tab, page, callback) {
    return resource.query({
      tab: tab,
      page: page
    }, function(r) {
      $log.debug('get topics tab:', tab, 'page:', page, 'data:', r.data);
      return callback && callback(r);
    });
  };
  return {
    refresh: function() {
      return getTopics(currentTab, 1, function(response) {
        nextPage = 2;
        hasNextPage = true;
        topics = response.data;
      });
    },
    pagination: function() {
      return getTopics(currentTab, nextPage, function(response) {
        if (response.data.length < 10) {
          $log.debug('response data length', response.data.length);
          hasNextPage = false;
        }
        nextPage++;
        topics = topics.concat(response.data);
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
      nextPage = 1;
      hasNextPage = true;
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
    },
    saveNewTopic: function(newTopicData) {
      var currentUser = User.getCurrentUser();
      return resource.save({accesstoken: currentUser.accesstoken}, newTopicData);
    }
  };
});
