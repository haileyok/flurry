import { QueryClient } from '@tanstack/react-query';
import {
  FeedViewPost,
  GeneratorView,
  PostView,
  ThreadViewPost,
} from '@atproto/api/src/client/types/app/bsky/feed/defs';
import {
  IEmbed,
  IEmbedType,
  IExternal,
  IGenerator,
  IImage,
  ILabels,
  IList,
  INotification,
  IPerson,
  IPost,
  IPreferences,
  IThreadPost,
  LabelType,
  NotificationType,
  TransformThreadPostOptions,
} from '@src/types/data';
import {
  IBskyEmbed,
  IBskyEmbedRecord,
  IBskyImage,
  IBskyPostRecord,
} from '@src/types/bsky';
import {
  AppBskyEmbedRecord,
  AppBskyFeedDefs,
  AppBskyNotificationListNotifications,
  Label,
  RichText,
} from '@atproto/api';
import { Image } from 'expo-image';
import {
  ListView,
  ListViewBasic,
} from '@atproto/api/src/client/types/app/bsky/graph/defs';
import {
  ProfileView,
  ProfileViewDetailed,
} from '@atproto/api/src/client/types/app/bsky/actor/defs';
import { Client } from '@src/api/Client';

export default class BskyTransformer {
  private readonly queryClient?: QueryClient;

  constructor(queryClient?: QueryClient) {
    this.queryClient = queryClient;
  }

  private readonly getPreferences = (): IPreferences => {
    return this.queryClient!.getQueryData(['preferences'])!;
  };

  public createLink = (host: string, handle?: string, uri?: string): string => {
    return `https://${host}/profile/${handle}/post/${uri}
    .split('/')
    .pop()}`;
  };

  public createParentChain = (
    post: ThreadViewPost | undefined,
  ): IThreadPost[] => {
    // Create an array for the posts
    const chain: IThreadPost[] = [];

    // Set the current post
    let currentPost: ThreadViewPost | undefined = post;

    // Loop until we get to the top
    while (currentPost != null) {
      // Push the current post
      chain.push(
        this.transformThreadPost({
          thread: currentPost,
          depth: 1,
          hasParent: currentPost.parent != null,
          hasReply: true,
          hasMoreAtDepths: [],
        }),
      );

      // Set the current post to the next parent
      currentPost = currentPost.parent as ThreadViewPost;
    }

    // Return in reverse order
    return chain.reverse();
  };

  public createReplyChain = (thread: ThreadViewPost): IThreadPost[] => {
    // Return an empty array if there are no replies. We would rather return an array than undefined so that we can
    // easily push in a reply if we make one
    if (thread.replies == null || thread.replies.length < 1) {
      return [];
    }

    // Sort first
    // We don't have to worry about the types here. They will be filtered out during rendering anyway.
    thread.replies = this.sortReplies(thread.replies as ThreadViewPost[]);

    const replies: IThreadPost[] = [];

    // Loop through all the top level replies
    for (const reply of thread.replies) {
      replies.push(
        ...this.createReplyChainInner({
          thread: reply as ThreadViewPost,
          depth: 1,
          hasMoreAtDepths: [],
        }),
      );
    }

    return replies;
  };

  public createReplyChainInner = ({
    thread,
    depth = 0,
    hasMoreAtDepths,
  }: TransformThreadPostOptions): IThreadPost[] => {
    // Create the reply chain
    const replyChain = [
      this.transformThreadPost({
        thread,
        depth,
        hasParent: depth !== 1,
        hasReply: thread?.replies != null && thread.replies.length > 0,
        hasMoreAtDepths,
      }),
    ];

    // If the post has replies, add them to the chain
    if (thread.replies != null && thread.replies.length > 0) {
      // Loop through all the replies
      for (const [index, reply] of thread.replies.entries()) {
        // Add the reply to the chain
        const hasMore = index !== thread.replies.length - 1;
        const atDepths = [...hasMoreAtDepths, ...(hasMore ? [depth] : [])];

        replyChain.push(
          ...this.createReplyChainInner({
            thread: reply as ThreadViewPost,
            depth: depth + 1,
            hasMoreAtDepths: atDepths,
          }),
        );
      }
    }

    return replyChain;
  };

