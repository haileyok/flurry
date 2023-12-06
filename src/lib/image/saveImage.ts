import RNFS from 'react-native-fs';

interface SaveImageToDisk {
  uri: string;
  size: number;
}

export const saveImageToDisk = async (
  remoteUri: string,
  fileName: string,
): Promise<SaveImageToDisk> => {
  const localUri = RNFS.DocumentDirectoryPath + '/' + fileName;

  const res = await RNFS.downloadFile({
    fromUrl: remoteUri,
    toFile: localUri,
  }).promise;

  return {
    uri: localUri,
    size: res.bytesWritten,
  };
};
