class SideOptionsController {
  constructor($scope, $rootScope, $mdSidenav) {
    "ngInject";
    this.name = 'sideOptions';
    this.$rootScope = $rootScope;

    this.cancelChanges = false;
    this.options = Object.assign({}, $rootScope.state.options);

    $scope.$watch(() => $rootScope.state.sideOptionsOpened, (newVal) => {
      if (newVal === true) {
        this.cancelChanges = false;
        this.options = Object.assign({}, $rootScope.state.options);
      } else {
        if (!this.cancelChanges) {
          this.applyChanges();
        }
      }
    });
  }

  applyChanges() {
    this.$rootScope.state.options = Object.assign({}, this.options);
  }
}

export default SideOptionsController;
