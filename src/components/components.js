import angular from 'angular';
import Demo from './demo/demo';

let componentModule = angular.module('app.components', [
  Demo
])

.name;

export default componentModule;
