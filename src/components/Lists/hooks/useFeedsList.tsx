import { IGenerator } from '@src/types/data';
import { useMemo } from 'react';

interface UseFeedsListOptions {
  feeds: IGenerator[] | undefined;
  alphabetize?: boolean;
  addLabels?: boolean;
  showPinned?: boolean;
}

export const useFeedsList = ({
  feeds,
  alphabetize = false,
  addLabels = false,
  showPinned = false,
}: UseFeedsListOptions): Array<IGenerator | string> => {
  const pinnedFeeds = useMemo(() => feeds?.filter((f) => f.pinned), [feeds]);

  const items = useMemo(() => {
    // Join the feeds if necessary
    let allFeeds: Array<string | IGenerator> = feeds ?? [];

    // Alphabetize the feeds
    if (alphabetize) {
      allFeeds = allFeeds.sort((a, b) =>
        (a as IGenerator).name.localeCompare((b as IGenerator).name),
      );
    }

    // Add the pinned label
    if (showPinned && pinnedFeeds != null) {
      allFeeds = [...pinnedFeeds, ...allFeeds];
      allFeeds.splice(pinnedFeeds.length, 0, 'Saved Feeds');
      allFeeds.unshift('Pinned Feeds');
    }

    // Add labels
    if (addLabels) {
      let lastCharCode = -1;
      allFeeds = allFeeds.flatMap((f) => {
        if (typeof f === 'string') {
          return f;
        }
        const firstCharCode = f.name.charCodeAt(0);

        if (firstCharCode > lastCharCode) {
          lastCharCode = firstCharCode;
          return [String.fromCharCode(firstCharCode), f];
        }

        return f;
      });
    }

    return allFeeds;
  }, [addLabels, alphabetize, feeds, pinnedFeeds, showPinned]);

  return items;
};
