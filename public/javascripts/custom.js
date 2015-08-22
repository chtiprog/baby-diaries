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


var biberons =[
  {quantite: 120, date: "20/08/2014", heure: "15:30"},
  {quantite: 90, date: "20/08/2014", heure: "17:15"},
  {quantite: 150, date: "20/08/2014", heure: "20:00"}
] ;

myApp.controller('AllaitementController', ['$scope', function($scope){
  $scope.allaitement = tetee;

  $scope.addAllaitement = function(){
    $scope.allaitement.push({date:$scope.date,
                             heure:$scope.heure,
                             sein:$scope.sein,
                             duree:$scope.duree});
    $scope.date="";
    $scope.heure="";
    $scope.sein="gauche";
    $scope.duree=0;
  };
}]);

var tetee = [
  {date: "20/08/2014", heure:"10:00", sein: "gauche", duree: 10},
  {date: "20/08/2014", heure:"10:10", sein: "droit", duree: 10}
];

myApp.controller('RepasController', ['$scope', function($scope){
  $scope.repas = repas_solide;

  $scope.addRepas = function(){
    $scope.repas.push({
      menu:$scope.menu, date:$scope.date, heure:$scope.heure
    });
    $scope.menu=[];
    $scope.date="";
    $scope.heure="";
  };
}]);

var repas_solide = [
  {menu: ["purée de patates douces", "yaourt"],
   date: "21/08/2014", heure: "18:30"},
  {menu: ["purée de betteraves", "fromage"],
   date: "22/08/2014", heure: "12:15"}
];

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
