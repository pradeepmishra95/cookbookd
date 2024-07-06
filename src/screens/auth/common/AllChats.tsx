import {StyledPageView, StyledText, StyledView} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Badge, useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {Image} from 'react-native';

type AllChatsPropsType = NativeStackScreenProps<
  RootStackParamList,
  'all_chats'
>;

const AllChats = ({navigation, route}: AllChatsPropsType) => {
  const {theme} = useTheme();
  return (
    <StyledPageView
      isScrollable={false}
      style={{paddingHorizontal: 10}}
      header
      navigation={navigation}
      route={route}
      title={'All Chats'}>
      <StyledView
        tw="flex-row items-center p-2 mt-3"
        style={{
          gap: 10,
          borderWidth: 1,
          borderColor: theme.colors.greyOutline,
          borderRadius: 15,
        }}>
        <Image
          source={{
            uri: 'https://cookbookd.mtesthub.in/public/images/Image-1694722942-593.jpg',
          }}
          style={{height: 40, width: 40, borderRadius: 40}}
        />
        <StyledView tw="flex-1">
          <StyledText h2>Shashwat</StyledText>
          <StyledText h3 h3Style={{color: theme.colors.lightText}}>
            hello
          </StyledText>
        </StyledView>
        <StyledView>
          <StyledText>2 mi ago</StyledText>
          <Badge value={2} />
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default AllChats;
