/**
 * https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/url-helpers.ts#L40
 * https://github.com/bluesky-social/social-app/blob/main/src/lib/strings/rich-text-manip.ts
 */

import { RichText, UnicodeString } from '@atproto/api';

export function toShortUrl(url: string): string {
  try {
    const urlp = new URL(url);
    if (urlp.protocol !== 'http:' && urlp.protocol !== 'https:') {
      return url;
    }
    const path =
      (urlp.pathname === '/' ? '' : urlp.pathname) + urlp.search + urlp.hash;
    if (path.length > 15) {
      return urlp.host + path.slice(0, 13) + '...';
    }
    return urlp.host + path;
  } catch (e) {
    return url;
  }
}

export function shortenLinks(rt: RichText): RichText {
  if (!rt.facets?.length) {
    return rt;
  }
  rt = rt.clone();
  // enumerate the link facets
  if (rt.facets) {
    for (const facet of rt.facets) {
      const isLink = !!facet.features.find(
        (f) => f.$type === 'app.bsky.richtext.facet#link',
      );
      if (!isLink) {
        continue;
      }

      // extract and shorten the URL
      const { byteStart, byteEnd } = facet.index;
      const url = rt.unicodeText.slice(byteStart, byteEnd);
      const shortened = new UnicodeString(toShortUrl(url));

      // insert the shorten URL
      rt.insert(byteStart, shortened.utf16);
      // update the facet to cover the new shortened URL
      facet.index.byteStart = byteStart;
      facet.index.byteEnd = byteStart + shortened.length;
      // remove the old URL
      rt.delete(byteStart + shortened.length, byteEnd + shortened.length);
    }
  }
  return rt;
}
