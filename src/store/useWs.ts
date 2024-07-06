import {CustomSendJsonMessageType} from '@/services/ws/types';
import {ReadyState} from 'react-use-websocket';
import {WebSocketLike} from 'react-use-websocket/dist/lib/types';
import {create} from 'zustand';

interface useWsI {
  connection: WebSocketLike | null;
  wsState: ReadyState;
  sendJsonMessage: CustomSendJsonMessageType;
  updateConnection: (connection: WebSocketLike | null) => void;
  updateWsState: (wsState: ReadyState) => void;
  updateSendJsonMessage: (
    sendJsonMessage: CustomSendJsonMessageType | null,
  ) => void;
}

const defaultSendJsonMessage: CustomSendJsonMessageType = (type, payload) => {
  console.log('Your Request cannot be processed at the moment.');
};

const useWs = create<useWsI>(set => ({
  connection: null,
  wsState: ReadyState.UNINSTANTIATED,
  sendJsonMessage: defaultSendJsonMessage,
  updateConnection: connection => set({connection}),
  updateWsState: wsState => set({wsState}),
  updateSendJsonMessage: sendJsonMessage =>
    set({
      sendJsonMessage: sendJsonMessage
        ? sendJsonMessage
        : defaultSendJsonMessage,
    }),
}));

export default useWs;
export {defaultSendJsonMessage};
export type {useWsI};
