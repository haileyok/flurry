interface Dimensions {
  width: number;
  height: number;
}

export interface IGiphyGif {
  id: string;
  url: string;
  stillUrl: string;
  alt: string;
  dimensions: Dimensions;
}
