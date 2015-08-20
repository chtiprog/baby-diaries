describe('ListeCourses', function(){

  beforeEach(module('alimentation'));

  it('should create "liste" model with 2 courses', inject(function($controller) {
    var scope = {},
        ctrl = $controller('ListeCourses', {$scope:scope});

    expect(scope.liste.length).toBe(2);
  }));

});
