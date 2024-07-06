import LinkSVG from '@/assets/icons/link.svg';
import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Divider from '@/components/Divider';
import useAuth from '@/store/useAuth';
import useChat, {ChatStoreType, ChatType} from '@/store/useChat';
import useWs from '@/store/useWs';
import {retreiveChats, updateChat} from '@/utils/chat';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Image, useTheme} from '@rneui/themed';
import {useDebounce} from '@uidotdev/usehooks';
import {RootStackParamList} from 'App';
import dayjs from 'dayjs';
import mime from 'mime';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import FeatherIcon from 'react-native-vector-icons/Feather';

type ChatProps = NativeStackScreenProps<RootStackParamList, 'chat'>;

interface initialStateI {
  chatText: string;
  selectedFile: Asset | null;
}

const initialState: initialStateI = {
  chatText: '',
  selectedFile: null,
};

const DEFAULT_CHAT_PADDING = 70;

const calendarFormat = {
  sameDay: '[Today]', // The same day ( Today )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow )
  nextWeek: '[Next] dddd', // The next week ( Sunday  ),
  lastDay: '[Yesterday]', // The day before ( Yesterday )
  lastWeek: '[Last] dddd', // Last week ( Last Monday )
  sameElse: 'DD/MM/YYYY', // Everything else ( 7/10/2011 )
};

