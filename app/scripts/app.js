'use strict';

/**
 * @ngdoc overview
 * @name testAngularApp
 * @description
 * # testAngularApp
 *
 * Main module of the application.
 */
angular
  .module('helloApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ])
  .config(function ($routeProvider, $stateProvider, $urlRouterProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).when('/detail', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('myService', function($log, $q ,$http) {
    var api = "http://www.omdbapi.com/?t=";
    var data = {};
    data.movieData = {};

    return {
      /***
      * Most simple promise implementation where it simple call the api and return back the response to the promise.
      * The downside of blindly passing your $http.get promise back to the controller is that the controller has to
      * deal with the result itself. even $http errors need to handle at the controller level, which is not
      * recommended.
      * @param name
      * @param year
      * @param plot
      * @returns {HttpPromise}
      */
      getMovie: function(name, year, plot) {
        var name = name? name : "";
        var year = year? year : "";
        var plot = plot? plot : "short";
        return $http.get(api + name + "&y="+ year + "&plot=" + plot +"&r=json");
      },

      //Second approach
      /***
      * In this approach we have refactor the service to use promise internally ,
      * so we can handle the result in the service and bring back the payload we want.
      * so that we can control both the input and output of the call,
      * log errors appropriately, transform the output, and even provide status
      * updates with deferred.notify(msg).
      *
      * @param name
      * @param year
      * @param plot
      * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|jQuery.ready.promise|*}
      */
      getMovie1 : function( name, year, plot){
      var name = name? name : "";
      var year = year? year : "";
      var plot = plot? plot : "short";

      var deferred = $q.defer();
      $http.get(api + name + "&y="+ year + "&plot=" + plot +"&r=json")
        .success(function(data){
          deferred.resolve({
            movieDetail : data
          })
        }).error(function(msg,code){
          defferred.reject(msg);
          $log.error(msg,code);
        });
      return deferred.promise;
      },
      //Third Approach ;
      /***
       * Without creating our own deferred object managing a separate promise
       * by transforming your response within a then method and returning a
       * transformed result to the caller automatically
       *
       * @param name
       * @param year
       * @param plot
       * @returns {*}
       */
      getMovie2 : function(name, year, plot){
        var name = name? name : "";
        var year = year? year : "";
        var plot = plot? plot : "short";

        //Now the content returned in the then of the service method will be a chained promise
        // that transforms the output. The controller then can do the same non-http work
        return $http.get(api + name + "&y="+ year + "&plot=" + plot +"&r=json")
          .then(
            function(response){
              return {
                movieDetail : response.data
              }
            });
      },

      data : function(){
        return data;
      }
    }

  });
