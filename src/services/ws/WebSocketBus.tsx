import useAddress from '@/store/useAddress';
import useAuth from '@/store/useAuth';
import useChat, {ChatStoreType, ChatType} from '@/store/useChat';
import useLiveChefs, {LiveChefType} from '@/store/useLiveChefs';
import useWs from '@/store/useWs';
import {
  updateChat,
  updateChatStore,
  updateChatStoreWithCache,
  updateSenderStatus,
} from '@/utils/chat';
import {checkFCMToken} from '@/utils/notification';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';
import {RootStackParamList} from 'App';
import {useCallback, useEffect} from 'react';
import Config from 'react-native-config';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {SendJsonMessage} from 'react-use-websocket/dist/lib/types';
import {getBaseURL} from './base';
import {CustomSendJsonMessageType, SocketResponseType} from './types';

const WebSocketBus = ({
  navigationRef,
}: {
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
}) => {
  const {userData} = useAuth();
  const {selectedAddress} = useAddress();
  const {updateLiveChefs} = useLiveChefs();

  const {
    updateConnection,
    updateWsState,
    updateSendJsonMessage,
    sendJsonMessage: sendJsonMessageStore,
  } = useWs();

  const sendJsonMessageWrapper = useCallback(
    (sendJsonMessage: SendJsonMessage): CustomSendJsonMessageType => {
      return (type, payload) => {
        console.log('cookbookd request >>>');
        console.log({type, payload});

        sendJsonMessage({
          type,
          payload,
        });
      };
    },
    [],
  );

  const {sendJsonMessage, getWebSocket, readyState} = useWebSocket(
    encodeURI(getBaseURL()),
    {
      onOpen: async () => {
        const sendJsonMessageWrapperFunc =
          sendJsonMessageWrapper(sendJsonMessage);
        const fcm = await checkFCMToken();

        updateSendJsonMessage(sendJsonMessageWrapperFunc);
        updateConnection(getWebSocket());

        sendJsonMessageWrapperFunc('connection', {
          fcm_token: fcm,
          status: 1,
          access_token: userData?.token,
          sender: Config.USER_TYPE === 'chef' ? 1 : 0,
        });
        if (Config.USER_TYPE === 'customer')
          sendJsonMessageWrapperFunc('join_live_room', {});
      },
      onClose: async () => {
        console.log('closed');
        const fcm = await checkFCMToken();

        updateSendJsonMessage(null);
        updateConnection(null);

        sendJsonMessageStore('connection', {
          fcm_token: fcm,
          status: 0,
          access_token: userData?.token,
          sender: Config.USER_TYPE === 'chef' ? 1 : 0,
        });
      },
      onMessage: async event => {
        const response = JSON.parse(event?.data ?? '{}') as SocketResponseType;
        console.log('socket response >>>');
        console.log(response);
        if (response.success) {
          switch (response.type) {
            case 'chat': {
              let message = (response as SocketResponseType<ChatType>).data;
              const currentRoute = navigationRef.getCurrentRoute();
              updateChat(message.order_id, message);
              if (
                currentRoute?.name === 'chat' &&
                (currentRoute?.params as any)?.id === message.order_id
              ) {
                const {chats} = useChat.getState();
                const chatDetails = chats[message.order_id] ?? null;
                sendJsonMessageWrapper(sendJsonMessage)('is_read', {
                  order_id: message.order_id,
                  messages: [
                    message.id,
                    ...(chatDetails
                      ? chatDetails.unread.map(message => message.id)
                      : []),
                  ],
                });
              }
              break;
            }
            case 'get_chats': {
              let store = (response as SocketResponseType<ChatStoreType>).data;
              if ((store.data.last_message ?? 1) === 0) {
                updateChatStore(1, {
                  ...store,
                  read: Array.isArray(store.read) ? {} : store.read,
                  unread: store.unread ?? [],
                });
              } else {
                updateChatStoreWithCache(1, store);
              }

              break;
            }
            case 'sender_status': {
              let data = (
                response as SocketResponseType<{
                  order_id: number;
                  sender_status: string;
                }>
              ).data;
              updateSenderStatus(data.order_id, data.sender_status);
            }
            case 'get_live_chefs': {
              let data = (response as SocketResponseType<LiveChefType[]>).data;
              console.log({data});

              updateLiveChefs(data);
            }
          }
        }
      },
    },
  );

  useEffect(() => {
    console.log({readyState});
    updateWsState(readyState);
    return () => updateWsState(ReadyState.CLOSED);
  }, [readyState]);

  return <></>;
};

export default WebSocketBus;
