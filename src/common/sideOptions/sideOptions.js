import angular from 'angular';
import uiRouter from 'angular-ui-router';
import sideOptionsComponent from './sideOptions.component';

let sideOptionsModule = angular.module('sideOptions', [
  uiRouter
])

.component('sideOptions', sideOptionsComponent)

.name;

export default sideOptionsModule;
