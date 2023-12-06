import { useSettingsStore } from '@src/state/settings';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserPresentationStyle } from 'expo-web-browser';

/**
 * Whenever we open a link, we have to also pass the current color scheme's BG color for the browser options
 */

/**
 * Open a link in the browser
 * @param {string | undefined} link
 * @param color
 */
export const openLink = (link: string | undefined, color: any): void => {
  // Do nothing if the link is undefined
  if (link == null) return;

  // Are we opening in the browser?
  const { useDefaultBrowser, useReaderMode } = useSettingsStore.getState();

  if (useDefaultBrowser) {
    // Open the link in the browser
    void Linking.openURL(link);
    return;
  }

  void WebBrowser.openBrowserAsync(link, {
    dismissButtonStyle: 'close',
    readerMode: useReaderMode,
    presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
    toolbarColor: color,
  }).then((result) => {
    // If we don't dismiss the browser, some pages will not actually close (i.e. youtube videos)
    WebBrowser.dismissBrowser();
  });
};
