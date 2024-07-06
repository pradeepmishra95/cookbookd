import HeartFilledSVG from '@/assets/icons/custom/HeartFilledSVG';
import ReplySVG from '@/assets/icons/reply.svg';
import {StyledText, StyledView} from '@/components';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import {useCallback, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';

export type CommentType = {
  id: number;
  parent_id: number;
  post_id: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_profile_image: string;
  likes: number;
  replied_to: string | null;
  is_liked: boolean;
};

type CommentPropType = CommentType & {
  onReply: (id: number, user: string) => void;
};

const Comment = ({
  user_name,
  user_profile_image,
  created_at,
  comment,
  onReply,
  id,
  likes,
  replied_to,
  is_liked,
}: CommentPropType) => {
  const {theme} = useTheme();
  const nFormat = Intl.NumberFormat('en', {notation: 'compact'}).format;
  const [state, setState] = useState({
    likes,
    is_liked,
  });

  const handleLike = useCallback((action: boolean) => {
    request(
      'GET',
      `${
        Config.USER_TYPE === 'chef'
          ? urls.auth.chef.comment.like
          : urls.auth.customer.comment.like
      }/${id}`,
    );
  }, []);

  return (
    <StyledView style={{gap: 15}} tw="my-2">
      <StyledView tw="flex-row items-start" style={{gap: 10}}>
        <Image
          source={{uri: user_profile_image}}
          style={{width: 36, height: 36, borderRadius: 36}}
        />
        <StyledView tw="flex-1">
          <StyledView tw="flex-row items-center" style={{gap: 5}}>
            <StyledText h3>{user_name}</StyledText>
            {replied_to ? (
              <>
                <StyledView
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 5,
                    backgroundColor: theme.colors.lightText,
                  }}
                />
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  h4
                  h4Style={{color: theme.colors.lightText}}>
                  {replied_to}
                </StyledText>
              </>
            ) : null}
          </StyledView>
          <StyledText h5 style={{color: theme.colors.lightText}}>
            {dayjs().to(dayjs(created_at))}
          </StyledText>
        </StyledView>
        <StyledView tw="flex-row items-center" style={{gap: 5}}>
          <StyledText>{nFormat(state.likes)}</StyledText>
          <HeartFilledSVG
            onPress={() =>
              setState(prev => {
                handleLike(!prev.is_liked);
                return {
                  ...prev,
                  is_liked: !prev.is_liked,
                  likes: prev.is_liked ? prev.likes - 1 : prev.likes + 1,
                };
              })
            }
            height={24}
            width={24}
            heart_color={state.is_liked ? theme.colors.primary : 'transparent'}
            heart_stroke={
              state.is_liked ? theme.colors.primary : theme.colors.black
            }
          />
        </StyledView>
      </StyledView>
      <StyledText h5>{comment}</StyledText>
      <TouchableOpacity
        onPress={() => onReply(id, user_name)}
        tw="flex-row items-center"
        style={{gap: 10}}>
        <ReplySVG color={theme.colors.black} width={16} height={16} />
        <StyledText h5>Reply</StyledText>
      </TouchableOpacity>
    </StyledView>
  );
};

export default Comment;
