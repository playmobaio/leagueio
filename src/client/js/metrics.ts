import * as mixpanel from 'mixpanel-browser';
import constants from '../../models/constants';
import MixpanelEvents from './mixpanelEvents'

const productionHost = "playmoba";

export default function registerMixpanel(): void {
  console.log(window.location)
  if (window.location.hostname.toLowerCase().search(productionHost) != -1) {
    mixpanel.init(constants.MIXPANEL_PROD_TOKEN);
  } else {
    console.log('Metrics sent to dev instance.')
    mixpanel.init(constants.MIXPANEL_DEV_TOKEN);
  }
  mixpanel.track(MixpanelEvents.VISITED_LANDING_PAGE);
}
