import BackSVG from '@/assets/icons/custom/BackSVG';
import BookmarkSVG from '@/assets/icons/custom/BookmarkSVG';
import HeartFilledSVG from '@/assets/icons/custom/HeartFilledSVG';
import LocationSVG from '@/assets/icons/location_small.svg';
import MessageSVG from '@/assets/icons/message.svg';
import MoreSVG from '@/assets/icons/more.svg';
import PlaySVG from '@/assets/icons/play.svg';
import StarSVG from '@/assets/icons/star.svg';
import { StyledText, StyledView } from '@/components';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useAuth from '@/store/useAuth';
import useData from '@/store/useData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import { RootStackParamList } from 'App';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Config from 'react-native-config';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';

type PostMediaCommonType = {
  id: number;
  path: string;
};

type PostMediaImageType = {
  is_video: 0;
  thumbnail?: never;
};

type PostMediaVideoType = {
  is_video: 1;
  thumbnail: string;
};

type PostMediaType =
  | (PostMediaCommonType & PostMediaImageType)
  | (PostMediaCommonType & PostMediaVideoType);

export type PostType = {
  id: number;
  chef_id: number;
  description: string;
  created_at: string;
  posts_media: PostMediaType[];
  total_likes: number;
  total_comments: number;
  chef_name: string;
  chef_profile_image: string;
  total_ratings: number;
  total_avarage_rating: number;
  is_liked: boolean;
  is_saved: boolean;
};

export type PostPropsType = {
  index: number;
  type: string;
  openBottomSheet?: (id: number) => void;
  hasBackButton?: boolean;
  goBack?: () => void;
  showMediaList?: boolean;
  navigation?: NativeStackNavigationProp<RootStackParamList>;
};

const isImage = (item: PostMediaType) => item.is_video === 0;

