import { jsonToLex, stringifyLex } from '@atproto/api';
import RNFS from 'react-native-fs';

// Polyfill from https://github.com/bluesky-social/social-app/blob/7ccbd14d5f159363ffc3c087281a6a89f770f6b8/src/lib/api/api-polyfill.ts
const GET_TIMEOUT = 15e3; // 15s
const POST_TIMEOUT = 60e3; // 60s

interface FetchHandlerResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

export async function fetchHandler(
  reqUri: string,
  reqMethod: string,
  reqHeaders: Record<string, string>,
  reqBody: any,
): Promise<FetchHandlerResponse> {
  const reqMimeType = reqHeaders['Content-Type'] || reqHeaders['content-type'];
  if (reqMimeType && reqMimeType.startsWith('application/json')) {
    reqBody = stringifyLex(reqBody);
  } else if (
    typeof reqBody === 'string' &&
    (reqBody.startsWith('/') || reqBody.startsWith('file:'))
  ) {
    if (reqBody.endsWith('.jpeg') || reqBody.endsWith('.jpg')) {
      // HACK
      // React native has a bug that inflates the size of jpegs on upload
      // we get around that by renaming the file ext to .bin
      // see https://github.com/facebook/react-native/issues/27099
      // -prf
      const newPath = reqBody.replace(/\.jpe?g$/, '.bin');
      await RNFS.moveFile(reqBody, newPath);
      reqBody = newPath;
    }
    // NOTE
    // React native treats bodies with {uri: string} as file uploads to pull from cache
    // -prf
    reqBody = { uri: reqBody };
  }

  const controller = new AbortController();
  const to = setTimeout(
    () => controller.abort(),
    reqMethod === 'post' ? POST_TIMEOUT : GET_TIMEOUT,
  );

  const res = await fetch(reqUri, {
    method: reqMethod,
    headers: reqHeaders,
    body: reqBody,
    signal: controller.signal,
  });

  const resStatus = res.status;
  const resHeaders: Record<string, string> = {};
  res.headers.forEach((value: string, key: string) => {
    resHeaders[key] = value;
  });
  const resMimeType = resHeaders['Content-Type'] || resHeaders['content-type'];
  let resBody;
  if (resMimeType) {
    if (resMimeType.startsWith('application/json')) {
      resBody = jsonToLex(await res.json());
    } else if (resMimeType.startsWith('text/')) {
      resBody = await res.text();
    } else {
      throw new Error('TODO: non-textual response body');
    }
  }

  clearTimeout(to);

  return {
    status: resStatus,
    headers: resHeaders,
    body: resBody,
  };
}
