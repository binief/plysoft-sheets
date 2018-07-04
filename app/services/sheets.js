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
                    //var range = response.result;
                    /*if (range.values.length > 0) {
                        appendPre('Name, Major:');
                        for (i = 0; i < range.values.length; i++) {
                            var row = range.values[i];
                            // Print columns A and E, which correspond to indices 0 and 4.
                            appendPre(row[0] + ', ' + row[4]);
                        }
                    }
                    else {
                        appendPre('No data found.');
                    }*/
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                    deferred.reject(response);
                });

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
            }
        };


        return self;
    }
]);
