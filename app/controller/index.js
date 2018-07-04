'use strict';

app.controller(
    'IndexCtrl',
    function($scope, $http, $location, $rootScope, $localStorage, GapiService, SheetsService,
        DataStoreInitService) {
        var ctrl = this;

        ctrl.msg = "Hello";

        ctrl.isGoogleSigned = false;

        ctrl.init = function() {
            GapiService.handleClientLoad();
        };

        $rootScope.$on("googleLoginEvent", function(event, data) {
            ctrl.isGoogleSigned = data;

            if (data) {
                DataStoreInitService.createDataStore().then(function(response) {
                    console.log(response);
                }, function(response) {
                    console.log('Error: ' + response);
                });
            }

        });

        ctrl.loadSheetData = function() {
            SheetsService.listMajors().then(function(response) {

                ctrl.rows = response.rows;

            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }

        ctrl.doLogin = function() {
            GapiService.handleAuthClick();
        }

        ctrl.init();

    });