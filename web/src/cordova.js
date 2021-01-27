import { select } from 'd3-selection';

import { history } from './helpers/router';
import { store } from './store';

export const cordovaApp = {
  // Application Constructor
  initialize() {
    this.bindEvents();
  },

  bindEvents() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('resume', this.onResume, false);
    document.addEventListener('backbutton', this.onBack, false);
  },

  onBack(e) {
    // Go to previous page if it exists, otherwise exit the app.
    if (history.length > 1) {
      history.goBack();
      e.preventDefault();
    } else {
      navigator.app.exitApp();
    }
  },

  onDeviceReady() {
    // Resize if we're on iOS
    if (cordova.platformId === 'ios') {
      // TODO(olc): What about Xr and Xs?
      const extraPadding = (device.model === 'iPhone10,3' || device.model === 'iPhone10,6')
        ? 30
        : 20;
      select('#header')
        .style('padding-top', `${extraPadding}px`);
      select('#mobile-header')
        .style('padding-top', `${extraPadding}px`);

      select('.controls-container')
        .style('margin-top', `${extraPadding}px`);

      select('.flash-message .inner')
        .style('padding-top', `${extraPadding}px`);

      select('.mapboxgl-zoom-controls')
        .style('transform', `translate(0,${extraPadding}px)`);
      select('.layer-buttons-container')
        .style('transform', `translate(0,${extraPadding}px)`);
    }

    codePush.sync(null, { installMode: InstallMode.ON_NEXT_RESUME });
  },

  onResume() {
    // Count as app visit
    store.dispatch({ type: 'TRACK_EVENT', payload: { eventName: 'Visit' } });
    codePush.sync(null, { installMode: InstallMode.ON_NEXT_RESUME });
  },
};
