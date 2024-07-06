type SocketRequestTypes = 'comment' | 'like_live_room';

type SocketResponseTypes = 'comment' | 'like_live_room';

type SocketResponseType<T = unknown, Success = true> = {
  data: T;
  message: string;
  success: Success;
  type: SocketResponseTypes;
};

type SocketRequestType = {
  payload: unknown;
  type: SocketRequestTypes;
};

type CustomSendJsonMessageType = (
  type: SocketRequestTypes,
  payload?: any,
) => void;

type CommentType = {
  sender: number;
  comment: string;
  profile_image: string;
  user_name: string;
};

export type {
  CommentType,
  CustomSendJsonMessageType,
  SocketRequestType,
  SocketRequestTypes,
  SocketResponseType,
};