  public sortReplies = (
    replies: ThreadViewPost[],
    depth = 1,
  ): ThreadViewPost[] => {
    const { threadSort } = this.getPreferences();

    // Posts are already in 'newest' order, so there's nothing we have to do in that case.

    if (threadSort === 'oldest') {
      replies = replies.reverse();
    } else if (threadSort === 'most-likes') {
      replies = replies.sort((a, b) => {
        return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
      });
    } else if (threadSort === 'random' && depth === 1) {
      // Only shuffle if the depth is one. The rest of the replies should maintain their order
      replies = replies.sort(() => Math.random() - 0.5);
    }

    return replies;
  };

  public flattenThread = (thread: IThreadPost): IThreadPost[] => {
    const flattened: IThreadPost[] = [];

    // Flatten the parents
    if (thread.parentPosts != null) {
      for (const parent of thread.parentPosts) {
        flattened.push(parent);
      }
    }

    // Add the main post
    if (thread.depth === 0) {
      flattened.push(thread);
    }

    // Flatten the replies
    if (thread.replyPosts != null) {
      flattened.push(...thread.replyPosts);
    }

    return flattened;
  };

  public transformContentLabels = (bskyLabels?: Label[]): ILabels => {
    const preferences = this.getPreferences();

    // Set the default labels
    const labels = {
      ...defaultLabels,
    };

    // Just return if we don't have any labels to look at
    if (bskyLabels == null || bskyLabels.length < 1) {
      return labels;
    }

    // Loop through each label
    for (const label of bskyLabels) {
      let updated = false;

      for (const labelType of bskyLabelTypes) {
        const isLabel = labelType.values.includes(label.val);
        labels[labelType.labelName] = isLabel;

        // Get the user preference for this label
        const visibilityPreference = preferences[labelType.labelName];

        // If the user shows this content anyway, skip it
        if (!isLabel || visibilityPreference === 'show') continue;

        labels.warning = labelType.warning;
        labels.message = labelType.message;

        // If the user hides this content, set the label to hidden
        if (visibilityPreference === 'hide') {
          labels.isRendered = false;
        }

        // If the user warns for this content, set the label to shown
        else if (visibilityPreference === 'warn') {
          labels.isHidden = true;
        }

        updated = true;
        break;
      }

      // If we updated the labels, break out of the loop
      if (updated) break;
    }

    return labels;
  };

  public transformEmbed = (embed: IBskyEmbed): IEmbed => {
    // Get the embed type
    const getEmbedType = (): IEmbedType => {
      if (embed.images != null) {
        return 'image';
      } else if (embed.external != null) {
        return 'external';
      } else if (embed.record != null) {
        // TODO This doesn't feel right. Is there not a better way to get this?
        const $type = (embed.record as IBskyEmbedRecord).$type;

        if ($type === 'app.bsky.feed.defs#generatorView') {
          return 'generator';
        } else if ($type === 'app.bsky.graph.defs#listView') {
          return 'list';
        } else if (embed.record.record != null) {
          return 'postWithMedia';
        } else {
          return 'post';
        }
      }

      return 'none';
    };
    const embedType = getEmbedType();

    // Get the images if necessary
    const transformImages = (): IImage[] | undefined => {
      if (
        embedType !== 'image' &&
        (embedType !== 'postWithMedia' || embed.media?.images == null)
      ) {
        return;
      }

      const images = embed.media?.images ?? embed.images!;

      return (images as []).map((image: IBskyImage) => {
        // We want to prefetch the thumbnails if we get any
        void Image.prefetch(image.thumb);

        return {
          thumb: image.thumb,
          full: image.fullsize,
          height: image.aspectRatio?.height ?? 0,
          width: image.aspectRatio?.width ?? 0,
          alt: image.alt,
        };
      });
    };

    const transformExternal = (): IExternal | undefined => {
      if (
        embedType !== 'external' &&
        (embedType !== 'postWithMedia' || embed.media?.external == null)
      ) {
        return undefined;
      }

      const external = embed.media?.external ?? embed.external!;

      return {
        uri: external.uri,
        title: external.title,
        description: external.description,
        thumb: external.thumb,
      };
    };

    const transformGeneratorView = (): IGenerator | undefined => {
      if (embedType !== 'generator') return undefined;

      const record = embed.record as unknown as GeneratorView;

      return this.transformGeneratorView(record);
    };

    const transformListView = (): IList | undefined => {
      if (embedType !== 'list') return undefined;

      const record = embed.record as unknown as ListView;

      return this.transformListView(record);
    };

    const transformEmbeddedPost = ():
      | Omit<IPost, 'replyRef' | 'shareLink'>
      | undefined => {
      if (embedType !== 'post' && embedType !== 'postWithMedia')
        return undefined;

      const record =
        (embed.record?.record as IBskyEmbedRecord) ??
        (embed.record as IBskyEmbedRecord);

      return this.transformEmbeddedPost(record);
    };

    return {
      type: embedType,
      images: transformImages(),
      external: transformExternal(),
      post: transformEmbeddedPost(),
      generator: transformGeneratorView(),
      list: transformListView(),
    };
  };

