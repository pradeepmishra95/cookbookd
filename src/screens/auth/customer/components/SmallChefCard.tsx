import FilledLocationSVG from '@/assets/icons/FilledLocation.svg';
import StarSVG from '@/assets/icons/star.svg';
import {StyledText, StyledView} from '@/components';
import {ChefType} from '@/utils/types/customer';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@rneui/themed';
import {Image, TouchableOpacity} from 'react-native';

type SmallChefCardPropsType = ChefType;
const SmallChefCard = (props: SmallChefCardPropsType) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('customer_chef_profile', {id: props.id});
      }}
      className="flex-row justify-start items-center w-full"
      style={{columnGap: 10}}>
      <StyledView>
        <Image
          style={{height: 60, width: 60, borderRadius: 60}}
          source={{
            uri: props.profile_image,
          }}
        />
      </StyledView>
      <StyledView>
        <StyledView className="flex-row items-center mr-5">
          <StyledText>{props.fullname}</StyledText>
          <StyledView
            style={{
              backgroundColor: '#61C37A',
              width: 8,
              height: 8,
              borderRadius: 8,
              marginLeft: 5,
            }}></StyledView>
        </StyledView>
        <StyledView className="flex-row items-center" style={{columnGap: 5}}>
          <StyledText className="flex-row">
            <StarSVG color={'#FF8D07'} />
            <StyledText h5 style={{color: theme.colors.lightText}}>
              {' '}
              {props.average_rating} ({props.total_ratings})
            </StyledText>
          </StyledText>
          <StyledView
            style={{
              width: 3,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.colors.lightText,
            }}></StyledView>
          <StyledText
            className="flex-row"
            style={{color: theme.colors.lightText}}>
            <FilledLocationSVG
              color={theme.colors.lightText}
              width={12}
              height={12}
            />{' '}
            {props.distance} mi
          </StyledText>
        </StyledView>
      </StyledView>
    </TouchableOpacity>
  );
};

export default SmallChefCard;
