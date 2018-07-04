'use strict';

var app = angular.module('plysoft-sheets', [ "ngRoute", "ngStorage" ]);

var interceptor = function($q, $window) {
	return {

		'request' : function(config) {
			return config;
		},
		'requestError' : function(rejection) {
			console.log(rejection);
			alert()
			if (canRecover(rejection)) {
				return responseOrNewPromise
			}
			return $q.reject(rejection);
		},

		'response' : function(response) {
			return response;
		},
		'responseError' : function(rejection) {
			console.log(rejection);
			alert()
		/*	if (rejection.status != 200) {

				var currentPath = $window.location.href;
				var userLogin = currentPath.indexOf("sign-in.html");
				var adminLogin = currentPath.indexOf("sign-in-a.html");

				if (adminLogin != -1 && userLogin != -1)
					$window.location = './pages/app/sign-in.html';
			}*/
			return $q.reject(rejection);
		}
	};

}

app.config(function($httpProvider, $locationProvider) {
	$httpProvider.interceptors.push(interceptor);
	$httpProvider.defaults.timeout = 500000;
	$locationProvider.hashPrefix('');
});