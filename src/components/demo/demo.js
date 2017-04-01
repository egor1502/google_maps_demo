import angular from 'angular';
import uiRouter from 'angular-ui-router';
import demoComponent from './demo.component';
import demoService from './demo.service';

let demoModule = angular.module('demo', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('demo', {
      url: '/',
      component: 'demo'
    });
})

.service('DemoService', demoService)

.component('demo', demoComponent)

.name;

export default demoModule;
