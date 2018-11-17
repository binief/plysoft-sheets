'use strict';

app.factory('SheetsService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    function($http, $q, $httpParamSerializer, $rootScope) {
        var self = {
            listMajors: function() {
                var deferred = $q.defer();

                gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: '1UDkuHbZNkgpS3ro60FK-sCsBNRR5KChs7ItxY4Jw0PE',
                    range: 'CR!A1:D',
                }).then(function(response) {
                    deferred.resolve(self.toJSON(response));
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            loadSheetData: function(sheetId, range) {
                var deferred = $q.defer();

                gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: range
                }).then(function(response) {
                    //deferred.resolve(self.toJSON(response));
                    
                    var responseObj = {};
                    var data= response.result.values;
                    data.shift();
                    responseObj['rows'] =data;
                    deferred.resolve(responseObj);
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            loadSheetDataMultiRange: function(sheetId, headerRange, dataRange) {
                var deferred = $q.defer();

                gapi.client.sheets.spreadsheets.values.batchGet({
                    spreadsheetId: sheetId,
                    ranges: [headerRange, dataRange]
                }).then(function(response) {
                    deferred.resolve(self.toJSONMultipleRange(response));
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            updateRow: function(sheetId, range, values) {
                var deferred = $q.defer();

                gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: sheetId,
                    range: range,
                    values: [values],
                    valueInputOption: 'RAW'
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            insertRow: function(sheetId, range, values) {
                var deferred = $q.defer();

                gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: sheetId,
                    range: "Sheet1!A1",
                    values: [values],
                    valueInputOption: 'RAW',
                    insertDataOption: 'INSERT_ROWS'
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            deleteRow: function(sheetId, row) {
                var deferred = $q.defer();

                var params = {
                    spreadsheetId: sheetId,
                };

                var batchUpdateSpreadsheetRequestBody = {
                    requests: [{
                        "deleteDimension": {
                            "range": {
                                "startIndex": row - 1,
                                "endIndex": row,
                                "dimension": "ROWS"
                            }
                        },

                    }]
                };


                var request = gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody);
                request.then(function(response) {
                    deferred.resolve(response);
                }, function(reason) {
                    deferred.reject(reason);
                    console.error('error: ' + reason.result.error.message);
                });

                /* gapi.client.sheets.spreadsheets.values.batchUpdate({
                     spreadsheetId: sheetId,
                     range: "Sheet1!A1",
                     valueInputOption: 'RAW',
                     insertDataOption: 'INSERT_ROWS'
                 }).then(function(response) {
                     deferred.resolve(response);
                 }, function(response) {
                     console.log('Error: ' + response.result.error.message);
                     deferred.reject(response);
                 });*/

                return deferred.promise;
            },
            toJSON: function(data) {
                var responseObj = {};
                var rows = [];
                var columns = {};
                var entry = data.result.values[0];
                var keys = Object.keys(entry);

                for (var i = 1; i < data.result.values.length; i++) {
                    var newRow = {};
                    var queried = true;

                    for (var j = 0; j < keys.length; j++) {
                        //var gsxCheck = keys[j].indexOf('gsx$');
                        var gsxCheck = 1;
                        if (gsxCheck > -1) {
                            var key = keys[j];
                            var name = entry[key];
                            var value = data.result.values[i];
                            /*if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                                queried = true;
                            }*/
                            /* if (useIntegers === true && !isNaN(value)) {
                                 value = Number(value);
                             }*/
                            newRow[name] = value[j];
                            //if (queried === true) {
                            /*if (!columns.hasOwnProperty(name)) {
                                columns[name] = [];
                                columns[name].push(value);
                            }
                            else {
                                columns[name].push(value);
                            }*/
                            //}
                        }
                    }
                    //if (queried === true) {
                    rows.push(newRow);
                    //}
                }

                if (true === true) {
                    responseObj['rows'] = rows;
                }

                return responseObj;
            },
            toJSONMultipleRange: function(data) {
                var responseObj = {};
                var temp = {};

                if (data.result && data.result.valueRanges) {
                    var header = data.result.valueRanges[0].values[0];
                    var values = data.result.valueRanges[1].values[0];

                    temp = {
                        "header": header,
                        "values": values
                    };
                }
                responseObj['rows'] = temp;

                return responseObj;
            }
        };


        return self;
    }
]);
