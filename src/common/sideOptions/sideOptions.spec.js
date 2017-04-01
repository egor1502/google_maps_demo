import SideOptionsModule from './sideOptions'
import SideOptionsController from './sideOptions.controller';
import SideOptionsComponent from './sideOptions.component';
import SideOptionsTemplate from './sideOptions.html';

describe('SideOptions', () => {
  let $rootScope, makeController;

  beforeEach(window.module(SideOptionsModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new SideOptionsController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(SideOptionsTemplate).to.match(/{{\s?\$ctrl\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = SideOptionsComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(SideOptionsTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(SideOptionsController);
      });
  });
});
