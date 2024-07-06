import {defaultChatData} from '@/screens/auth/common/Chat';
import useChat, {ChatStoreType, ChatType} from '@/store/useChat';
import useWs from '@/store/useWs';
import dayjs from 'dayjs';

const updateChat = (id: number, message: ChatType) => {
  const {chats, updateChat} = useChat.getState();
  const chatDetails = chats[id] ?? null;
  if (chatDetails) {
    if (chatDetails.unread.length > 0) {
      chatDetails.unread.splice(0, 0, message);
    } else {
      const today = dayjs(message.date_time).format('YYYY-MM-DD');
      console.log(today);

      if (chatDetails.read[today]) {
        chatDetails.read[today].splice(0, 0, message);
      } else {
        chatDetails.read[today] = [message];
      }
    }
    chats[id] = chatDetails;
    updateChat({...chats});
  } else {
    retreiveChats(id);
  }
};

const updateChatStore = (id: number, store: ChatStoreType) => {
  const {chats, updateChat} = useChat.getState();
  chats[id] = store;
  updateChat(chats);
};

const updateChatStoreWithCache = (id: number, store: ChatStoreType) => {
  const {chats, updateChat} = useChat.getState();
  let prevData = chats[id] ?? defaultChatData;
  Object.keys(store.read).forEach(key => {
    if (Object.keys(prevData.read).includes(key)) {
      prevData.read[key] = prevData.read[key].concat(store.read[key]);
    } else {
      prevData.read[key] = store.read[key];
    }
  });
  chats[id] = prevData;
  updateChat(chats);
};

const retreiveChats = (id: number, last_message?: number) => {
  const {sendJsonMessage} = useWs.getState();
  sendJsonMessage('get_chats', {
    order_id: id,
    last_message: last_message ?? 0,
  });
};

const updateSenderStatus = (id: number, status: string) => {
  const {chats, updateChat} = useChat.getState();
  const chatDetails = chats[id] ?? null;
  if (chatDetails) {
    console.log(id);

    chats[id] = {...chatDetails, data: {...chatDetails.data, status}};
    updateChat({...chats});
  }
};

export {
  retreiveChats,
  updateChat,
  updateChatStore,
  updateChatStoreWithCache,
  updateSenderStatus,
};
