/**
 * Created by Kumar Gaurav(kumar.gaurav@synerzip.com) on 12/1/15.
 */
'use strict';

/**
 * @ngdoc function
 * @name helloApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the helloApp
 */
angular.module('helloApp')
  .controller('FormDemoCtrl', function ($scope) {
    $scope.subjectListOptions = [
      {
        name: 'bug',
        value: 'Report a Bug'
      },{
        name: 'account',
        value: 'Account Problems'
      },{
        name: 'mobile',
        value: 'Mobile'
      },{
        name: 'user',
        value: 'Report a Malicious User'
      },{
        name: 'other',
        value: 'Other'
      }];
    $scope.subjectList = $scope.subjectListOptions[0];
    $scope.submitted = false;

    $scope.resetForm = function(formData){
      formData = {};
      $scope.helpForm.$invalid = true;
    }

    $scope.$watch('helpForm.$valid',function(newVal){
      $scope.isFormValid = newVal;
    });
    $scope.$watch('helpForm.$invalid',function(newVal){
      $scope.isFormValid = newVal;
    });


    // intialize datapicker
    $scope.today = function() {
      $scope.helpForm.dateofIssue = new Date();
    };


    $scope.clear = function () {
      $scope.helpForm.dateofIssue = null;
    };
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['MM-dd-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.$on('$viewContentLoaded',function(){
      jQuery('#loading').hide();
    });
  });