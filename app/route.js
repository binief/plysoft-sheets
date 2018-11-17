'use strict';

app.config(function($routeProvider) {
    $routeProvider.when("/suppliers", {
            templateUrl: "pages/suppliers-list.html"
        }).when("/suppliers/:rowIndex", {
            templateUrl: "pages/suppliers-crud.html"
        }).when("/customers", {
            templateUrl: "pages/customers-list.html"
        }).when("/customers/:rowIndex", {
            templateUrl: "pages/customers-crud.html"
        })

        .otherwise({
            redirectTo: '/suppliers'
        });
});

app
    .run(function($rootScope, $location, $http, $localStorage) {

        var token = $localStorage.userToken;

        $rootScope
            .$on(
                "$routeChangeStart",
                function(event, next, current) {

                   /* if (!$rootScope.sheetModels) {
                        alert("Please wait.. loading datastore")
                        event.preventDefault();
                    }*/

                });

    });