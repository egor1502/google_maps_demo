class DemoController {
  constructor($rootScope, $timeout, $cookies, $mdDialog, DemoService) {
    "ngInject";

    this.name = 'demo';
    this.DemoService = DemoService;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;

    this.initMap();

    const _this = this;
    $rootScope.$watch(() => this.$rootScope.state.options, () => {
      if (_this.$rootScope.state.map.getBounds()) {
        _this.DemoService.showNearbyObjects(_this.$rootScope.state);
      }
    });
    $rootScope.$watch(() => this.$rootScope.state.currentTab, () => {
      if (_this.$rootScope.state.map.getBounds()) {
        _this.DemoService.showNearbyObjects(_this.$rootScope.state);
      }
    });

    if (!$cookies.get('attentionAccepted')) {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .title('Attention!')
          .textContent('The data you see may be incorrect. This application uses the basic functions of the Google maps API as is, without fine-tuning.')
          .ariaLabel('Attention alert')
          .ok('Do not show it again')
          .cancel('Ok'))
        .then(() => {
          $cookies.put('attentionAccepted', 'true');
        }, () => {});
    }
  }

  initMap() {
    const location = new google.maps.LatLng(55.755814, 37.617635);

    this.DemoService.createMap('map', location, 15, this.$rootScope.state);
    this.DemoService.setUserPosition(this.$rootScope.state);

    this.$timeout(() => {
      this.DemoService.showNearbyObjects(this.$rootScope.state);

      this.$rootScope.state.map.addListener('center_changed', () => {
        if (this.moveTimeout) {
          this.$timeout.cancel(this.moveTimeout);
        }

        this.moveTimeout = this.$timeout(() => {
          this.DemoService.showNearbyObjects(this.$rootScope.state);
        }, 300);
      });

      this.$rootScope.state.map.addListener('dragstart', () => {
        this.$rootScope.state.infoWindow.close();
      });

      this.$rootScope.state.map.addListener('click', () => {
        this.$rootScope.state.infoWindow.close();
      });
    }, 500);
  }
}

export default DemoController;
