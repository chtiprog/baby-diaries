var myApp = angular.module('alimentation',[]);

myApp.controller('AlimentationController', ['$scope', function($scope) {
  $scope.aliments = aliment;
}]);

var aliment = {
  name : 'biberon',
  quantite : 120

};

myApp.controller('ListeCourses',['$scope', function ($scope) {
  $scope.liste = courses;

  $scope.addCourses = function () {
    $scope.liste.push({text:$scope.texte, done:false});
    $scope.texte = '';
  };

}]);

var courses = [
  {text:'Bananes', done:true},
  {text:'Riz', done:false}
];
