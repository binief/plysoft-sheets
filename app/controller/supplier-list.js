'use strict';

app.controller(
    'SupplierListCtrl',
    function($scope, $http, $location, $rootScope, $localStorage,SupplierService) {
        var ctrl = this;

       

        ctrl.loadSuppliers = function() {

            SupplierService.loadAllSuppliers().then(function(response) {

                ctrl.suppliers = response.rows;

            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }

        ctrl.addData = function() {
            location.href = "#/suppliers/null"
        }

        ctrl.delete = function(row) {
            SupplierService.deleteSupplier(row).then(function(response) {
                if (response.status == 200) {
                    alert("Deleted..");
                    ctrl.loadSuppliers();
                }
                else {
                    alert("failed..")
                }
            }, function(response) {
                console.log('Error: ' + response.result.error.message);
            });
        }

        ctrl.init = function() {
            ctrl.loadSuppliers();
        }

        ctrl.init();

    });