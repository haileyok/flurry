import {
  AppBskyActorGetProfile,
  AppBskyActorGetSuggestions,
  AppBskyActorSearchActors,
  AppBskyFeedGetActorLikes,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetLikes,
  AppBskyFeedGetPosts,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetRepostedBy,
  AppBskyFeedGetTimeline,
  AppBskyGraphGetFollowers,
  AppBskyGraphGetFollows,
  AppBskyGraphGetLists,
  AppBskyNotificationListNotifications,
  AtpSessionData,
  AtpSessionEvent,
  BskyAgent,
  BskyPreferences,
} from '@atproto/api';
import {
  ICreateAccountOptions,
  ILoginOptions,
  IResponse,
} from '@src/api/types';
import { IInitOptions } from '@src/api/types/common/IInitOptions';
import { addOrUpdateAccount, useAccountStore } from '@src/state/account';
import { addOrUpdateSession } from '@src/state/account/actions/addOrUpdateSession';
import { ICommonResponse } from '@src/types/bsky';
import { PersonPostsFilterType } from '@src/types/bsky/PersonPostsFilterType';
import { setUnreadCount } from '@src/state/app';
import {
  InputSchema,
  OutputSchema,
} from '@atproto/api/src/client/types/com/atproto/repo/uploadBlob';
import { useSettingsStore } from '@src/state/settings';
import { ThreadViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { fetchHandler } from '@src/lib/bskyPolyfill';
import { IPreferences } from '@src/types/data';
import { produce } from 'immer';
import { QueryClient } from '@tanstack/react-query';
import BskyTransformer from '@src/lib/bsky/BskyTransformer';

interface IGetListOptions {
  cursor?: string;
  actor?: string;
}

export class Client {
  private readonly queryClient?: QueryClient;
  private host: string | null = null;
  private handle: string | null = null;
  private session: AtpSessionData | null = null;
  public client: BskyAgent | null = null;
  private id: string | null = null;
  private initialized: boolean = false;
  private readonly transformer: BskyTransformer;

  constructor(queryClient?: QueryClient) {
    this.queryClient = queryClient;
    this.transformer = new BskyTransformer(queryClient);
  }

  async initialize(options: IInitOptions): Promise<void> {
    this.host = options.host;
    this.handle = options.handle;

    // Polyfill
    BskyAgent.configure({ fetch: fetchHandler });

    // Create the agent
    this.client = new BskyAgent({
      service: 'https://' + this.host,
      persistSession: this.persistBskySession.bind(this),
    });

    this.client.com._service.setHeader('User-Agent', 'Flurry: 0.1');

    // Attempt to load the session
    const session =
      useAccountStore.getState().sessions[`${this.handle}${this.host}`];

    // Check if the client has a session. The client's session shouldn't already be set in production, but during
    // hot reloads, it might already be set.
    if (session != null) {
      this.session = session;
      await this.client.resumeSession({ ...session });
      this.initialized = true;
    }
  }

  public reset(): void {
    this.host = null;
    this.handle = null;
    this.session = null;
    this.client = null;
    this.initialized = false;
  }

  async login(options: ILoginOptions): Promise<IResponse> {
    const client = this.client as BskyAgent;
    const res = await client.login({
      identifier: options.handle!,
      password: options.password!,
    });

    if (res.success) {
      addOrUpdateAccount({
        serviceType: 'bsky',
        host: this.host!,
        handle: res.data.handle,
      });
      this.initialized = true;
    }

    return {
      success: res.success,
    };
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getQueryClient(): QueryClient {
    return this.queryClient!;
  }

  public getTransformer(): BskyTransformer {
    return this.transformer;
  }

  public async createAccount(options: ICreateAccountOptions): Promise<void> {}

  public getUserId(): string | undefined {
    return this.client?.session?.did;
  }

  public getHost(): string | null {
    return this.host;
  }

  private persistBskySession(
    e: AtpSessionEvent,
    session?: AtpSessionData,
  ): void {
    if (e === 'create-failed' || session == null) {
      return;
    }

    this.id = session.did;
    this.session = session;
    addOrUpdateSession(`${this.handle}${this.host}`, session);
  }

  public async getFeed(
    cursor?: string,
  ): Promise<AppBskyFeedGetTimeline.OutputSchema> {
    const client = this.client as BskyAgent;
    return (
      await client.getTimeline({
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async likePost(uri: string, cid: string): Promise<ICommonResponse> {
    return await this.client!.like(uri, cid);
  }

  public async unlikePost(likeUri: string): Promise<void> {
    await this.client!.deleteLike(likeUri);
  }

  public async repost(uri: string, cid: string): Promise<ICommonResponse> {
    return await this.client!.repost(uri, cid);
  }

  public async deleteRepost(repostUri: string): Promise<void> {
    await this.client!.deleteRepost(repostUri);
  }

  public async getPost(
    uri: string,
    parentHeight = 8,
  ): Promise<AppBskyFeedGetPostThread.OutputSchema> {
    const threadedMode = useSettingsStore.getState().threadedMode;
    const depth = threadedMode ? 5 : 3;

    return (
      await this.client!.getPostThread({
        uri,
        parentHeight,
        depth,
      })
    ).data;
  }

  public async getPostSingle(uri: string): Promise<ThreadViewPost> {
    return (
      await this.client!.getPostThread({
        uri,
      })
    ).data.thread as ThreadViewPost;
  }

  public async getPreferences(): Promise<BskyPreferences> {
    return await this.client!.getPreferences();
  }

  public async getRepostedBy(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyFeedGetRepostedBy.OutputSchema> {
    return (
      await this.client!.getRepostedBy({
        uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async getLikedBy(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyFeedGetLikes.OutputSchema> {
    return (
      await this.client!.getLikes({
        uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async followPerson(id: string): Promise<ICommonResponse> {
    return await this.client!.follow(id);
  }

  public async unfollowPerson(uri: string): Promise<void> {
    return await this.client!.deleteFollow(uri);
  }

  public async getPerson(
    uri: string,
  ): Promise<AppBskyActorGetProfile.OutputSchema> {
    return (
      await this.client!.getProfile({
        actor: uri,
      })
    ).data;
  }

  public async getPersonPosts(
    uri: string,
    filter: PersonPostsFilterType,
    cursor?: string,
  ): Promise<AppBskyFeedGetAuthorFeed.OutputSchema> {
    return (
      await this.client!.getAuthorFeed({
        actor: uri,
        limit: 50,
        cursor,
        filter,
      })
    ).data;
  }

  public async getPersonLikes(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyFeedGetActorLikes.OutputSchema> {
    return (
      await this.client!.getActorLikes({
        actor: uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async getFollowSuggestions(
    limit: number = 10,
  ): Promise<AppBskyActorGetSuggestions.OutputSchema> {
    return (
      await this.client!.getSuggestions({
        limit,
      })
    ).data;
  }

  public async getFollowers(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyGraphGetFollowers.OutputSchema> {
    return (
      await this.client!.getFollowers({
        actor: uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async getFollowing(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyGraphGetFollows.OutputSchema> {
    return (
      await this.client!.getFollows({
        actor: uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async getLists({
    actor = this.id!,
    cursor = undefined,
  }: IGetListOptions): Promise<AppBskyGraphGetLists.OutputSchema> {
    return (
      await this.client!.app.bsky.graph.getLists({
        actor,
        cursor,
        limit: 75,
      })
    ).data;
  }

  public async getFeeds(
    feeds: string[],
  ): Promise<AppBskyFeedGetFeedGenerators.OutputSchema> {
    return (
      await this.client!.app.bsky.feed.getFeedGenerators({
        feeds,
      })
    ).data;
  }

  public async getActorFeeds(
    actor: string,
  ): Promise<AppBskyFeedGetFeedGenerators.OutputSchema> {
    return (
      await this.client!.app.bsky.feed.getActorFeeds({
        actor,
        limit: 50,
      })
    ).data;
  }

  public async searchFeeds(
    term?: string,
    limit: number = 50,
  ): Promise<AppBskyFeedGetFeedGenerators.OutputSchema> {
    return (
      await this.client!.app.bsky.unspecced.getPopularFeedGenerators({
        query: term,
        limit,
      })
    ).data;
  }

  public async getListFeed(
    list: string,
    cursor?: string,
  ): Promise<AppBskyFeedGetTimeline.OutputSchema> {
    return (
      await this.client!.app.bsky.feed.getListFeed({
        list,
        cursor,
        limit: 75,
      })
    ).data;
  }

  public async getGeneratorFeed(
    uri: string,
    cursor?: string,
  ): Promise<AppBskyFeedGetTimeline.OutputSchema> {
    return (
      await this.client!.app.bsky.feed.getFeed({
        feed: uri,
        limit: 50,
        cursor,
      })
    ).data;
  }

  public async createPost(
    // @ts-expect-error TODO type this
    newPost: Partial<Record> & Omit<Record, 'createdAt'>,
  ): Promise<ICommonResponse> {
    return await this.client!.post(newPost);
  }

  public async getNotifications(
    cursor?: string,
  ): Promise<AppBskyNotificationListNotifications.OutputSchema> {
    return (
      await this.client!.app.bsky.notification.listNotifications({
        cursor,
        limit: 25,
      })
    ).data;
  }

  public async getPosts(
    uris: string[],
  ): Promise<AppBskyFeedGetPosts.OutputSchema> {
    return (
      await this.client!.app.bsky.feed.getPosts({
        uris,
      })
    ).data;
  }

  public async getUnreadCount(): Promise<number> {
    if (this.client == null) return 0;

    const res = (await this.client.app.bsky.notification.getUnreadCount()).data
      .count;

    setUnreadCount(res);

    return res;
  }

  public async markAllRead(): Promise<void> {
    await this.client!.app.bsky.notification.updateSeen({
      seenAt: new Date().toISOString(),
    });

    setUnreadCount(0);
  }

  public async getPersonSuggestions(
    term: string,
  ): Promise<AppBskyActorSearchActors.OutputSchema> {
    return (
      await this.client!.searchActorsTypeahead({
        term,
        limit: 8,
      })
    ).data;
  }

  public async uploadImage(input: InputSchema): Promise<OutputSchema> {
    return (await this.client!.uploadBlob(input, { encoding: 'image/jpeg' }))
      .data;
  }

  public async blockPerson(id: string): Promise<ICommonResponse> {
    const res = await this.client!.app.bsky.graph.block.create(
      { repo: this.session!.did },
      { createdAt: new Date().toISOString(), subject: id },
    );

    void this.queryClient!.invalidateQueries({
      queryKey: ['profile', id],
      exact: true,
    });

    return res;
  }

  public async unblockPerson(
    id: string,
    uri: string,
  ): Promise<ICommonResponse> {
    const res = await this.client!.app.bsky.graph.block.delete({
      repo: this.session!.did,
      rkey: uri,
    });

    void this.queryClient!.invalidateQueries({
      queryKey: ['profile', id],
    });

    return res;
  }

  public async mutePerson(id: string): Promise<void> {
    await this.client!.mute(id);

    void this.queryClient!.invalidateQueries({
      queryKey: ['profile', id],
    });
  }

  public async unmutePerson(id: string): Promise<void> {
    await this.client!.unmute(id);

    void this.queryClient!.invalidateQueries({
      queryKey: ['profile', id],
    });
  }

  public async deletePost(uri: string): Promise<void> {
    await this.client!.deletePost(uri);
    void this.queryClient!.invalidateQueries({
      exact: false,
    });
    void this.queryClient!.invalidateQueries({
      queryKey: ['post'],
      exact: false,
    });
  }

  public async pinFeed(uri: string, pin: boolean): Promise<void> {
    const res = pin
      ? await this.client!.addPinnedFeed(uri)
      : await this.client!.removePinnedFeed(uri);
    this.queryClient!.setQueryData(['preferences'], (oldData: IPreferences) =>
      produce(oldData, (draft) => {
        draft.pinnedFeeds = res.pinned;
        draft.savedFeeds = res.saved;
      }),
    );
    void this.queryClient!.invalidateQueries({
      queryKey: ['feeds', 'self'],
      exact: true,
    });
  }

  public async saveFeed(uri: string, save: boolean): Promise<void> {
    const res = save
      ? await this.client!.addSavedFeed(uri)
      : await this.client!.removeSavedFeed(uri);
    this.queryClient!.setQueryData(['preferences'], (oldData: IPreferences) =>
      produce(oldData, (draft) => {
        draft.pinnedFeeds = res.pinned;
        draft.savedFeeds = res.saved;
      }),
    );
  }
}
