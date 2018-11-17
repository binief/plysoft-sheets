'use strict';

app.factory('SupplierService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    'SheetsService',
    'SheetPropertiesService',
    function($http, $q, $httpParamSerializer, $rootScope, SheetsService, SheetPropertiesService) {

        var sheetName = SheetPropertiesService.getSheetName("Supplier");
        var sheetProperties = SheetPropertiesService.getHeaders(sheetName);
        var startCol = sheetProperties.startCol;
        var endCol = sheetProperties.endCol;
        var selectRange = sheetProperties.selectRange;
        var headerRange = "Sheet1!" + startCol + "1:" + endCol + "1";

        var it = $rootScope.sheetModels.filter(function(e) {
            return e.title == sheetName;
        });

        var sheetId = null;
        if (it.length > 0)
            sheetId = it[0].id;

        var self = {
            loadAllSuppliers: function() {
                var deferred = $q.defer();

                SheetsService.loadSheetData(sheetId, selectRange).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            loadSupplierByRow: function(row) {
                var deferred = $q.defer();

                var dataRange = "Sheet1!" + startCol + row + ":" + endCol + row;

                SheetsService.loadSheetDataMultiRange(sheetId, headerRange, dataRange).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            saveSupplier: function(values) {
                var deferred = $q.defer();

                SheetsService.insertRow(sheetId, selectRange, values).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            updateSupplier: function(row, values) {
                var deferred = $q.defer();

                var dataRange = "Sheet1!" + startCol + row + ":" + endCol + row;

                SheetsService.updateRow(sheetId, dataRange, values).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            deleteSupplier: function(row) {
                var deferred = $q.defer();

                SheetsService.deleteRow(sheetId, row + 1).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            }
        };


        return self;
    }
]);
