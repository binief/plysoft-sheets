'use strict';

app.factory('CustomerService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    'SheetsService',
    'SheetPropertiesService',
    function($http, $q, $httpParamSerializer, $rootScope, SheetsService, SheetPropertiesService) {

        var sheetName = SheetPropertiesService.getSheetName("Customer");
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
            loadAllData: function() {
                var deferred = $q.defer();

                SheetsService.loadSheetData(sheetId, selectRange).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            loadDataByRow: function(row) {
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
            saveData: function(values) {
                var deferred = $q.defer();

                var isValid = self.isValid("I", values);

                isValid.then(function(response) {

                    if (response.valid) {
                        SheetsService.insertRow(sheetId, selectRange, values).then(function(response) {
                            deferred.resolve(response);
                        }, function(response) {
                            deferred.reject(response);
                            console.log('Error: ' + response.result.error.message);
                        });
                    }
                    else {
                        var res = {
                            status: 500,
                            message: response.message
                        };
                        deferred.resolve(res);
                    }
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });


                return deferred.promise;
            },
            updateData: function(row, values) {
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
            deleteData: function(row) {
                var deferred = $q.defer();

                SheetsService.deleteRow(sheetId, row + 1).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                    console.log('Error: ' + response.result.error.message);
                });

                return deferred.promise;
            },
            isValid: function(mode, value) {
                var deferred = $q.defer();

                var isValid = {
                    valid: true,
                    message: []
                }

                if (mode == "I") {
                    self.loadAllData().then(function(response) {
                        var data = response.rows;
                        var name = value[1];

                        for (var x=0;x<data.length;x++) {
                            var it=data[x];
                            if (it.name == name) {
                                isValid.valid = false;
                                isValid.message.push("Duplicate Customer Name")
                            }
                        }


                        deferred.resolve(isValid);

                    }, function(response) {
                        deferred.reject(response);
                        console.log('Error: ' + response.result.error.message);
                    });
                }
                return deferred.promise;
            }
        };


        return self;
    }
]);
