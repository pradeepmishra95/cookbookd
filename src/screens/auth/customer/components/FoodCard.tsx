import HeartFilledSVG from '@/assets/icons/custom/HeartFilledSVG';
import LocationSVG from '@/assets/icons/location_small.svg';
import StarSVG from '@/assets/icons/star.svg';
import {StyledText, StyledView} from '@/components';
import useData from '@/store/useData';
import {FoodType} from '@/utils/types/customer';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@rneui/themed';
import {useMemo} from 'react';
import {Image, TouchableOpacity} from 'react-native';

type FoodCardPropsType = FoodType & {
  showFavorite?: boolean;
  handleFavorite?: (id: number) => void;
  rowView?: boolean;
};

const FoodCard = (props: FoodCardPropsType) => {
  console.log({props});

  const {theme} = useTheme();
  const navigation = useNavigation();
  const {favorites} = useData();
  const isFavorite = useMemo(() => favorites.menu.has(props.id), [favorites]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('customer_menu_details', {menu_id: props.id})
      }
      tw={`p-2 my-1 ${props.rowView ? '' : 'flex-[0.5]'}`}>
      <Image
        source={{
          uri: props.menu_images?.length > 0 ? props.menu_images[0].image : '',
        }}
        style={{
          width: props.rowView ? 180 : '100%',
          height: 180,
          borderRadius: 8,
        }}
      />
      {(props.showFavorite ?? false) && (
        <StyledView
          tw="p-1 m-2 absolute top-2 right-2 items-center justify-center"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            height: 24,
            width: 24,
          }}>
          <HeartFilledSVG
            heart_color={isFavorite ? theme.colors.primary : 'transparent'}
            heart_stroke={
              isFavorite ? theme.colors.primary : theme.colors.black
            }
          />
        </StyledView>
      )}
      <StyledText h3>{props.title}</StyledText>
      <StyledView tw="flex-row items-center" style={{gap: 5}}>
        <Image
          source={{uri: props.profile_image}}
          style={{width: 20, height: 20, borderRadius: 20}}
        />
        <StyledText h4 h4Style={{color: theme.colors.lightText}}>
          {props.fullname}
        </StyledText>
      </StyledView>
      <StyledView tw="flex-row items-center" style={{gap: 5}}>
        <StyledView tw="flex-row items-center" style={{gap: 3}}>
          <StarSVG color="#FF8D07" width={10} height={10} />
          <StyledText h5>{props.average_rating}</StyledText>
          <StyledText h5 style={{color: theme.colors.lightText}}>
            ({props.total_ratings})
          </StyledText>
        </StyledView>

        <StyledView
          style={{
            backgroundColor: theme.colors.lightText,
            borderRadius: 40,
            width: 3,
            height: 3,
          }}
        />
        <StyledView tw="flex-row items-center" style={{gap: 5}}>
          <LocationSVG color={'#727272'} width={12} height={12} />
          <StyledText h5 style={{color: theme.colors.lightText}}>
            {'1.3mi'}
          </StyledText>
        </StyledView>
      </StyledView>
    </TouchableOpacity>
  );
};

export default FoodCard;
