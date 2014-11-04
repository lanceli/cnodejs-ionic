'use strict';

describe('Controller: AppCtrl', function () {

  var should = chai.should();

  // load the controller's module
  beforeEach(module('cnodejs'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of tabs to the scope', function () {
    scope.tabs.should.have.length(4);
  });

});