  public transformEmbeddedPost = (
    record: IBskyEmbedRecord,
  ): Omit<IPost, 'replyRef' | 'shareLink'> => {
    return {
      type: 'generic',

      isNotFound: AppBskyEmbedRecord.isViewNotFound(record),
      isBlocked: AppBskyEmbedRecord.isViewBlocked(record),

      uri: record.uri,
      cid: record.cid,

      creator:
        record.author != null ? this.transformPerson(record.author) : undefined,

      body: record.value != null ? record.value.text : undefined,
      facets: record.value != null ? record.value.facets : undefined,

      labels: this.transformContentLabels(record.labels),

      isRepost: false,
      repostedBy: undefined,

      hasRoot: false,
      root: undefined,

      likes: 0,
      like: undefined,

      reposts: 0,
      repost: undefined,

      replies: 0,

      parent: undefined,
      hasParent: false,

      embed:
        record.embeds?.[0] != null
          ? this.transformEmbed(record.embeds[0])
          : undefined,

      createdAt: record.value != null ? record.value.createdAt : undefined,
    };
  };

  public transformGeneratorView = (
    generator: GeneratorView,
    savedFeeds?: string[],
    pinnedFeeds?: string[],
  ): IGenerator | undefined => {
    return {
      uri: generator.uri,
      cid: generator.cid,
      creator: this.transformPerson(generator.creator),
      name: generator.displayName,
      description: generator.description,
      facets: generator.descriptionFacets,
      avatar: generator.avatar,
      likes: generator.likeCount ?? 0,
      like: generator.viewer?.like,
      pinned: pinnedFeeds?.includes(generator.uri) ?? false,
      saved: savedFeeds?.includes(generator.uri) ?? false,
    };
  };

  public transformListView = (
    list: ListViewBasic | ListView,
  ): IList | undefined => {
    return {
      type: list.creator != null ? 'full' : 'basic',
      uri: list.uri,
      cid: list.cid,
      creator:
        list.creator != null
          ? this.transformPerson(list.creator as unknown as ProfileView)
          : undefined,
      name: list.name,
      description: (list?.description as string) ?? undefined,
      avatar: list.avatar,
      labels: list.label as Label[],
      viewer: list.viewer,
    };
  };

