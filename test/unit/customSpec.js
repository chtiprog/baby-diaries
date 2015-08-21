describe('ListeCourses', function(){

  beforeEach(module('alimentation'));

  it('should create "liste" model with 2 courses', inject(function($controller) {
    var scope = {},
        ctrl = $controller('ListeCourses', {$scope:scope});

    expect(scope.liste.length).toBe(2);
  }));

});

describe('BiberonController', function(){

  beforeEach(module('alimentation'));

  it('should create "liste" model with 3 biberons', inject(function($controller){
    var scope = {},
        ctrl = $controller('BiberonController', {$scope:scope});

    expect(scope.biberon.length).toBe(3);

  }));


});
