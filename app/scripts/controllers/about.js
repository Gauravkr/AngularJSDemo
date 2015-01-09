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


    $scope.promiseExampleDescription =[];
    $scope.promiseExampleDescription[0] = "Most simple promise implementation where it simply call the api and return " +
    "back the response to the promise. The downside of blindly passing your $http.get promise back to the controller " +
    "is that the controller has to deal with the result itself. even $http errors need to handle at the controller " +
    "level, which is not recommended.";

    $scope.promiseExampleDescription[1] ="In this approach we have refactor the service to use promise internally ," +
    "so we can handle the result in the service and bring back the payload we want, So that we can control both " +
    "the input and output of the call, log errors appropriately, transform the output, and even provide status " +
    "updates with deferred.notify(msg).";
    $scope.promiseExampleDescription[2] = "Without creating our own deferred object managing a separate promise " +
    "by transforming your response within a then method and returning a transformed result to the caller " +
    "automatically. So, we've reduced the amount of code we have to write to achieve the same result, " +
    "and we don't have to worry about what happens when the Ajax call fils - it will just fail before " +
    "calling the chained then function."

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
