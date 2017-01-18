angular.module('guitar-service', [])
	.factory('GuitarService', ['$http', function($scope, $http) {

    $http.get('/data/chords.json')
			.then(function(res){
				$scope.chords = res.data;
				console.log($scope.chords);
			});

}]);
