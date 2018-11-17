'use strict';

app.factory('SheetPropertiesService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    function($http, $q, $httpParamSerializer, $rootScope) {

        var self = {
            getHeaders: function(name) {

                if (name == "Plysoft-Suppliers" || name == "Plysoft-Customers") {
                    return {
                        "range": "Sheet1!A1:C1",
                        "selectRange": "Sheet1!A1:C",
                        "startCol":"A",
                        "endCol":"C",
                        "values": [
                            [
                                "id", "name", "address"
                            ]
                        ]
                    }
                }
            },getSheetName:function(module){
                if(module=="Supplier"){
                    return "Plysoft-Suppliers";
                }else if(module=="Customer"){
                    return "Plysoft-Customers";
                }
            }
        };

        return self;
    }
]);
