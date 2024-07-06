import {StyledScrollView, StyledText, StyledView} from '@/components';
import StyledListItem from '@/components/ListItem';
import {AirbnbRating, useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import React from 'react';
import {Image, RefreshControl} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
// import {AirbnbRating} from 'rneui/themed';

type ReviewProps = {
  data: ReviewType[];
  refreshing: boolean;
  onRefresh: () => void;
};

export type ReviewType = {
  customer_name: string;
  customer_profile: string;
  date: string;
  feedback: string;
  ratings: string;
};

type initialStateI = {
  reviews: ReviewType[];
  loading: boolean;
};

const initialState: initialStateI = {
  reviews: [],
  loading: false,
};

const Review = ({data, refreshing, onRefresh}: ReviewProps) => {
  const {theme} = useTheme();
  const ReviewCard = ({
    customer_name,
    customer_profile,
    ratings,
    feedback,
    date,
  }: ReviewType) => {
    return (
      <StyledListItem
        containerStyle={{paddingHorizontal: 0}}
        leftComponent={
          customer_profile ? (
            <Image
              source={{uri: customer_profile}}
              style={{width: 36, height: 36, borderRadius: 36}}
            />
          ) : (
            <StyledView className=" rounded-full w-9 h-9 border border-white justify-center items-center mb-auto">
              <FeatherIcon name="user" size={25} color={theme.colors.grey5} />
            </StyledView>
          )
        }
        rightComponent={
          <StyledText style={{fontSize: 12}} className=" mb-auto">
            {dayjs(date).format('MMM DD, YYYY')}
          </StyledText>
        }
        title={
          <StyledView>
            <StyledText h4 className="mb-1">
              {customer_name}
            </StyledText>
            <AirbnbRating
              isDisabled
              defaultRating={Number.parseInt(ratings)}
              selectedColor={'#FF8D07'}
              ratingContainerStyle={{
                backgroundColor: theme.colors.background,
                alignItems: 'flex-start',
              }}
              showRating={false}
              size={16}
              // starContainerStyle={{width: 10}}
            />
          </StyledView>
        }
        subtitle={<StyledText style={{fontSize: 12}}>{feedback}</StyledText>}
      />
    );
  };

  return (
    <StyledScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {data.map((review, i) => {
        return <ReviewCard key={i} {...review} />;
      })}
    </StyledScrollView>
  );
};

export default Review;
