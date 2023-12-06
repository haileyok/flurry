import RNShare, { ShareOptions } from 'react-native-share';
import { Image } from 'expo-image';

interface IShareLinkOptions {
  title?: string;
  uri: string;
  isImage?: boolean;
  callback?: () => unknown;
}

export const shareLink = async ({
  title,
  uri,
  isImage,
  callback,
}: IShareLinkOptions): Promise<void> => {
  let options: ShareOptions = {
    url: uri,
    title,
  };

  // If this is an image share, we can share the cached image
  if (isImage === true) {
    const cachedUri = await Image.getCachePathAsync(uri);

    // TODO Handle an unfound image better
    if (cachedUri === null) return;

    // Get the file type of the image. This is simple since it's in the image URL
    const fileType = `image/${uri.split('@').pop()}`;

    // Set the options for the image share
    options = {
      filename: cachedUri.split('/').pop(),
      type: fileType,
      activityItemSources: [
        {
          placeholderItem: { type: 'url', content: 'url' },
          item: {
            default: {
              type: 'url',
              content: cachedUri,
            },
          },
          dataTypeIdentifier: {
            saveToCameraRoll: fileType,
          },
        },
      ],
    };
  }

  // Present the share dialog
  try {
    await RNShare.open(options);
    callback?.();
  } catch (e) {
    // TODO Toastable
  }
};
