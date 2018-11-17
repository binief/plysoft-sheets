'use strict';

app.controller(
    'CustomerCrudCtrl',
    function($scope, $http, $location, $rootScope, $localStorage, $routeParams, CustomerService, UUIDService) {
        var ctrl = this;

        if ($routeParams.rowIndex) {
            ctrl.rowIndex = parseInt($routeParams.rowIndex) + 1;
        }
        else {
            ctrl.rowIndex = null;
        }

        ctrl.loadData = function() {

            if (ctrl.rowIndex) {
                CustomerService.loadDataByRow(ctrl.rowIndex).then(function(response) {
                    ctrl.customer = response.rows;
                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                });
            }
            else {
                ctrl.customer = { values: [UUIDService.generate()] };
            }
        }

        ctrl.saveOrUpdate = function() {

            if (ctrl.rowIndex) {
                CustomerService.updateData(ctrl.rowIndex, ctrl.customer.values).then(function(response) {
                    if (response.status == 200) {
                        alert("Updated Successfully..")
                        location.href = "#/customers";
                    }
                    else {
                        alert("Updated failed..")
                    }

                }, function(response) {
                    console.log('Error: ' + response.result.error.message);
                });
            }
            else {
                CustomerService.saveData(ctrl.customer.values).then(function(response) {
                    if (response.status == 200) {
                        alert("Created Successfully..")
                        location.href = "#/customers";
                    }
                    else {
                        alert(response.message)
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