  public buildNotificationList = async (
    client: Client,
    notifications: AppBskyNotificationListNotifications.Notification[],
  ): Promise<INotification[]> => {
    const transformedNotifications = notifications.map((n) =>
      this.transformNotification(n),
    );

    // Get the posts for notifications that require them
    // First we need the URIs
    const uris: string[] = [];
    for (const notification of transformedNotifications) {
      if (
        notification.type === 'reply' &&
        !uris.includes(notification.uri) &&
        notification.uri != null
      ) {
        uris.push(notification.uri);
      } else if (
        notification.type !== 'follow' &&
        notification.subject != null &&
        !uris.includes(notification.subject)
      ) {
        uris.push(notification.subject);
      }
    }

    // Then we need to get the posts
    const bskyPosts = await client.getPosts(uris);
    // then transform them
    const posts = bskyPosts.posts.map((p) => this.transformPost(p));

    const builtNotifications: INotification[] = [];

    for (const notification of transformedNotifications) {
      // See if we already have a similar notification. If we do, just push the creator in so we can group them.
      const existingNotification = builtNotifications.find(
        (n) =>
          n.subject === notification.subject && n.type === notification.type,
      );
      if (existingNotification != null) {
        existingNotification.creators.push(notification.creators[0]);
        continue;
      }

      // If it doesn't then this is a fresh notification. Let's see if there's a post we need to add to it.
      const post = posts.find(
        (p) =>
          (notification.type === 'reply' && p.uri === notification.uri) ||
          (notification.type !== 'reply' && p.uri === notification.subject),
      );
      if (post != null) {
        notification.record = post;
      }

      // Now just push it on in there 👀
      builtNotifications.push(notification);
    }

    return builtNotifications;
  };

  public transformNotification = (
    notification: AppBskyNotificationListNotifications.Notification,
  ): INotification => {
    return {
      type: notification.reason as NotificationType,
      creators: [this.transformPerson(notification.author)],
      isRead: notification.isRead,
      subject: notification.reasonSubject,
      uri: notification.uri,
      cid: notification.cid,
      createdAt: notification.indexedAt,
    };
  };

  public transformPerson = (profile: ProfileViewDetailed): IPerson => {
    if (profile.avatar != null) {
      void Image.prefetch(profile.avatar);
    }

    // We have to generate the facets here
    const richText = new RichText({ text: profile.description ?? '' });
    richText.detectFacetsWithoutResolution();

    return {
      id: profile.did,

      handle: profile.handle,
      displayName: profile.displayName,

      followedBy: profile.viewer?.followedBy != null,
      isFollowing: profile.viewer?.following != null,
      followingUri: profile.viewer?.following,

      isBlocked:
        profile.viewer?.blocking != null ||
        profile.viewer?.blockingByList != null,
      blockingUri: profile.viewer?.blocking,
      blockingList:
        profile.viewer?.blockingByList != null
          ? this.transformListView(profile.viewer.blockingByList)
          : undefined,

      blockedBy: profile.viewer?.blockedBy === true,

      isMuted:
        profile.viewer?.muted === true || profile.viewer?.mutedByList != null,
      mutedList:
        profile.viewer?.mutedByList != null
          ? this.transformListView(profile.viewer.mutedByList)
          : undefined,

      avatar: profile.avatar,

      banner: profile.banner,

      followers: profile.followersCount,
      following: profile.followsCount,
      posts: profile.postsCount,

      description: richText.text,
      facets: richText.facets,
    };
  };

  public transformPost = (post: PostView, root?: PostView): IPost => {
    const record = post.record as IBskyPostRecord;

    return {
      type: 'generic',

      isNotFound: AppBskyFeedDefs.isNotFoundPost(post),
      isBlocked: AppBskyFeedDefs.isBlockedPost(post),

      uri: post.uri,
      cid: post.cid,

      creator: this.transformPerson(post.author),

      body: record.text,
      facets: record.facets,

      labels: this.transformContentLabels(post.labels),

      isRepost: false,
      repostedBy: undefined,

      hasRoot: root != null,
      root: root != null ? this.transformPost(root) : undefined,

      likes: post.likeCount ?? 0,
      like: post.viewer?.like,

      reposts: post.repostCount ?? 0,
      repost: post.viewer?.repost,

      replies: post.replyCount ?? 0,

      hasParent: false,
      parent: undefined,

      createdAt: record.createdAt,

      replyRef: record.reply,

      shareLink: 'FIX', // TODO Fix this
    };
  };

