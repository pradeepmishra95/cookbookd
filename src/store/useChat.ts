import {create} from 'zustand';

type ChatType = {
  order_id: number;
  message: string;
  date_time: string;
  user_id: number;
  sender: number;
  is_file: 0 | 1;
  id: number;
};

type ChatStoreType = {
  read: Record<string, ChatType[]>;
  unread: ChatType[];
  data: {
    status: string;
    order_id: number;
    last_message: number;
  };
};

interface useChatI {
  chats: {[key: number]: ChatStoreType};
  updateChat: (chat: useChatI['chats']) => void;
}

const useChat = create<useChatI>((set, get) => ({
  chats: {},
  updateChat: chats => set({chats}),
}));

export default useChat;
export type {ChatStoreType, ChatType, useChatI};
