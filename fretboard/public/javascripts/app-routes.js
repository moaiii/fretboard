angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'views/fretboard.ejs',
			controller: 'GuitarController'
		});

	$locationProvider.html5Mode(true);

}]);
