'use strict';

app.controller(
    'IndexCtrl',
    function($scope, $http, $location, $rootScope, $localStorage, GapiService, SheetsService,
        DataStoreInitService) {
        var ctrl = this;



        ctrl.isGoogleSigned = false;

        ctrl.init = function() {
            GapiService.handleClientLoad();
        };

        $rootScope.sheetModels = null;
        $rootScope.$on("googleLoginEvent", function(event, data) {
            ctrl.isGoogleSigned = data;

            $rootScope.sheetModels = null;
            if (data) {
                DataStoreInitService.createDataStore().then(function(response) {
                    $rootScope.sheetModels = response;
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