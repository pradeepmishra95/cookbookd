import CameraFlipSVG from '@/assets/icons/camera_flip.svg';
import HeartSVG from '@/assets/icons/heart.svg';
import LetterLogoChef from '@/assets/icons/letter_logo_chef.svg';
import UserCircle from '@/assets/icons/user_circle.svg';
import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import config from '@/constants/config';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {getBaseURL} from '@/services/live/base';
import {
  CommentType,
  CustomSendJsonMessageType,
  SocketResponseType,
} from '@/services/live/types';
import useAuth from '@/store/useAuth';
import {
  checkStreamingPermission,
  getStreamingPermission,
} from '@/utils/liveStreaming';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import {BlurView} from '@react-native-community/blur';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Badge, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ListRenderItem,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import createAgoraRtcEngine, {
  ChannelMediaOptions,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
} from 'react-native-agora';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import useWebSocket from 'react-use-websocket';

type LiveStreamingProps = NativeStackScreenProps<
  RootStackParamList,
  'live_streaming'
>;

interface initialStateI {
  uid: number;
  isJoined: boolean;
  channel: string | null;
  token: string | null;
}

interface connectionDataI {
  audioMuted: boolean;
  videoMuted: boolean;
  hostJoined: boolean;
  chatText: string;
  viewCount: number;
  likeCount: number;
}

const initialState: initialStateI = {
  uid: 0,
  isJoined: false,
  channel: null,
  token: null,
};

const connectionData: connectionDataI = {
  audioMuted: false,
  videoMuted: false,
  hostJoined: false,
  chatText: '',
  viewCount: 0,
  likeCount: 0,
};

const Defaults = {
  ANIMATION_DURATION: 400,
  FLATLIST_HEIGHT: Dimensions.get('screen').height / 6,
};

const AnimatedFeatherIcon = Animated.createAnimatedComponent(FeatherIcon);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const nFormat = Intl.NumberFormat('en', {notation: 'compact'}).format;

