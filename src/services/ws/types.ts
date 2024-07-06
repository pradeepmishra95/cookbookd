type SocketRequestTypes =
  | 'connection'
  | 'chat'
  | 'get_chats'
  | 'is_read'
  | 'sender_status'
  | 'clear_chat'
  | 'join_live_room'
  | 'get_live_chefs';

type SocketResponseTypes =
  | 'chat'
  | 'sender_status'
  | 'get_chats'
  | 'is_read'
  | 'get_live_chefs';

type SocketResponseType<T = unknown, Success = true> = {
  data: T;
  message: string;
  success: Success;
  type: SocketResponseTypes;
};

type SocketRequestType = {
  payload: unknown; // {user_id: 8, order_id: 2, last_message: 0}  {messages: [1,2,3], order_id: 2, user_id: 8}
  type: SocketRequestTypes;
};

type CustomSendJsonMessageType = (
  type: SocketRequestTypes,
  payload: any,
) => void;

export type {
  CustomSendJsonMessageType,
  SocketRequestType,
  SocketRequestTypes,
  SocketResponseType,
};