export const defaultChatData = {
  read: {},
  unread: [],
  data: {
    status: '',
  },
};
const Chat = ({navigation, route}: ChatProps) => {
  const {sendJsonMessage} = useWs();
  const [state, setState] = useState(initialState);
  const [senderStatus, setSenderStatus] = useState('Online');
  const {chats} = useChat();
  const {theme} = useTheme();
  const bottomSheetSelectRef = useRef<BottomSheetModal>(null);
  const bottomSheetPreviewRef = useRef<BottomSheetModal>(null);
  const debouncedChatText = useDebounce(state.chatText, 500);

  const {width} = Dimensions.get('screen');
  const {userData} = useAuth();
  const inputRef = useRef<TextInput>(null);

  const chatData = chats[route.params.id] ?? defaultChatData;
  const chatDataStringified = JSON.stringify(
    chats[route.params.id] ?? defaultChatData,
  );

  const handleFile = async (type: 'gallery' | 'camera' | 'reset') => {
    setState(prev => ({...prev, imageLoading: true}));
    let result: ImagePickerResponse;
    if (type === 'reset') {
      setState(prev => ({
        ...prev,
        selectedFile: null,
        imageLoading: false,
      }));
      return;
    } else if (type === 'camera') {
      result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });
    } else {
      result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
      });
    }

    if (result.assets && result.assets.length > 0) {
      setState(prev => ({
        ...prev,
        selectedFile: result.assets ? result.assets[0] ?? null : null,
      }));
      bottomSheetSelectRef.current?.dismiss();
      bottomSheetPreviewRef.current?.present();
    }

    setState(prev => ({...prev, imageLoading: false}));
  };

  const chatMapping = useMemo(() => {
    const {read, unread} = JSON.parse(chatDataStringified) as ChatStoreType;

    const mapping = Object.keys(read)
      .sort()
      .reverse()
      .map(key => ({
        title: key,
        data: read[key],
      }));
    if (unread.length > 0)
      mapping.splice(0, 0, {title: 'Unread', data: unread});
    return mapping;
  }, [chatDataStringified]);

  const renderSectionFooter = useCallback(
    ({
      section,
    }: {
      section: SectionListData<ChatType, {title: string; data: ChatType[]}>;
    }) => {
      if (section.data.length === 0) {
        return null;
      }
      return (
        <Divider
          childProps={{
            style: [section.title === 'Unread' ? {backgroundColor: 'red'} : {}],
          }}
          headingProps={{
            style: [section.title === 'Unread' ? {color: 'red'} : {}],
          }}
          heading={
            section.title === 'Unread'
              ? 'Unread'
              : dayjs(section.title, 'YYYYMMDD').calendar(
                  undefined,
                  calendarFormat,
                )
          }
        />
      );
    },
    [],
  );

  const renderItem: SectionListRenderItem<
    ChatType,
    {title: string; data: ChatType[]}
  > = useCallback(({item}) => {
    return (
      <StyledView
        tw="w-full flex-row my-3"
        style={[
          item.user_id === userData?.id ? {flexDirection: 'row-reverse'} : {},
        ]}>
        <StyledView
          tw="p-4"
          style={[
            {
              borderRadius: 20,
              rowGap: 5,
              width: 'auto',
              maxWidth: width - DEFAULT_CHAT_PADDING,
            },
            item.user_id === userData?.id
              ? {
                  backgroundColor: 'black',
                  borderTopRightRadius: 0,
                  alignItems: 'flex-end',
                }
              : {
                  backgroundColor: theme.colors.greyOutline,
                  borderBottomLeftRadius: 0,
                },
          ]}>
          {item.is_file ? (
            <StyledView tw="w-full flex-row items-center" style={{gap: 10}}>
              <Image
                onPress={() => {
                  InAppBrowser.open(item.message);
                }}
                source={{uri: item.message}}
                style={{width: 50, height: 50, borderRadius: 8}}
              />
              <StyledView tw="justify-between">
                <StyledText
                  h3
                  style={[
                    item.user_id === userData?.id ? {color: 'white'} : {},
                  ]}>
                  {item.message
                    .split('/')
                    .pop()
                    ?.split('.')
                    .pop()
                    ?.toUpperCase()}
                </StyledText>
                <StyledText
                  h5
                  style={[
                    item.user_id === userData?.id ? {color: 'white'} : {},
                  ]}>
                  Tap to View.
                </StyledText>
              </StyledView>
            </StyledView>
          ) : (
            <StyledText
              h3
              style={[item.user_id === userData?.id ? {color: 'white'} : {}]}>
              {item.message}
            </StyledText>
          )}

          <StyledText
            h5
            style={[
              item.user_id === userData?.id
                ? {color: '#727272'}
                : {color: theme.colors.lightText},
            ]}>
            {dayjs(item.date_time).format('hh:mm A')}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }, []);

  const sendMessage = useCallback(
    (type: 'file' | 'chat') => {
      if (type === 'file' ? true : state.chatText !== '') {
        sendJsonMessage('chat', {
          order_id: route.params.id,
          type,
          message:
            type === 'chat'
              ? state.chatText
              : `data:${mime.getType(
                  state.selectedFile?.uri ?? '',
                )};base64,${state.selectedFile?.base64}`,
        });
        updateChat(route.params.id, {
          order_id: 1,
          sender: Config.USER_TYPE === 'chef' ? 1 : 0,
          user_id: userData?.id ?? 0,
          message:
            type === 'chat' ? state.chatText : state.selectedFile?.uri ?? '',
          date_time: new Date().toISOString(),
          is_file: type === 'chat' ? 0 : 1,
          id: 0,
        });
        if (chatData.unread.length > 0) {
          console.log(
            'mark as read >>',
            chatData.unread.map(i => i.id),
          );
          sendJsonMessage('is_read', {
            order_id: route.params.id,
            messages: chatData.unread.map(i => i.id),
          });
        }
        retreiveChats(route.params.id);
        setState(prev => ({...prev, chatText: ''}));
      }
    },
    [state],
  );

  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: (
      <FeatherIcon name="message-square" size={35} color={theme.colors.black} />
    ),
    text: `Do you really want to clear the chat, this action can't be reverted?`,
    buttonText: 'Clear',
    onButtonPress: () => {
      sendJsonMessage('clear_chat', {order_id: route.params.id});
      retreiveChats(route.params.id);
      BottomSheetRef.current?.dismiss();
    },
  });

  useEffect(() => {
    InAppBrowser.warmup();
    retreiveChats(route.params.id);
  }, [route.params.id]);

  useEffect(() => {
    sendJsonMessage('sender_status', {
      order_id: route.params.id,
      user_id: userData?.id,
      sender: Config.USER_TYPE === 'chef' ? 1 : 0,
      sender_status: senderStatus,
    });
  }, [senderStatus]);

  useEffect(() => {
    setSenderStatus('Online');
  }, [debouncedChatText]);

  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      noPadding
      isScrollable={false}
      title={
        <StyledView tw="flex-row gap-2">
          <Image
            source={{uri: route.params.receiver.profile_image}}
            width={45}
            height={45}
            style={{width: 45, height: 45, borderRadius: 45}}
          />
          <StyledView tw="justify-center items-start">
            <StyledText h2>{route.params.receiver.name}</StyledText>
            <StyledText h5 style={{color: theme.colors.lightText}}>
              {chatData.data.status}
            </StyledText>
          </StyledView>
        </StyledView>
      }
      rightComponent={
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center gap-x-2"
          onPress={() => {
            BottomSheetRef.current?.present();
          }}>
          <StyledText h4 style={{color: theme.colors.primary}}>
            Clear Chat
          </StyledText>
        </TouchableOpacity>
      }>
      <SectionList
        inverted
        onEndReached={() => {
          if (Object.keys(chatData.read).length > 0) {
            let lastDay = Object.keys(chatData.read).sort()[0];
            let last_message = chatData.read[lastDay].reverse()[0].id;
            // retreiveChats(route.params.id, last_message);
          }
        }}
        tw="flex-1"
        style={{
          backgroundColor: theme.colors.lightBg,
          padding: 15,
        }}
        sections={chatMapping}
        renderItem={renderItem}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={(item, index) => `chat-${item.order_id ?? 0}-${index}`}
        ListFooterComponent={<StyledView tw="w-full p-3" />}
      />

      <StyledView
        bg
        tw="flex-row justify-center items-center p-2"
        style={{gap: 10}}>
        <StyledButton
          twButton={'bg-transparent'}
          onPress={() => {
            bottomSheetSelectRef.current?.present();
          }}
          containerStyle={{borderRadius: 25}}
          icon={<LinkSVG />}
        />
        <StyledView
          tw="flex-1"
          style={{
            borderColor: theme.colors.greyOutline,
            borderWidth: 1,
            borderRadius: 25,
          }}>
          <StyledInput
            inputContainerStyle={{
              backgroundColor: 'transparent',
            }}
            value={state.chatText}
            onChangeText={text => {
              setState(prev => ({...prev, chatText: text}));
              setSenderStatus('Typing');
            }}
            ref={inputRef}
            errorStyle={{display: 'none'}}
            placeholder="Type here.."
          />
        </StyledView>
        <StyledButton
          onPress={() => sendMessage('chat')}
          containerStyle={{borderRadius: 25}}
          icon={<FeatherIcon name="chevron-right" size={25} />}
        />
      </StyledView>

      <StyledBottomSheet
        bottomSheetRef={bottomSheetSelectRef}
        index={0}
        snapPoints={['16%']}
        enablePanDownToClose>
        <StyledView tw="items-center justify-evenly flex-1 bg-transparent">
          <TouchableOpacity onPress={() => handleFile('camera')} tw="p-3">
            <StyledText h2>Take a Photo...</StyledText>
          </TouchableOpacity>

          <Divider linear />
          <TouchableOpacity onPress={() => handleFile('gallery')} tw="p-3">
            <StyledText h2>Choose a Photo...</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledBottomSheet>

      <StyledBottomSheet
        bottomSheetRef={bottomSheetPreviewRef}
        snapPoints={['70%']}
        index={0}>
        <StyledView tw="flex-1" style={{gap: 10}}>
          <StyledView tw="flex-1">
            {typeof state.selectedFile?.uri === 'string' && (
              <Image
                source={{uri: state.selectedFile?.uri}}
                style={{height: '100%', width: '100%', objectFit: 'contain'}}
              />
            )}
          </StyledView>
          <StyledButton
            onPress={() => {
              sendMessage('file');
              bottomSheetPreviewRef.current?.dismiss();
            }}
            containerStyle={{borderRadius: 25}}
            title={'Send'}
          />
          <StyledButton
            twContainer="w-full"
            titleStyle={{color: theme.colors.black}}
            buttonStyle={{
              borderColor: theme.colors.black,
              borderRadius: 25,
            }}
            type="outline"
            onPress={() => {
              handleFile('reset');
              bottomSheetPreviewRef.current?.dismiss();
            }}
            title={'Cancel'}
          />
        </StyledView>
      </StyledBottomSheet>

      <BottomSheet />
    </StyledPageView>
  );
};

export default Chat;
