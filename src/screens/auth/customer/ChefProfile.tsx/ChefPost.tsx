import {StyledButton, StyledText, StyledView} from '@/components';
import Divider from '@/components/Divider';
import Post, {PostType} from '@/components/Post';
import urls from '@/constants/urls';
import useData from '@/store/useData';
import usePaginatedRequest from '@/utils/usePaginatedRequest';
import {Skeleton} from '@rneui/themed';
import React, {useEffect, useMemo} from 'react';
import {FlatList} from 'react-native';

const ChefPost = ({id}: {id: number}) => {
  const key = `${id}`;
  const {data, fetchFirstPage, endReached, loading, resetData, fetchNextPage} =
    usePaginatedRequest<PostType>({
      requestParams: ['GET', urls.auth.chef.posts.get.concat('/', key)],
      initialState: [],
    });
  const {posts, setPosts, getPosts} = useData();
  const allPosts = useMemo(() => getPosts(key), [posts]);

  useEffect(() => {
    resetData();
    fetchFirstPage();
  }, []);

  useEffect(() => {
    setPosts(key, data);
  }, [data]);

  return (
    <FlatList
      data={allPosts}
      refreshing={false}
      onRefresh={() => {
        resetData();
        fetchFirstPage();
      }}
      style={{marginTop: 10}}
      onEndReached={() => {
        if (!endReached) fetchNextPage();
      }}
      showsVerticalScrollIndicator={false}
      renderItem={({index}) => <Post index={index} type={key} />}
      ListEmptyComponent={() =>
        loading ? (
          <StyledView tw="w-full" style={{gap: 10}}>
            <StyledView tw="w-full flex-row" style={{gap: 10}}>
              <Skeleton circle height={40} width={40} />
              <Skeleton height={40} style={{flex: 1}} />
            </StyledView>
            <Skeleton height={250} />
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

export default ChefPost;
