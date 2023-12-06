import * as Manipulate from 'expo-image-manipulator';
import { SelectedImage } from '@src/components/NewPost/components/SelectedImages';
import RNFS from 'react-native-fs';
import { createNewDimensions } from '@src/lib/image/createNewDimensions';

const MAX_SIZE = 975;
const MAX_DIMENSION = 2048;

export const compressImage = async (
  image: SelectedImage,
  compressionScale = 0.95,
): Promise<SelectedImage> => {
  // See if we need to do any compression or resizing
  const needsResizing =
    image.width > MAX_DIMENSION || image.height > MAX_DIMENSION;
  if (image.size < MAX_SIZE && !needsResizing) {
    return image;
  }

  // Scale down the image to the largest dimensions if needed
  if (needsResizing) {
    image = {
      ...image,
      ...createNewDimensions(
        {
          width: image.width,
          height: image.height,
        },
        MAX_DIMENSION,
      ),
    };
  }

  // Compress the image
  try {
    // Compress the image
    const res = await Manipulate.manipulateAsync(
      image.uri,
      [
        {
          // Reduce the image dimensions so we don't have to compress as much
          resize: {
            width: image.width * compressionScale,
            height: image.height * compressionScale,
          },
        },
      ],
      // Save the image as a JPEG and compress it
      {
        format: Manipulate.SaveFormat.JPEG,
        compress: compressionScale,
      },
    );

    // Cleanup the old file
    await RNFS.unlink(image.uri);

    // Update the image
    image = {
      ...image,
      uri: res.uri,
      size: await getFileSize(res.uri),
    };

    // Send it back through
    return await compressImage(image, compressionScale - 0.05);
  } catch (e) {
    throw new Error('Compression failed.');
  }
};

const getFileSize = async (uri: string): Promise<number> => {
  const res = await RNFS.stat(uri);

  return res.size / 1000;
};
