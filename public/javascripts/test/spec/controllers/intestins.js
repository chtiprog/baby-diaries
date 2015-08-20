'use strict';

describe('Controller: IntestinsCtrl', function () {

  // load the controller's module
  beforeEach(module('javascriptsApp'));

  var IntestinsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IntestinsCtrl = $controller('IntestinsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IntestinsCtrl.awesomeThings.length).toBe(3);
  });
});
