var app = angular.module('app', ['ngTouch', 'ui.grid','ngRoute','ui.grid.pinning']);

app.factory("XLSXReaderService", ['$q', '$rootScope',
    function($q, $rootScope) {
      var service = function(data) {
        angular.extend(this, data);
        }
      service.readFile = function(file, readCells, toJSON) {
        var deferred = $q.defer();
        XLSXReader(file, readCells, toJSON, function(data) {
          $rootScope.$apply(function() {
            deferred.resolve(data);
            });
          });
        return deferred.promise;
      }
    return service;
    }
  ]);


app.factory('dataShare',function($rootScope,$timeout){
  var service = {};
  service.data = false;
  service.sendData = function(data){
      this.data = data;
      $rootScope.$broadcast('data_shared');
     /* $timeout(function(){
         $rootScope.$broadcast('data_shared');
      },100); */
  };
  service.getData = function(){
    return this.data;
  };
  return service;
});

app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: '/views/grid.html',
			controller: 'MainCtrl'
		})
		.when('/viewChart', {
			templateUrl: '/views/speechrate.html',
			controller: 'chartCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});
});
