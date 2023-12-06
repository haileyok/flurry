# BlueSky Transformers

In an attempt (in progress, sort of figuring these out along the way) to make things a bit easier to work with, I've
created a few transformers that simplify and flatten the data that is returned from BlueSky.

The goal here is to (eventually) make the app work with other platforms like Mastodon while using (mostly) the same
components. Transformers can be added for other services that will produce the same data structure as these transformers
do.

### `transformBskyPost`

This is a generic post transformer that works well for most post data regardless of the type of post. Both the
`ThreadPost` transformer and the `TimelinePost` transformer extend this transformer.

Embeds seem to be better handled by the more specialized transformers. The structure of where to find the embeds
for a post is a bit wonky (or maybe I'm just dumb), so we handle that elsewhere.

### `transformBskyThreadPost`

Ontop of adding embedded posts, we also create the parent and reply chains here. A parent chain is easy to make, since
we just need to flatten the nested parents to the main post. The reply chain is a bit more complicated and is handled
by a separate transformer.

### `transformBskyTimelinePost`

Here we add some information to the post such as `repostedBy` and `hasParent`. We don't deal with any filtering of the
posts here but instead leave that to the actual `useFeedQuery()`. Those filters only belong on the home feed, since
other generators handle them differently, and we don't want them to apply to profile feeds.

### `transformBskyGeneratorView` and `transformBskyListView`

These are two transformers that simplify the structure of feed generators and lists. Although the two are very similar,
there are enough differences to make them separate transformers.