  public transformThreadPost = ({
    thread,
    depth = 0,
    hasParent = false,
    hasReply = false,
    hasMoreAtDepths,
  }: TransformThreadPostOptions): IThreadPost => {
    const replyPosts = depth === 0 ? this.createReplyChain(thread) : undefined;

    // Transform the data
    return {
      ...this.transformPost(thread.post),

      type: 'thread',

      embed:
        thread.post.embed != null
          ? this.transformEmbed(thread.post.embed as IBskyEmbed)
          : undefined,

      // Create a parent chain if the depth is zero (this is the main post)
      hasParent,
      parentPosts:
        depth === 0
          ? this.createParentChain(thread.parent as ThreadViewPost)
          : undefined,

      // Add the replies
      hasReply,
      replyPosts,

      depth,
      hasMoreAtDepths,
    };
  };

  transformTimelinePost = (post: FeedViewPost): IPost => {
    const res = {
      ...this.transformPost(post.post),

      type: 'timeline',

      isRepost: AppBskyFeedDefs.isReasonRepost(post.reason),
      repostedBy:
        post.reason?.by != null
          ? this.transformPerson(post.reason?.by as ProfileView)
          : undefined,

      hasParent: post.reply?.parent != null,
      parent:
        post.reply?.parent != null
          ? this.transformPost(
              post.reply.parent as PostView,
              post.reply.root as PostView,
            )
          : undefined,

      embed:
        post.post.embed != null
          ? this.transformEmbed(post.post.embed as IBskyEmbed)
          : undefined,
    } as IPost;

    return res;
  };

  public applyFeedFilters = (posts: IPost[]): IPost[] => {
    const preferences = this.getPreferences();

    // If we have no preferences, just return. Shouldn't happen but hey.
    if (preferences == null) return posts;

    const filteredPosts = [];

    for (const post of posts) {
      if (preferences.hideReplies && post.hasParent) continue;
      if (preferences.hideReposts && post.isRepost) continue;
      if (
        preferences.hideRepliesByUnfollowed &&
        post.hasParent &&
        !post.parent!.creator!.isFollowing
      )
        continue;
      if (
        preferences.hideRepliesByLikeCount != null &&
        post.hasParent &&
        post.likes < preferences.hideRepliesByLikeCount
      )
        continue;

      filteredPosts.push(post);
    }

    return filteredPosts;
  };
}

interface IBskyLabelType {
  labelName: LabelType;
  values: string[];
  warning: string;
  message: string;
}

const bskyLabelTypes: IBskyLabelType[] = [
  {
    labelName: 'nsfw',
    values: ['porn', 'nsfl'],
    warning: 'Sexually Explicit',
    message: 'Contains sexually explicit content.',
  },
  {
    labelName: 'nudity',
    values: ['nudity'],
    warning: 'Other Nudity',
    message: 'I.e. non-sexual and artistic.',
  },
  {
    labelName: 'suggestive',
    values: ['sexual'],
    warning: 'Sexually Suggestive',
    message: 'Does not include nudity.',
  },
  {
    labelName: 'gore',
    values: ['gore', 'self-harm', 'torture', 'nsfl', 'corpse'],
    warning: 'Violence',
    message: 'Gore, self-harm, torture, etc.',
  },
  {
    labelName: 'hate',
    values: ['icon-kkk', 'icon-nazi', 'icon-intolerant', 'behavior-intolerant'],
    warning: 'Hate Group Iconography',
    message: 'Images of terror groups, articles covering events, etc.',
  },
  {
    labelName: 'spam',
    values: ['spam'],
    warning: 'Spam',
    message: 'Excessive unwanted interactions.',
  },
  {
    labelName: 'impersonation',
    values: ['impersonation'],
    warning: 'Impersonation',
    message: 'Accounts falsely claiming to be people or organizations.',
  },
];

const defaultLabels: ILabels = {
  nsfw: false,
  nudity: false,
  suggestive: false,
  gore: false,
  hate: false,
  spam: false,
  impersonation: false,

  isHidden: false,
  isRendered: true,
};
