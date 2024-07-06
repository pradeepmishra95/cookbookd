import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Slider} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useMemo, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import Video from 'react-native-video';

type VideoPlayerPropsType = NativeStackScreenProps<
  RootStackParamList,
  'video_player'
>;

interface initialStateI {
  buffering: boolean;
  paused: boolean;
  aspectRatio: number;
  maxDuration: number;
  currDuration: number;
}

const initialState: initialStateI = {
  buffering: true,
  paused: false,
  aspectRatio: 0,
  maxDuration: 0,
  currDuration: 0,
};

const VideoPlayer = ({navigation, route}: VideoPlayerPropsType) => {
  const [state, setState] = useState(initialState);
  const {width, height} = Dimensions.get('window');
  const playerHeight = useMemo(
    () =>
      state.aspectRatio > 0
        ? state.aspectRatio < 1
          ? height
          : width / state.aspectRatio
        : 0,
    [height, state.aspectRatio],
  );
  const playerWidth = useMemo(
    () => (state.aspectRatio > 0 ? width : 0),
    [width, state.aspectRatio],
  );
  const player = useRef<Video>(null);

  return (
    <StyledPageView isScrollable={false}>
      <Video
        ref={player}
        repeat
        source={{uri: route.params.uri}}
        style={{
          height: playerHeight,
          width: playerWidth,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        resizeMode="contain"
        paused={state.paused}
        onLoad={({naturalSize, duration}) => {
          setState(prev => ({
            ...prev,
            aspectRatio: naturalSize.width / naturalSize.height,
            maxDuration: duration,
            buffering: false,
          }));
        }}
        onBuffer={({isBuffering}) =>
          setState(prev => ({...prev, buffering: isBuffering}))
        }
        onProgress={data => {
          setState(prev => ({...prev, currDuration: data.currentTime}));
        }}
        onSeek={data => {
          console.log(data);

          setState(prev => ({
            ...prev,
            currDuration: data.seekTime,
            paused: false,
          }));
        }}
      />
      <StyledView tw="absolute w-full h-full top-0 left-0 items-center justify-center">
        <StyledButton
          loading={state.buffering}
          loadingProps={{size: 64}}
          twButton="bg-transparent"
        />
        <StyledView
          tw="absolute bottom-[10] left-0 flex-row items-center p-4"
          style={{gap: 10}}>
          <StyledText>{state.currDuration.toFixed(2)}</StyledText>
          <Slider
            style={{flex: 1}}
            allowTouchTrack
            thumbTintColor="white"
            thumbStyle={{height: 20, width: 20}}
            value={state.currDuration}
            onValueChange={value => {
              player.current?.seek(value);
            }}
            minimumValue={0}
            maximumValue={state.maxDuration}
          />
          <StyledText>{state.maxDuration.toFixed(2)}</StyledText>
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default VideoPlayer;
