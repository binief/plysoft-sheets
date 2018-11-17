'use strict';

app.controller(
    'SupplierCrudCtrl',
    function($scope, $http, $location, $rootScope, $localStorage, $routeParams, SupplierService, UUIDService) {
        var ctrl = this;

        if ($routeParams.rowIndex) {
            ctrl.rowIndex = parseInt($routeParams.rowIndex) + 1;
        }
        else {
            ctrl.rowIndex = null;
        }

        ctrl.loadData = function() {

            if (ctrl.rowIndex) {
                SupplierService.loadSupplierByRow(ctrl.rowIndex).then(function(response) {
                    ctrl.supplier = response.rows;
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                });
            }
            else {
                ctrl.supplier = { values: [UUIDService.generate()] };
            }
        }

        ctrl.saveOrUpdate = function() {

            if (ctrl.rowIndex) {
                SupplierService.updateSupplier(ctrl.rowIndex, ctrl.supplier.values).then(function(response) {
                    if (response.status == 200) {
                        alert("Updated Successfully..")
                        location.href = "#/suppliers";
                    }
                    else {
                        alert("Updated failed..")
                    }
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                });
            }
            else {
                SupplierService.saveSupplier(ctrl.supplier.values).then(function(response) {
                    if (response.status == 200) {
                        alert("Created Successfully..")
                        location.href = "#/suppliers";
                    }
                    else {
                        alert("Create failed..")
                    }
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                });
            }
        }

        ctrl.init = function() {
            ctrl.loadData();
        }

        ctrl.init();

    });