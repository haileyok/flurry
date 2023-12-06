import React from 'react';
import { IGenerator } from '@src/types/data';
import ContextMenuButton from '@src/components/Common/Button/ContextMenuButton';
import { IContextMenuActionGroup } from '@src/types/IContextMenuAction';
import { useClient } from '@root/App';

interface IProps {
  generator: IGenerator;
}

function FeedListItemContextButton({ generator }: IProps): React.JSX.Element {
  const client = useClient();

  const actions: IContextMenuActionGroup[] = [
    {
      key: 'group1',
      actions: [
        {
          key: 'pinFeed',
          label: generator.pinned ? 'Unpin Feed' : 'Pin Feed',
          iconName: generator.pinned ? 'pin.slash' : 'pin',
          onSelect: () => {
            void client.pinFeed(generator.uri, !generator.pinned);
          },
        },
        {
          key: 'saveFeed',
          label: generator.saved ? 'Remove Feed' : 'Save Feed',
          iconName: 'trash',
          onSelect: () => {
            void client.saveFeed(generator.uri, generator.saved);
          },
        },
      ],
    },
  ];

  return <ContextMenuButton actions={actions} />;
}

export default React.memo(FeedListItemContextButton);
