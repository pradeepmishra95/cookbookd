import {StyledPageView, StyledView} from '@/components';
import Divider from '@/components/Divider';
import StyledListItem from '@/components/ListItem';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useEffect, useState} from 'react';
import {FlatList, Image} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

type FollowersProps = NativeStackScreenProps<
  RootStackParamList,
  'customer_followers'
>;

type follower = {
  customer_name: string;
  customer_profile: string;
};

type initialStateI = {
  followers: follower[];
};
const initialState: initialStateI = {
  followers: [],
};

const Followers = ({navigation, route}: FollowersProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  useEffect(() => {
    (async () => {
      const {data, status, HttpStatusCode} = await request<follower[]>(
        'GET',
        urls.auth.chef.followers.get,
      );
      if (status === HttpStatusCode.OK && data.success) {
        console.log(data.data);
        setState(prev => ({
          ...prev,
          followers: data.data,
        }));
      }
    })();
  }, []);
  return (
    <StyledPageView
      navigation={navigation}
      route={route}
      header
      title={`Followers (${route.params.followers})`}
      isScrollable={false}>
      <FlatList
        data={state.followers}
        // style={{flex: 2}}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <StyledListItem
            key={index}
            twContainer={'w-full'}
            title={item.customer_name}
            leftComponent={
              item.customer_profile ? (
                <Image
                  source={{uri: item.customer_profile}}
                  style={{width: 48, height: 48, borderRadius: 48}}
                />
              ) : (
                <StyledView className=" rounded-full w-12 h-12 border border-white justify-center items-center">
                  <FeatherIcon
                    name="user"
                    size={35}
                    color={theme.colors.grey5}
                  />
                </StyledView>
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <Divider height={0.5} />}
      />
    </StyledPageView>
  );
};

export default Followers;
