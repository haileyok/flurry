import { ParamListBase } from '@react-navigation/native';
import { IPerson, IPost } from '@src/types/data';

export interface MainStackParamList extends ParamListBase {
  Home: undefined;
  Feed: FeedScreenParamList;
  Post: PostScreenParamList;
  PersonList: PersonListScreenParamList;
  Profile: ProfileScreenParamList;
  NewPost: NewPostScreenParamList | undefined;
  SettingsIndex: undefined;
}

interface FeedScreenParamList {
  uri?: string;
  feedName?: string;
}

interface PostScreenParamList {
  post?: IPost | string;
  uri?: string;
}

interface PersonListScreenParamList {
  type: 'like' | 'repost' | 'following' | 'followers';
  uri: string;
}

interface ProfileScreenParamList {
  personOrUri: IPerson | string;
}

interface NewPostScreenParamList {
  replyTo?: IPost;
  quote?: IPost;
}
