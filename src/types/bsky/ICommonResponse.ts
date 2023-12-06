interface ICommonResponseData {
  uri: string;
  cid: string;
}

export type ICommonResponse = ICommonResponseData | void | undefined;
