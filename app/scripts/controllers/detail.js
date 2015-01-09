/**
 * Created by Kumar Gaurav(kumar.gaurav@synerzip.com) on 29/12/14.
 */
'use strict';

/**
 * @ngdoc function
 * @name testAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the testAngularApp
 */
angular.module('helloApp')
  .controller('DetailCtrl', function ($scope, $location, $q, $log, myService) {
    if(!myService.data.movieData){
      $location.path('/about')
    }else{
      $scope.movieData = myService.data.movieData;
    }
  });
