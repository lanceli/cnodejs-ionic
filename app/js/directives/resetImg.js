angular.module('cnodejs.directives').directive(
  // Collection-repeat image recycling while loading
  // https://github.com/driftyco/ionic/issues/1742
  'resetImg', function ($document) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attributes) {
        var applyNewSrc = function (src) {
          var newImg = $element.clone(true);

          // add https protocol
          if (/^\/\//gi.test(src)) {
            src = 'https:' + src;
          }

          newImg.attr('src', src);
          $element.replaceWith(newImg);
          $element = newImg;
        };

        $attributes.$observe('src', applyNewSrc);
        $attributes.$observe('ngSrc', applyNewSrc);
      }
    }
  }
);
