'use strict';

/**
 * @ngdoc function
 * @name testAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the testAngularApp
 */
angular.module('helloApp')
  .controller('AboutCtrl', function ($scope, $location, $q, $log, myService) {
    $scope.moviePlotOptions = [{
      name:'Full',
      value:'full'
    },{
      name:'Short',
      value:'short'
    }];

    $scope.promiseExampleIDOptions = [{
      name:'1',
      value:1
    },{
      name:'2',
      value:2
    },{
      name:'3',
      value:3
    }];


    $scope.inputMoviePlot = $scope.moviePlotOptions[0];
    $scope.promiseExampleID = $scope.promiseExampleIDOptions[0];
    //call the service as promise
    $scope.submit = function() {
      if($scope.promiseExampleID.value == 1){
        //First Approach
        var promise = myService.getMovie($scope.inputMovieName, $scope.inputMovieReleaseYear,$scope.inputMoviePlot);
        promise.then(
          function(result){
            myService.data.movieData = result.data;
            $scope.showMovieDetail();
          },
          function(error){
            $log.error('failure Loading Movie data', error)
          }
        )
      }else if ($scope.promiseExampleID.value == 2 ){
        //Second Approach
        var promise1 = myService.getMovie1($scope.inputMovieName, $scope.inputMovieReleaseYear,$scope.inputMoviePlot);
        promise1.then(function(result){
          myService.data.movieData = result.movieDetail;
          $scope.showMovieDetail();
        })
      }else if ($scope.promiseExampleID.value == 3 ){
        //Third Approach
       myService.getMovie2($scope.inputMovieName, $scope.inputMovieReleaseYear,$scope.inputMoviePlot)
         .then(function(result){
           myService.data.movieData = result.movieDetail;
           $scope.showMovieDetail();
         })
        //So, we've reduced the amount of code we have to write to achieve the same result,
        // and we don't have to worry about what happens when the Ajax call
        // fails - it will just fail before calling the chained then function.
      }
    },

    $scope.showMovieDetail = function(){
      $location.path('/detail')

    }
  });
