import angular from 'angular';
import ngAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import mapStyles from './common/mapStyles'

import 'normalize.css';
import 'angular-material/angular-material.css';

import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

angular.module('app', [
  uiRouter,
  ngCookies,
  ngAria,
  ngAnimate,
  ngMaterial,
  Common,
  Components
])
  .config(($locationProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');
  })

  .config(($mdThemingProvider) => {
    "ngInject";

    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('yellow')
      .dark();
  })

  .run(appRun)

  .constant('mapStyles', mapStyles)

  .component('app', AppComponent);

function appRun($rootScope) {
  "ngInject";

  $rootScope.state = {
    currentTab: 'cafe',
    sideOptionsOpened: false,
    options: {
      isOpened: true,
      maxDistance: 1000,
      noRating: false,
      minRating: 3,
      priceLevel: 3
    },
    map: null,
    markers: [],
    infoWindow: null
  };
}
