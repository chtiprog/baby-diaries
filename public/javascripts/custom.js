var myApp = angular.module('alimentation',[]);

myApp.controller('AlimentationController', ['$scope', function($scope) {
  $scope.type = type_aliment;
  $scope.aliments = repas;
  $scope.addAliments ;

}]);

var type_aliment = [
  {nom: 'biberon'}
];

var repas =[
  {type : type_aliment, quantite : 120, date : '20/08/2015'}
] ;

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