const SavedPost = (props: PostPropsType) => {
  const {theme} = useTheme();
  const nFormat = Intl.NumberFormat('en', {notation: 'compact'}).format;
  const userData = useAuth(state => state.userData);
  const navigation = useNavigation();
  const {width} = Dimensions.get('screen');
  const {postAction, posts, getPosts} = useData();
  const postData = useMemo(() => getPosts(props.type)[props.index], [posts]);
  const isAuthor = useMemo(
    () =>
      Config.USER_TYPE === 'chef' ? userData?.id === postData.chef_id : true,
    [],
  );

  const handleLike = useCallback(() => {
    postAction('like', props.type, props.index);
    request(
      'GET',
      `${
        Config.USER_TYPE === 'chef'
          ? urls.auth.chef.posts.like
          : urls.auth.customer.posts.like
      }/${postData.id}`,
    );
  }, [postData]);

  const handleSave = useCallback(() => {
    postAction('save', props.type, props.index);
    request('GET', `${urls.auth.common.post.save}/${postData.id}`);
  }, [postData]);

  const renderMedia = useCallback(
    (
      media: PostMediaType,
      height?: ViewStyle['height'],
      width?: ViewStyle['width'],
    ) => {
      return isImage(media) ? (
        <Image
          source={{uri: media.path}}
          style={{height: height ?? '100%', width: width ?? '100%'}}
        />
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('video_player', {uri: media.path})}
          tw="relative"
          activeOpacity={0.8}
          style={{height: height ?? '100%', width: width ?? '100%'}}>
          <Image
            source={{uri: media.thumbnail}}
            style={{height: '100%', width: '100%'}}
          /> 
          <LinearGradient
            colors={['#00000000', '#00000090', '#00000000']}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
            tw="items-center justify-center">
            <StyledView tw="bg-[#FFFFFF90] p-4" style={{borderRadius: 50}}>
              <PlaySVG width={25} height={25} tw="" />
            </StyledView>
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [],
  );

  return (
    <StyledView tw="w-full" style={{gap: 15}}>
      <StyledView tw="flex-row items-center" style={{gap: 10}}>
        {(props.hasBackButton ?? false) && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (typeof props.goBack === 'function') {
                props.goBack();
              } else {
                navigation.goBack();
              }
            }}
            tw="justify-center px-2">
            <BackSVG color={theme.colors.black} />
          </TouchableOpacity>
        )}
        <Image
          source={{uri: postData.chef_profile_image}}
          style={{width: 40, height: 40, borderRadius: 40}}
        />
        <StyledView tw="flex-1">
          <StyledText h3>{postData.chef_name}</StyledText>
          <StyledView tw="flex-row items-center" style={{gap: 5}}>
            <StyledView tw="flex-row items-center" style={{gap: 3}}>
              <StarSVG color="#FF8D07" width={10} height={10} />
              <StyledText h5>{postData.total_avarage_rating}</StyledText>
              <StyledText h5 style={{color: theme.colors.lightText}}>
                ({postData.total_ratings})
              </StyledText>
            </StyledView>
            {userData?.id !== postData.chef_id && (
              <>
                <StyledView
                  tw="p-1"
                  style={{
                    backgroundColor: theme.colors.lightText,
                    borderRadius: 40,
                  }}
                />
                <StyledView tw="flex-row items-center" style={{gap: 5}}>
                  <LocationSVG color={'#727272'} width={12} height={12} />
                  <StyledText h5>{postData.total_avarage_rating}</StyledText>
                  <StyledText h5 style={{color: theme.colors.lightText}}>
                    ({postData.total_ratings})
                  </StyledText>
                </StyledView>
              </>
            )}
          </StyledView>
        </StyledView>
        <StyledView tw="self-start">
          <StyledText h5 style={{color: theme.colors.lightText}}>
            {dayjs().to(dayjs(postData.created_at))}
          </StyledText>
        </StyledView>
      </StyledView>
      {props.showMediaList ?? false ? (
        <FlatList
          horizontal
          data={postData.posts_media}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <StyledView tw="p-1" />}
          renderItem={({item}) => renderMedia(item, 250, width - 25)}
        />
      ) : (
        postData.posts_media.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!props.showMediaList) {
                navigation.navigate('post_details', {
                  index: props.index,
                  type: props.type,
                });
              }
            }}
            tw="flex-row"
            style={{height: 200}}>
            <StyledView tw="flex-1">
              {renderMedia(postData.posts_media[0])}
            </StyledView>
            {postData.posts_media.length > 1 && (
              <StyledView tw="flex-1 relative">
                {renderMedia(postData.posts_media[1])}
                {postData.posts_media.length > 2 && (
                  <LinearGradient
                    colors={['#EA2D2995', '#FFB50095']}
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                    }}
                    tw="items-center justify-center">
                    <StyledText h1 h1Style={{fontSize: 36}}>
                      +{postData.posts_media.length - 1}
                    </StyledText>
                  </LinearGradient>
                )}
              </StyledView>
            )}
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity
        activeOpacity={props.showMediaList ? 1 : 0.8}
        onPress={() => {
          if (!props.showMediaList) {
            navigation.navigate('post_details', {
              index: props.index,
              type: props.type,
            });
          }
        }}>
        <StyledText h4>{postData.description}</StyledText>
      </TouchableOpacity>
      <StyledView tw="w-full flex-row items-center">
        <StyledView tw="flex-row items-center flex-1" style={{gap: 20}}>
          <StyledView tw="flex-row items-center" style={{gap: 5}}>
            <HeartFilledSVG
              onPress={handleLike}
              height={24}
              width={24}
              heart_color={
                postData.is_liked ? theme.colors.primary : 'transparent'
              }
              heart_stroke={
                postData.is_liked ? theme.colors.primary : theme.colors.black
              }
            />
            <StyledText h5>{nFormat(postData.total_likes)}</StyledText>
          </StyledView>
          <StyledView tw="flex-row items-center" style={{gap: 5}}>
            <MessageSVG height={24} width={24} color={theme.colors.black} />
            <StyledText h5>{nFormat(postData.total_comments)}</StyledText>
          </StyledView>

          <FeatherIcon name="share-2" size={20} color={theme.colors.black} />
        </StyledView>
        {!isAuthor ? (
          <MoreSVG
            color={theme.colors.black}
            style={{transform: [{rotate: '90deg'}]}}
            onPress={() => {
              if (typeof props.openBottomSheet === 'function')
                props.openBottomSheet(postData.id);
            }}
          />
        ) : (
          <StyledView style={{gap: 10}} tw="flex-row items-center">
            <FeatherIcon
              name="flag"
              size={24}
              color={theme.colors.black}
              onPress={() =>
                navigation.navigate('report', {id: postData.id, type: 'post'})
              }
            />
            <BookmarkSVG
              onPress={handleSave}
              height={24}
              width={24}
              mark_fill={
                postData.is_saved ? theme.colors.primary : 'transparent'
              }
              mark_stroke={
                postData.is_saved ? theme.colors.primary : theme.colors.black
              }
            />
          </StyledView>
        )}
      </StyledView>
    </StyledView>
  );
};

export default memo(SavedPost);
