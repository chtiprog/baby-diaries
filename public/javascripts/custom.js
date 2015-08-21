var myApp = angular.module('alimentation',[]);

myApp.controller('BiberonController', ['$scope', function($scope) {
  $scope.biberon = biberons;

  $scope.addBiberon = function(){
    $scope.biberon.push({quantite:$scope.qte,
                         date:$scope.date,
                         heure:$scope.heure});
    $scope.qte=0;
    $scope.date="";
    $scope.heure="";
};
}]);

// var type_aliment = [
//   {nom: 'biberon'},
//   {nom: 'têtée'},
//   {nom: 'repas solide'}
// ];

var biberons =[
  {quantite: 120, date: "20/08/2014", heure: "15:30"},
  {quantite: 90, date: "20/08/2014", heure: "17:15"},
  {quantite: 150, date: "20/08/2014", heure: "20:00"}
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
