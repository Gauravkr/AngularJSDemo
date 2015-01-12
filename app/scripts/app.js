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
    'ui.router',
    'ngMockE2E'
  ]).run(
    function($httpBackend) {
      /*var phones = [{name: 'phone1'}, {name: 'phone2'}];
      $httpBackend.whenPOST('/phones').respond(function(method, url, data, headers){
        console.log('Received these data:', method, url, data, headers);
        phones.push(angular.fromJson(data));
        return [200, {}, {}];
      });

      $httpBackend.whenGET('/phones').respond(function(method,url,data) {
        console.log("Getting phones");
        return [200, phones, {}];
      });*/
      var customerList = [{
        _id: 123213,
        code: 'C1',
        name: 'Gaurav'
      }, {
        _id: 234234,
        code: 'C2',
        name: 'Nachiket'
      }, {
        _id: 322223,
        code: 'C3',
        name: 'Abhay'
      }];


      function findCustomerIndexById(id) {
        if (!id) return null;
        var index = -1;

        for (var i = 0; i < customerList.length; i++) {
          var o = customerList[i];
          if (id == o._id) {
            index = i;
            break;
          }
        }

        return index;
      }

      $httpBackend.whenGET("partials/partial1.html").respond("GET Called 1");
      $httpBackend.whenGET("partials/partial2.html").respond("GET Called 2");
      $httpBackend.whenGET(/\/api\/customers(\/\d*)*/).respond(function (method, url, data, headers) {
        var parts = url.replace("/api/customers", "").split("/");
        if (parts.length != 2) {
          return [200, customerList.slice()];
        }

        var id = parts[1];

        var index = findCustomerIndexById(id);

        if (index != -1) {
          return [200, customerList[index]];
        }

        return [404, "NOT-FOUND"];
      });

      //$httpBackend.whenGET(/\/api\/customers/).respond(200, customerList.slice());


      $httpBackend.whenPOST("/api/customers").respond(function (method, url, data, headers) {
        console.log("POST -> " + url);
        var o = angular.fromJson(data);
        o._id = new Date().getTime();
        customerList.push(o);
        return [200, "Success"];
      });

      $httpBackend.whenPUT(/\/api\/customers(\/\d*)*/).respond(function (method, url, data, headers) {
        console.log("PUT -> " + url);

        var o = angular.fromJson(data);
        var index = findCustomerIndexById(o._id);

        if (index != -1) {
          customerList[index] = o;
          return [200, 'SUCCESS!!'];
        }

        return [404, 'NOT-FOUND!!'];
      });


      $httpBackend.whenDELETE(/\/api\/customers\/\d*/).respond(function (method, url, data, headers) {
        console.log("DELETE -> " + url);

        var parts = url.replace("/api/customers", "").split("/");
        if (parts.length != 2) {
          return [409, "invalid id"];
        }

        var id = parts[1];

        var index = findCustomerIndexById(id);

        if (index != -1) {
          customerList.splice(index, 1);
          return [200, 'SUCCESS!!'];
        }

        return [404, 'NOT-FOUND!!'];
      });

      $httpBackend.whenGET(/views\//).passThrough();
      $httpBackend.whenGET(/\//).passThrough();
    })
  .config(function ($routeProvider) {
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
      }).when('/server', {
          templateUrl: 'views/serverInteraction.html',
          controller: 'ServerCtrl'
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
