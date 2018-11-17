'use strict';

app.factory('DataStoreInitService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    'SheetPropertiesService',
    function($http, $q, $httpParamSerializer, $rootScope, SheetPropertiesService) {

        var self = {
            createDataStore: function() {
                var deferred = $q.defer();

                var filesList = ["Plysoft-Suppliers", "Plysoft-Customers"]
                var fileStore = [];
                var fileToCreate = [];

                var mime = 'application/vnd.google-apps.document';
                var params = {
                    path: 'drive/v2/files'
                };

                var request = gapi.client.request(params);
                request.then(function(response) {

                        var items = response.result.items;

                        if (items.length > 0) {
                            for (var j = 0; j < filesList.length; j++) {
                                var fileName = filesList[j];

                                var isCreate = true;
                                for (var i = 0; i < items.length; i++) {
                                    var it = items[i];
                                    var title = it.title;
                                    var id = it.id;

                                    if (fileName == title) {
                                        var range = SheetPropertiesService.getHeaders(fileName).range;
                                        var newFileStore = {
                                                "title":title,
                                                "id": id,
                                                "range": range
                                        }
                                        fileStore.push(newFileStore);
                                        isCreate = false;
                                        break;
                                    }
                                }

                                if (isCreate) {
                                    if (fileToCreate.indexOf(fileName) == -1)
                                        fileToCreate.push(fileName);
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < filesList.length; i++) {
                                var it = filesList[i];
                                fileToCreate.push(it);
                            }
                        }

                        for (var i = 0; i < fileToCreate.length; i++) {
                            var it = fileToCreate[i];
                            self.createFile(it).then(function(d) {
                                    var newFileStore = {
                                            "title": d.title,
                                            "id": d.id,
                                            "range": d.range
                                    }
                                    fileStore.push(newFileStore);
                                },
                                function(reason) {
                                    deferred.reject(reason);
                                    console.error('error: ' + reason.result.error.message);
                                })
                        }

                        deferred.resolve(fileStore);

                    },
                    function(reason) {
                        deferred.reject(reason);
                        console.error('error: ' + reason.result.error.message);
                    });

                return deferred.promise;
            },
            createFile: function(fileName) {
                var deferred = $q.defer();

                var spreadsheetBody = {
                    "properties": {
                        "title": fileName
                    }
                };

                var request = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
                request.then(function(response) {
                    var title = response.result.properties.title;
                    var valueRangeBody = SheetPropertiesService.getHeaders(title);

                    var d = {
                        id: response.result.spreadsheetId,
                        title: title,
                        range: valueRangeBody.range
                    }

                    if (valueRangeBody) {
                        var params = {
                            spreadsheetId: d.id,
                            range: valueRangeBody.range,
                            valueInputOption: 'RAW',
                            insertDataOption: 'INSERT_ROWS'
                        };

                        var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
                        request.then(function(response) {
                            console.log(response.result);
                        }, function(reason) {
                            console.error('error: ' + reason.result.error.message);
                        });
                    }

                    deferred.resolve(d);
                }, function(reason) {
                    deferred.reject(reason);
                    console.error('error: ' + reason.result.error.message);
                });


                return deferred.promise;
            }
            /*,
                        getHeaders: function(name) {

                            if (name == "Plysoft-Suppliers" || name == "Plysoft-Customers") {
                                return {
                                    "range": "Sheet1!A1:A2",
                                    "values": [
                                        [
                                            "Name", "Address"
                                        ]
                                    ]
                                }
                            }


                        }*/
        };

        return self;
    }
]);
