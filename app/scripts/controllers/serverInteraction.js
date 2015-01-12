'use strict';

/**
 * @ngdoc function
 * @name helloApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the helloApp
 */
angular.module('helloApp')
  .controller('ServerCtrl', function ($scope, $http, $resource) {
    $scope.callType = "_$_RES_";
    $scope.titulo = "TESTE back";
    $scope.message = "";
    $scope.customers = [];
    $scope.customer = {};
    $scope.view = '/list.html';

    var _URL_ = '/api/customers';

    //Creating Resource for server Interaction
    var _res = $resource(_URL_ + '/:id', {
      id: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });

    //Method to determine which type of interaction is to be used
    function _use_$resources_() {
      return $scope.callType != "_$_HTTP_";
    }

    function _fn_error(err) {
      $scope.message = err;
    }


    /***
     * Get all customer
     */
    $scope.listCustomers = function () {
      $scope.view = '/list.html';

      var fn_success = function (data) {
        $scope.customers = data;
      };

      if (_use_$resources_()) {
        _res.query(fn_success, _fn_error);//resource .Query
      } else {
        //Use $http request
        $http.get(_URL_).success(fn_success).error(_fn_error);
      }
    }


    function _fn_success_put_post(data) {
      $scope.customer = {};
      $scope.listCustomers();
    }

    /***
     * Create a new Customer
     * @param data
     * @private
     */
    function createCustomer() {
      if (_use_$resources_()) {//resource .save
        if ($scope.customer.$save) {
          $scope.customer.$save(_fn_success_put_post, _fn_error);
          return;
        }

        _res.post($scope.customer, _fn_success_put_post, _fn_error);
      } else {
        //Use $http request
        $http.post(_URL_, $scope.customer).success(_fn_success_put_post).error(_fn_error);
      }
    }


    function updateCustomer() {
      if (_use_$resources_()) {
        var params = {
          id: $scope.customer._id
        };
        if ($scope.customer.$update) {
          $scope.customer.$update(params, _fn_success_put_post, _fn_error);
          return;
        }
        _res.put(params, $scope.customer, _fn_success_put_post, _fn_error);//resource .put
      } else {
        //Use $http request
        $http.put(_URL_, $scope.customer).success(_fn_success_put_post).error(_fn_error);
      }
    }

    function deleteCustomer() {
      if (_use_$resources_()) {
        var params = {
          'id': $scope.customer._id
        };
        if ($scope.customer.$update) {
          $scope.customer.$update(params);
          return;
        }
        _res.put(params, $scope.customer, _fn_success_put_post, _fn_error);
      } else {
        //Use $http request
        $http.put(_URL_, $scope.customer).success(_fn_success_put_post).error(_fn_error);
      }
    }

    $scope.delete = function (id) {
      if (!confirm("Are you sure you want do delete the Customer?")) return;
      if (_use_$resources_()) {
        var params = {
          'id': id
        };
        _res.remove(params, _fn_success_put_post, _fn_error);//resource remove
      } else {
        //Use $http request
        $http.delete(_URL_ + "/" + id).success(_fn_success_put_post).error(_fn_error);
      }
    }


    $scope.newCustomer = function () {
      if (_use_$resources_()) {
        $scope.customer = new _res();
      } else {
        $scope.customer = {};
      }
      $scope.customerOperation = "New Customer";
      $scope.buttonLabel = "Create";
      $scope.view = "/form.html";
    }

    $scope.edit = function (id) {
      $scope.customerOperation = "Modify Customer";
      $scope.buttonLabel = "Save";

      $scope.message = "";

      var fn_success = function (data) {
        $scope.customer = data;
        $scope.view = '/form.html';
      };

      if (_use_$resources_()) {
        _res.get({
          'id': id
        }, fn_success, _fn_error);
      } else {
        $http.get(_URL_ + '/' + id).success(fn_success).error(_fn_error);
      }
    }


    $scope.save = function () {
      if ($scope.customer._id) {
        updateCustomer();
      } else {
        createCustomer();
      }
    }

    $scope.cancel = function () {
      $scope.message = "";
      $scope.customer = {};
      $scope.customers = [];
      $scope.listCustomers();
    }

    $scope.listCustomers();

  });
