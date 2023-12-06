import React, { useCallback } from 'react';
import { useFollowMutation } from '@src/api/queries/bsky/useFollowMutation';
import MainButton from '@src/components/Common/Button/MainButton';
import { useClient } from '@root/App';

interface IProps {
  isFollowing: boolean;
  id: string;
  followingUri: string | undefined;
  width?: number;
  floatRight?: boolean;
}

/**
 * Button that will mutate the followers and change color/text upon follow/unfollow of the passed data
 * @param id
 * @param isFollowing
 * @param followingUri
 * @param width
 * @param floatRight
 * @constructor
 */
function FollowButton({
  id,
  isFollowing,
  followingUri,
  width = 90,
  floatRight = false,
}: IProps): React.JSX.Element {
  const client = useClient();

  const followMutation = useFollowMutation(client);

  const onFollowPress = useCallback(() => {
    followMutation.mutate({
      id,
      followUri: followingUri,
    });
  }, [followMutation, followingUri, id]);

  return (
    <MainButton
      label={isFollowing ? 'Unfollow' : 'Follow'}
      onPress={onFollowPress}
      highlight={!isFollowing}
      width={width}
      floatRight={floatRight}
    />
  );
}

export default React.memo(FollowButton);
