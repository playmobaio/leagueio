import * as mixpanel from 'mixpanel-browser';

const prodToken = "1fd18f1ca857fbd985f7e75b70a184f6";
const devToken = "03b620b2f888299a9625325440a545c6";
const productionHost = "playmoba";

export default function registerMixpanel(): void {
  const config = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    api_host: "http://localhost:3000/mixpanel-proxy"
  }
  if (window.location.hostname.toLowerCase().search(productionHost) != -1) {
    mixpanel.init(prodToken, config);
  } else {
    console.log('Metrics sent to dev instance.')
    mixpanel.init(devToken, config);
  }
  mixpanel.track('visited landing page');
}
