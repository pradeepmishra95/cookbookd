import {StyledButton, StyledText, StyledView} from '@/components';
import Divider from '@/components/Divider';
import StyledListItem from '@/components/ListItem';
import urls from '@/constants/urls';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {AirbnbRating, Skeleton, useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {FlatList, Image} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
// import {AirbnbRating} from 'rneui/themed';

type ReviewPropsType = {
  id: number;
};

type ReviewType = {
  customer_name: string;
  customer_profile: string;
  date: string;
  feedback: string;
  ratings: string;
};

const ReviewCard = ({
  customer_name,
  customer_profile,
  ratings,
  feedback,
  date,
}: ReviewType) => {
  const {theme} = useTheme();
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

const Review = ({id}: ReviewPropsType) => {
  const {data, fetchFirstPage, resetData, fetchNextPage, loading, endReached} =
    usePaginatedRequest<ReviewType>({
      requestParams: ['GET', urls.auth.chef.rating.get.concat('/', `${id}`)],
      initialState: [],
    });

  useEffect(() => {
    fetchFirstPage();
  }, []);

  return (
    <FlatList
      data={data}
      refreshing={false}
      onRefresh={() => {
        resetData();
        fetchFirstPage();
      }}
      onEndReached={() => {
        if (!endReached) fetchNextPage();
      }}
      style={{marginTop: 10}}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => <ReviewCard {...item} />}
      ListEmptyComponent={() =>
        loading ? (
          <StyledView tw="w-full flex-row items-center py-3" style={{gap: 10}}>
            <Skeleton circle height={36} width={36} />
            <StyledView style={{flex: 1, gap: 10}}>
              <StyledView tw="flex-row justify-between w-full">
                <Skeleton height={20} style={{width: '30%'}} />
                <Skeleton height={20} style={{width: '20%'}} />
              </StyledView>
              <Skeleton height={30} style={{width: '50%'}} />
            </StyledView>
          </StyledView>
        ) : (
          <></>
        )
      }
      ItemSeparatorComponent={() => <Divider height={0.5} tw="my-4" />}
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
      ListHeaderComponentStyle={{marginBottom: 20}}
    />
  );
};

export default Review;
