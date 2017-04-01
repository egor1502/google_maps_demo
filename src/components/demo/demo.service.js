class DemoService {

  constructor(mapStyles, $mdDialog, $timeout, $interval) {
    "ngInject";

    this.mapStyles = mapStyles;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.$interval = $interval;
  }

  createMap(id, center, zoom, state) {
    state.map = new google.maps.Map(document.getElementById(id), {
      center,
      zoom,
      styles: this.mapStyles,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false
    });

    state.infoWindow = new google.maps.InfoWindow();

    this.$interval(() => {
      if (!document.querySelector('.map__pointer')) {
        const parent = document.querySelector('#map > div > div > div');
        const element = document.createElement('div');
        element.className = 'map__pointer';

        if (parent) {
            parent.insertBefore(element, parent.children[3]);
        }
      }
    }, 300);

    return state.map;
  }

  showNearbyObjects(state) {
    const _this = this;

    const request = {
      types: [state.currentTab],
      openNow: state.options.isOpened,
      minPriceLevel: 0,
      maxPriceLevel: state.options.priceLevel,
      location: _this.getMapCenter(state),
      radius: state.options.maxDistance,
    };

    const service = new google.maps.places.PlacesService(state.map);
    service.nearbySearch(request, (...args) => {this.showPlaces(state, ...args)});
  }

  showPlaces(state, places, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      places = places.filter((item) => {
        if (state.options.noRating && !item.hasOwnProperty('rating')) {
          return true;
        } else if (!state.options.noRating && !item.hasOwnProperty('rating')) {
          return false;
        }

        if (item.rating >= state.options.minRating) {
          return true;
        }

        return false;
      });

      for (let place of places) {
        this.showMarker(place, state);
      }

      if (!state.markerClusterer) {
        state.markerClusterer = new MarkerClusterer(state.map, state.markers,
          {imagePath: '/assets/images/m'});
      } else {
        state.markerClusterer.clearMarkers();
        state.markerClusterer = new MarkerClusterer(state.map, state.markers,
          {imagePath: '/assets/images/m'});
      }

      this.$timeout(() => {
        this.stylingPopup();
      });

      if (state.markers.length > 0) {
        this.removeUnusedMarkers(state, places);
      }

    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      this.removeUnusedMarkers(state);
    } else {
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Ooops!')
          .textContent('An error occurred while loading the data. It may be connection error or Google service error. Please try again later.')
          .ariaLabel('Data fetch error')
          .ok('Ok'));
    }
  }

  showMarker(place, state) {

    if (state.prevPlaces && state.prevPlaces.has(place.place_id)) {
      return;
    } else {
      let marker = new google.maps.Marker({
        map: state.map,
        position: place.geometry.location,
        icon: {
          url: require('./images/map-marker.svg'),
          size: new google.maps.Size(20, 20),
          scaledSize: new google.maps.Size(20, 20)
        }
      });

      marker.place_id = place.place_id;

      const _this = this;
      marker.addListener('click', function () {
        state.infoWindow.setContent(_this.getInfoWindowContent(place));
        state.infoWindow.open(state.map, marker);
        _this.stylingPopup();
      });

      state.markers.push(marker);
    }
  }

  stylingPopup() {
    const infoWindowWrapper = document.querySelectorAll('.gm-style-iw')[0];
    const infoWindow = document.querySelectorAll('.info-window')[0];
    if (infoWindow && infoWindowWrapper) {
      angular.element(infoWindowWrapper.previousElementSibling).addClass('info-window__wrapper');
    }
  }

  getInfoWindowContent(place) {
    return `
      <div class="info-window">
        <div class="info-window__photo">
          <img src="${ place.photos ? place.photos[0].getUrl({maxWidth: 200, maxHeight: 200}) : '' }">
        </div>
        
        <div class="info-window__title">${ place.name }</div>
        <div class="info-window__rating" style="width: ${75 * (place.rating / 5)}px">
          <div class="info-window__rating-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 512">
              <path d="M192.71 194.59L256 12.523l63.297 182.067L512 198.523 358.4 314.977l55.826 184.5L256 389.375 97.78 499.477l55.82-184.5L0 198.523z" fill="rgb(255, 235, 59)"/>
              <path d="M704.71 194.59L768 12.523l63.297 182.067L1024 198.523 870.4 314.977l55.826 184.5L768 389.375 609.78 499.477l55.82-184.5L512 198.523z" fill="rgb(255, 235, 59)"/>
              <path d="M1216.71 194.59L1280 12.523l63.297 182.067L1536 198.523l-153.6 116.454 55.826 184.5L1280 389.375l-158.22 110.102 55.82-184.5L1024 198.523z" fill="rgb(255, 235, 59)"/>
              <path d="M1728.71 194.59L1792 12.523l63.297 182.067L2048 198.523l-153.6 116.454 55.826 184.5L1792 389.375l-158.22 110.102 55.82-184.5L1536 198.523z" fill="rgb(255, 235, 59)"/>
              <path d="M2240.71 194.59L2304 12.523l63.297 182.067L2560 198.523l-153.6 116.454 55.826 184.5L2304 389.375l-158.22 110.102 55.82-184.5L2048 198.523z" fill="rgb(255, 235, 59)"/>
            </svg>
          </div>
        </div>
        <div class="info-window__addr">${ place.vicinity }</div>
        <a class="info-window__direction-link"
           target="_blank"
           href="https://www.google.com/maps?daddr=${ place.geometry.location.lat() },${ place.geometry.location.lng() }">Get direction here</a>
      </div>
    `;
  }

  removeUnusedMarkers(state, places) {

    if (places) {
      places = new Set(places.map((item) => item.place_id));
      state.prevPlaces = places;
    }

    state.markers = state.markers.filter((item) => {
      if (!places || !places.has(item.place_id)) {
        item.setMap(null);
        return false;
      }
      return true;
    });
  }

  getMapCenter(state) {
    return state.map.getCenter();
  }

  getMapBounds(state) {
    return state.map.getBounds();
  }

  setUserPosition(state) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        state.map.setCenter(pos);
      }, () => {
        this.$mdDialog.show(
          this.$mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Ooops!')
            .textContent('An error occurred while searching your position. Have you accepted location request? Please try again later or search your position manually.')
            .ariaLabel('Location search error')
            .ok('Ok'));
      });
    } else {
      // Browser doesn't support Geolocation
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Ooops!')
          .textContent('Your browser does\'t support HTML5 Geolocation API. Please, use another browser or search your position manually.')
          .ariaLabel('Location search error')
          .ok('Ok'));
    }
  }
}

export default DemoService;
