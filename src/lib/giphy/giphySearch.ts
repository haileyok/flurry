import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGiphyGif } from '@src/types';

const GIPHY_KEY = process.env.EXPO_PUBLIC_GIPHY_KEY;

export const giphySearch = async (
  term: string,
  offset = 0,
): Promise<IGiphyGif[]> => {
  const gf = new GiphyFetch(GIPHY_KEY!);
  const { data } = await gf.search(term, {
    limit: 20,
    sort: 'relevant',
    offset,
  });

  return data.map((gif: IGif) => ({
    id: gif.id.toString(),
    url: 'https://i.giphy.com/media/' + gif.id + '/giphy.gif',
    stillUrl: 'https://i.giphy.com/media/' + gif.id + '/giphy_s.gif',
    alt: gif.alt_text ?? gif.title,
    dimensions: {
      width: gif.images.original_still.width,
      height: gif.images.original_still.height,
    },
  }));
};

export const giphyTrending = async (offset = 0): Promise<IGiphyGif[]> => {
  const gf = new GiphyFetch(GIPHY_KEY!);
  const { data } = await gf.trending({ limit: 20, offset });

  return data.map((gif: IGif) => ({
    id: gif.id.toString(),
    url: 'https://i.giphy.com/media/' + gif.id + '/giphy.gif',
    stillUrl: 'https://i.giphy.com/media/' + gif.id + '/giphy_s.gif',
    alt: gif.alt_text ?? gif.title,
    dimensions: {
      width: gif.images.original_still.width,
      height: gif.images.original_still.height,
    },
  }));
};
