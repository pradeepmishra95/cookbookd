import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import Comment, {CommentType} from '@/components/Comment';
import Divider from '@/components/Divider';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useData from '@/store/useData';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Skeleton, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, TextInput, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';

type AllCommentsProps = NativeStackScreenProps<
  RootStackParamList,
  'all_comments'
>;

interface replyDataI {
  comment_id: number;
  user: string;
  comment: string;
  loading: boolean;
}

const replyData: replyDataI = {
  comment_id: -1,
  user: '',
  comment: '',
  loading: false,
};

const AllComments = ({navigation, route}: AllCommentsProps) => {
  const [reply, setReply] = useState(replyData);
  const animation = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);
  const {theme} = useTheme();
  const {postAction, getPosts} = useData();
  const postData = useMemo(
    () => getPosts(route.params.type)[route.params.index],
    [],
  );

  const {loading, data, fetchFirstPage, endReached, fetchNextPage, resetData} =
    usePaginatedRequest<CommentType>({
      requestParams: [
        'GET',
        `${urls.auth.common.comments.get_post_comments}/${postData.id}`,
      ],
      initialState: [],
    });

  const makeComment = useCallback(async () => {
    if (reply.comment.length > 0) {
      setReply(prev => ({...prev, loading: true}));
      const {data, status, HttpStatusCode} = await request(
        'POST',
        (Config.USER_TYPE === 'chef'
          ? urls.auth.chef.comment.add
          : urls.auth.customer.comment.add
        ).concat(reply.comment_id !== -1 ? `/${reply.comment_id}` : ''),
        {},
        {post_id: postData.id, comment: reply.comment},
      );
      if (status === HttpStatusCode.OK && data.success) {
        resetData();
        postAction('comment', route.params.type, route.params.index);
        fetchFirstPage();
        inputRef.current?.blur();
        setReply(prev => ({...prev, comment: '', comment_id: -1}));
      }
      setReply(prev => ({...prev, loading: false}));
    }
  }, [reply.comment]);

  const animatedTransformation = useAnimatedStyle(() => {
    const translateX = interpolate(animation.value, [0, 1], [-200, 0]);
    const opacity = interpolate(animation.value, [0, 1], [0, 1]);
    const maxHeight = interpolate(animation.value, [0, 1], [0, 500]);
    return {opacity, maxHeight, transform: [{translateX}]};
  });

  useEffect(() => {
    fetchFirstPage();
  }, []);

  useEffect(() => {
    if (reply.comment_id === -1) {
      animation.value = withTiming(0, {duration: 300});
    } else {
      animation.value = withTiming(1, {duration: 300});
      inputRef.current?.focus();
    }
  }, [reply.comment_id]);

  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title={`Comments (${postData.total_comments})`}
      isScrollable={false}
      style={{paddingHorizontal: 5}}
      twScrollView="justify-start">
      <StyledView tw="flex-1">
        <FlatList
          onEndReachedThreshold={0.5}
          data={data}
          refreshing={false}
          onRefresh={() => {
            resetData();
            fetchFirstPage();
          }}
          ItemSeparatorComponent={() => <Divider tw="my-2" height={0.5} />}
          renderItem={({item}) => {
            return (
              <Comment
                {...item}
                onReply={(comment_id, user) =>
                  setReply(prev => ({...prev, comment_id, user}))
                }
              />
            );
          }}
          ListEmptyComponent={() => {
            return loading ? (
              <StyledView tw="w-full" style={{gap: 10}}>
                <StyledView tw="w-full flex-row" style={{gap: 10}}>
                  <Skeleton circle height={36} width={36} />
                  <Skeleton height={40} style={{flex: 1}} />
                </StyledView>
                <Skeleton height={50} />
              </StyledView>
            ) : (
              <></>
            );
          }}
          ListFooterComponent={() => {
            return data.length === 0 ? (
              <></>
            ) : (
              <StyledView tw="p-2">
                {endReached ? (
                  <StyledText tw="text-center">...</StyledText>
                ) : loading ? (
                  <StyledButton loading twButton={'bg-transparent'} />
                ) : null}
              </StyledView>
            );
          }}
          onEndReached={() => fetchNextPage()}
        />
      </StyledView>
      <StyledView tw="py-3">
        <StyledView style={animatedTransformation}>
          <StyledView
            tw="flex-row m-2 p-2 items-center"
            style={[
              {
                backgroundColor: theme.colors.lightBg,
                width: 'auto',
                borderLeftColor: theme.colors.primary,
                borderLeftWidth: 10,
                borderRadius: 10,
              },
            ]}>
            <StyledText tw="flex-1" h4>
              Replying to{' '}
              <StyledText h4 style={{color: theme.colors.primary}}>
                {reply.user}
              </StyledText>
            </StyledText>
            <TouchableOpacity activeOpacity={0.5} tw="p-2">
              <FeatherIcon
                name="x"
                size={18}
                onPress={() => setReply(prev => ({...prev, comment_id: -1}))}
              />
            </TouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView tw="flex-row overflow-hidden items-center">
          <StyledInput
            ref={inputRef}
            containerStyle={{flex: 1}}
            errorStyle={{display: 'none'}}
            placeholder="Write Comments.."
            onChangeText={comment => setReply(prev => ({...prev, comment}))}
            value={reply.comment}
          />
          <StyledButton
            onPress={makeComment}
            containerStyle={{borderRadius: 25}}
            loading={reply.loading}
            disabled={reply.comment.length === 0}
            icon={<FeatherIcon name="chevron-right" size={25} />}
          />
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default AllComments;
