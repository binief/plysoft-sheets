'use strict';

app.controller(
    'CustomerListCtrl',
    function($scope, $http, $location, $rootScope, $localStorage, CustomerService) {
        var ctrl = this;


        ctrl.loadListData = function() {

            CustomerService.loadAllData().then(function(response) {
                ctrl.listdata = response.rows;
            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }

        ctrl.addData = function() {
            location.href = "#/customers/null"
        }

        ctrl.delete = function(row) {
            CustomerService.deleteData(row).then(function(response) {

                if (response.status == 200) {
                    alert("Deleted..");
                    ctrl.loadListData();
                }
                else {
                    alert("failed..")
                }

            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }

        ctrl.init = function() {
            ctrl.loadListData();
        }

        ctrl.init();

    });