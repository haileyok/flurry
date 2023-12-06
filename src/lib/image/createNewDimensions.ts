interface Dimensions {
  width: number;
  height: number;
}

export const createNewDimensions = (
  dimensions: Dimensions,
  maxSize: number,
): Dimensions => {
  const { width, height } = dimensions;

  // Figure out the ratio
  const ratio = Math.min(maxSize / width, maxSize / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};