const LiveStreaming = ({navigation, route}: LiveStreamingProps) => {
  const [state, setState] = useState(initialState);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [connectionState, setConnectionState] = useState(connectionData);
  const agoraEngineRef = useRef<IRtcEngine>();
  const insets = useSafeAreaInsets();
  const {height, width} = Dimensions.get('screen');
  const mode = useMemo(
    () =>
      typeof route.params.chefData !== 'undefined' ? 'audience' : 'broadcaster',
    [route.params],
  );
  const userData = useAuth(state => state.userData);
  const {theme} = useTheme();
  const animation = useSharedValue(0);
  const animatedTransformation = useAnimatedStyle(() => {
    const bottom = interpolate(
      animation.value,
      [0, 1],
      [-Defaults.FLATLIST_HEIGHT, 0],
    );
    return {bottom, left: 0};
  });
  const animatedOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);
    return {opacity};
  });
  const animatedRotation = useAnimatedStyle(() => {
    const rotate = `${interpolate(animation.value, [0, 1], [0, 180])}deg`;
    return {transform: [{rotate}]};
  });

  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <FeatherIcon name="info" size={35} color={theme.colors.black} />,
    text: `Do you really want to stop the live streaming?`,
    buttonText: 'Stop',
    onButtonPress: () => {
      agoraEngineRef.current?.leaveChannel();
      BottomSheetRef.current?.dismiss();
    },
  });

  useEffect(() => {
    (async () => {
      await setupVideoSDKEngine();
      if (mode === 'broadcaster')
        if (!(await checkStreamingPermission())) {
          const result = await getStreamingPermission();
          console.log({result});
        }
      if (mode === 'broadcaster') {
        const {data, status, HttpStatusCode} = await request<{
          rtc_token: string;
          channel_name: string;
          uid: number;
        }>('POST', urls.auth.chef.live.go_live);
        if (status === HttpStatusCode.OK && data.success) {
          setState(prev => ({
            ...prev,
            token: data.data.rtc_token,
            channel: data.data.channel_name,
            uid: data.data.uid,
            isJoined: true,
          }));
          joinChannel(
            data.data.rtc_token,
            data.data.channel_name,
            data.data.uid,
          );
        }
      } else {
        const {data, status, HttpStatusCode} = await request<{
          rtc_token: string;
          channel_name: string;
          uid: number;
        }>(
          'GET',
          `${urls.auth.chef.live.join_live}/${route.params?.chefData?.id}`,
        );
        if (status === HttpStatusCode.OK && data.success) {
          setState(prev => ({
            ...prev,
            token: data.data.rtc_token,
            channel: data.data.channel_name,
            uid: data.data.uid,
            isJoined: true,
          }));
          joinChannel(
            data.data.rtc_token,
            data.data.channel_name,
            data.data.uid,
          );
        }
      }
    })();
  }, []);

  const setupVideoSDKEngine = useCallback(async () => {
    try {
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: connection => {
          console.log('joined!', connection.localUid);
        },
        onUserJoined: (_connection, uid) => {
          console.log({uid});
          if (mode === 'audience') {
            console.log('joined');

            setState(prev => ({...prev, uid}));
            setConnectionState(prev => ({...prev, hostJoined: true}));
          }
        },
        onUserOffline: (_connection, Uid) => {
          if (mode === 'audience') {
            agoraEngine.leaveChannel();
          }
        },
        onLeaveChannel: () => {
          console.log('leave');
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      });
      agoraEngine.initialize({
        appId: config.AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      agoraEngine.enableVideo();
      console.log('---- initialized ----');
    } catch (e) {
      console.log(e);
    }
  }, []);

  const joinChannel = useCallback(
    async (token: string, channel: string, uid: number) => {
      if (state.isJoined) {
        return;
      }
      try {
        if (mode === 'broadcaster') {
          agoraEngineRef.current?.startPreview();
          agoraEngineRef.current?.joinChannel(token, channel, uid, {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          });
        } else {
          var channeloptions = new ChannelMediaOptions();
          // Add Customer media options here
          agoraEngineRef.current?.updateChannelMediaOptions(channeloptions);
          agoraEngineRef.current?.joinChannel(token, channel, uid, {
            clientRoleType: ClientRoleType.ClientRoleAudience,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    [state.isJoined, mode],
  );

  const {sendJsonMessage: sendRawJsonMessage} = useWebSocket(
    encodeURI(getBaseURL(route.params?.chefData?.id ?? userData?.id ?? 0)),
    {
      onOpen: () => {
        console.log(
          getBaseURL(route.params?.chefData?.id ?? userData?.id ?? 0),
        );

        console.log('connected');
      },
      onMessage: async event => {
        const response = JSON.parse(event?.data ?? '{}') as SocketResponseType;
        console.log('live response >>>');
        console.log(response);
        if (response.success) {
          switch (response.type) {
            case 'comment':
              const message = (response as SocketResponseType<CommentType>)
                .data;

              setComments(prev => {
                if (prev.length > 15) prev = prev.slice(0, 14);
                prev.splice(0, 0, message);
                return prev;
              });
              break;
            case 'like_live_room':
              setConnectionState(prev => ({
                ...prev,
                likeCount: prev.likeCount + 1,
              }));
              break;
          }
        }
      },
      onClose: () => {
        console.log('closed');
      },
    },
  );

  const sendJsonMessage: CustomSendJsonMessageType = useCallback(
    (type, payload) => {
      sendRawJsonMessage({
        type,
        payload,
      });
    },
    [sendRawJsonMessage],
  );

  const renderItem: ListRenderItem<(typeof comments)[0]> = useCallback(
    ({item}) => {
      return (
        <StyledView tw="flex-row m-2">
          <StyledView
            tw="flex-row pr-4"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              width: 'auto',
            }}>
            <Image
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                transform: [{translateY: -6}, {translateX: -6}],
              }}
              source={{uri: item.profile_image}}
            />
            <StyledView>
              <StyledText
                h5
                tw="text-white"
                style={{
                  fontFamily: 'Manrope-SemiBold', // 600
                  fontWeight: '600',
                }}>
                {item.user_name}
              </StyledText>
              <StyledText h5 tw="text-white">
                {item.comment}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      );
    },
    [],
  );

  return (
    <StyledPageView noInsets noPadding isScrollable={false}>
      {state.isJoined ? (
        (mode === 'audience' ? connectionState.hostJoined : true) ? (
          <>
            <RtcSurfaceView
              style={{
                height,
                width,
                display: connectionState.videoMuted ? 'none' : 'flex',
              }}
              canvas={mode === 'broadcaster' ? {} : {uid: state.uid}}
            />
            <StyledView
              style={{
                paddingTop: insets.top,
                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20,
                height,
                width,
              }}
              tw="absolute top-0 left-0 justify-between">
              <LinearGradient
                colors={[
                  '#000000',
                  '#00000000',
                  '#00000000',
                  '#00000000',
                  '#00000000',
                  '#000000',
                ]}
                style={{
                  height,
                  width,
                  position: 'absolute',
                }}
              />
              <StyledView tw="flex-row w-full justify-between p-4">
                <StyledView tw="relative" style={{borderRadius: 30}}>
                  <StyledView
                    tw="overflow-hidden w-full h-full absolute"
                    style={{borderRadius: 30}}>
                    <BlurView
                      style={StyleSheet.absoluteFill}
                      blurType="light"
                      blurAmount={10}
                      reducedTransparencyFallbackColor="white"
                    />
                  </StyledView>
                  <StyledView
                    style={{padding: 5, gap: 15}}
                    tw="flex-row items-center justify-center">
                    <StyledView>
                      <LetterLogoChef
                        style={{position: 'absolute', bottom: -4, left: -4}}
                      />
                      <Image
                        style={{height: 36, width: 36, borderRadius: 36}}
                        source={{
                          uri:
                            mode === 'broadcaster'
                              ? userData?.profile_image
                              : route.params.chefData?.profile_image,
                        }}
                      />
                    </StyledView>
                    <StyledText tw="text-white">
                      {mode === 'broadcaster'
                        ? userData?.first_name
                        : route.params.chefData?.name}
                    </StyledText>
                    <StyledView />
                  </StyledView>
                </StyledView>

                <StyledView tw="flex-row items-center" style={{gap: 15}}>
                  {mode === 'broadcaster' ? (
                    <>
                      <TouchableOpacity
                        tw="p-1"
                        onPress={() => {
                          if (connectionState.audioMuted) {
                            agoraEngineRef.current?.enableAudio();
                          } else {
                            agoraEngineRef.current?.disableAudio();
                          }
                          agoraEngineRef.current?.muteLocalAudioStream(
                            !connectionState.audioMuted,
                          );
                          setConnectionState(prev => ({
                            ...prev,
                            audioMuted: !prev.audioMuted,
                          }));
                        }}
                        style={{borderRadius: 24}}>
                        <FeatherIcon
                          color={'white'}
                          name={connectionState.audioMuted ? 'mic-off' : 'mic'}
                          size={24}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        tw="p-1"
                        onPress={() => {
                          if (connectionState.videoMuted) {
                            agoraEngineRef.current?.enableVideo();
                          } else {
                            agoraEngineRef.current?.disableVideo();
                          }
                          agoraEngineRef.current?.muteLocalVideoStream(
                            !connectionState.videoMuted,
                          );
                          setConnectionState(prev => ({
                            ...prev,
                            videoMuted: !prev.videoMuted,
                          }));
                        }}
                        style={{borderRadius: 24}}>
                        <FeatherIcon
                          color={'white'}
                          name={
                            connectionState.videoMuted ? 'video-off' : 'video'
                          }
                          size={26}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        tw="p-1"
                        onPress={() => {
                          agoraEngineRef.current?.switchCamera();
                        }}
                        style={{borderRadius: 24}}>
                        <CameraFlipSVG width={24} height={24} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <></>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (mode === 'broadcaster')
                        BottomSheetRef.current?.present();
                      else agoraEngineRef.current?.leaveChannel();
                    }}
                    style={{borderRadius: 24}}>
                    <FeatherIcon name={'x'} size={26} color={'white'} />
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
              <StyledView tw="w-full row-reverse p-4">
                <StyledView tw="relative">
                  <StyledView tw="absolute" style={animatedTransformation}>
                    <StyledView tw="w-full">
                      <StyledView tw="w-full flex-row items-center">
                        <StyledButton
                          onPress={() => {
                            animation.value =
                              animation.value > 0
                                ? withTiming(0, {
                                    duration: Defaults.ANIMATION_DURATION,
                                  })
                                : withTiming(1, {
                                    duration: Defaults.ANIMATION_DURATION,
                                  });
                          }}
                          twButton="mr-3"
                          buttonStyle={{
                            borderRadius: 20,
                            paddingVertical: 6,
                            paddingHorizontal: 6,
                          }}
                          icon={
                            <AnimatedFeatherIcon
                              style={animatedRotation}
                              name="chevron-up"
                              color={'white'}
                              size={20}
                            />
                          }
                        />
                        <UserCircle
                          style={{marginEnd: 3}}
                          height={20}
                          width={20}
                        />
                        <StyledText h4 tw="text-white">
                          {nFormat(connectionState.viewCount)} views
                        </StyledText>
                      </StyledView>

                      <StyledView tw="w-full flex-row" style={{gap: 10}}>
                        <StyledText h1 tw="text-white">
                          {route.params.title}
                        </StyledText>
                        <StyledText
                          h3
                          tw="px-3 py-1 text-white"
                          style={{
                            backgroundColor: theme.colors.primary,
                            borderRadius: 10,
                          }}>
                          Live
                        </StyledText>
                      </StyledView>
                      <StyledText h4 tw="text-white">
                        {route.params.descripton}
                      </StyledText>
                    </StyledView>

                    <AnimatedFlatList
                      scrollEnabled
                      style={[
                        {height: Defaults.FLATLIST_HEIGHT},
                        animatedOpacity,
                        {marginVertical: 5},
                      ]}
                      keyExtractor={item =>
                        `${new Date().getUTCMilliseconds()}${
                          Math.random() * 10
                        }`
                      }
                      contentContainerStyle={{flexGrow: 1}}
                      data={comments}
                      inverted
                      renderItem={renderItem as ListRenderItem<unknown>}
                    />
                  </StyledView>
                </StyledView>

                <StyledView tw="flex-row items-center" style={{gap: 10}}>
                  <StyledView
                    tw="flex-row bg-white overflow-hidden items-center flex-1"
                    style={{
                      borderRadius: 30,
                      paddingLeft: 6,
                      paddingRight: 4,
                    }}>
                    <StyledInput
                      containerStyle={{flex: 1}}
                      errorStyle={{display: 'none'}}
                      inputContainerStyle={{
                        backgroundColor: 'transparent',
                      }}
                      inputStyle={{color: 'black'}}
                      placeholder="Write Comments.."
                      placeholderTextColor={'#727272'}
                      onChangeText={chatText =>
                        setConnectionState(prev => ({...prev, chatText}))
                      }
                      value={connectionState.chatText}
                    />
                    <StyledButton
                      onPress={() => {
                        if (connectionState.chatText.length > 0) {
                          sendJsonMessage('comment', {
                            comment: connectionState.chatText,
                          });
                          setConnectionState(prev => ({...prev, chatText: ''}));
                        }
                      }}
                      containerStyle={{borderRadius: 25}}
                      icon={<FeatherIcon name="chevron-right" size={25} />}
                    />
                  </StyledView>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      sendJsonMessage('like_live_room', {});
                    }}
                    tw="justify-center">
                    <StyledView
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderRadius: 35,
                      }}
                      tw="p-1 items-center justify-center">
                      <HeartSVG height={35} width={35} color={'white'} />
                    </StyledView>

                    <Badge
                      value={nFormat(connectionState.likeCount)}
                      containerStyle={{margin: -5}}
                      textStyle={{
                        color: 'black',
                        fontFamily: 'Manrope-Bold', // 600
                        fontWeight: '700',
                      }}
                      badgeStyle={{backgroundColor: 'white'}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    tw="p-2 items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 60,
                    }}>
                    <FeatherIcon
                      name="share-2"
                      onPress={() => {
                        Share.share({message: 'Chef is live now!'});
                      }}
                      size={30}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          </>
        ) : (
          <StyledView tw="flex-1 justify-center flex-row items-center">
            <StyledButton
              loading
              twButton={'bg-transparent'}
              loadingProps={{size: 32}}
            />
            <StyledText h1>Waiting for host to join.</StyledText>
          </StyledView>
        )
      ) : (
        <StyledView tw="flex-1 justify-center flex-row items-center">
          <StyledButton
            loading
            twButton={'bg-transparent'}
            loadingProps={{size: 32}}
          />
          <StyledText h1>Joining Live</StyledText>
        </StyledView>
      )}
      <BottomSheet />
    </StyledPageView>
  );
};

export default LiveStreaming;
