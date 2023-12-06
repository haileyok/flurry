import { IPost } from '@src/types/data';

export const filterDuplicatePosts = (
  currentPosts: IPost[],
  newPosts: IPost[],
): IPost[] => {
  const seen: Record<string, boolean> = {};

  for (const currentPost of currentPosts) {
    seen[currentPost.uri] = true;
  }

  return newPosts.filter((p) =>
    Object.prototype.hasOwnProperty.call(seen, p.cid)
      ? false
      : (seen[p.cid] = true),
  );
};
