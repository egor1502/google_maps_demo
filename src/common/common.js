import angular from 'angular';
import Header from './header/header';
import SideOptions from './sideOptions/sideOptions';

let commonModule = angular.module('app.common', [
  Header,
  SideOptions
])

.name;

export default commonModule;
