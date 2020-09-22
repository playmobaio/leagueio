import * as mixpanel from 'mixpanel-browser';
import MixpanelEvents from './mixpanelEvents'

const prodToken = "1fd18f1ca857fbd985f7e75b70a184f6";
const devToken = "03b620b2f888299a9625325440a545c6";
const productionHost = "playmoba";

export default function registerMixpanel(): void {
  console.log(window.location)
  if (window.location.hostname.toLowerCase().search(productionHost) != -1) {
    mixpanel.init(prodToken);
  } else {
    console.log('Metrics sent to dev instance.')
    mixpanel.init(devToken);
  }
  mixpanel.track(MixpanelEvents.VISITED_LANDING_PAGE);
}
