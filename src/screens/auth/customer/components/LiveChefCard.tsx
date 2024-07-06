import LetterLogo from '@/assets/icons/letterlogo.svg';
import {StyledText, StyledView} from '@/components';
import {LiveChefType} from '@/store/useLiveChefs';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type LiveChefCardPropsType = LiveChefType & {
  cardView?: boolean;
};

const LiveChefCard = ({
  // live_title,
  chef_name,
  chef_id,
  chef_profile_image,
  description,
  chef_live_image,
  cardView,
}: LiveChefCardPropsType) => {
  const navigation = useNavigation();
  console.log('ayaaaa live');

  return (
    <TouchableOpacity
      tw={`relative ${cardView ? 'mx-1' : ''}`}
      onPress={() =>
        navigation.navigate('live_streaming', {
          chefData: {
            id: chef_id,
            name: chef_name,
            profile_image: chef_profile_image,
          },
          title: description,
          descripton: description,
        })
      }
      style={{paddingBottom: 25}}>
      <ImageBackground
        source={{
          uri: chef_live_image,
        }}
        style={{
          width: 120,
          height: 160,
          borderRadius: 20,
        }}
        resizeMode="cover"
        imageStyle={{borderRadius: 20}}>
        <LinearGradient
          style={{height: '100%', width: '100%', borderRadius: 20}}
          colors={[
            'rgba(0, 0, 0,0.52)',
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, 0.69)',
          ]}
        />
        <StyledView className="absolute top-0 left-0 w-full h-full items-center justify-between">
          <StyledText h4 style={{color: 'white'}} tw="text-center px-1">
            {description}
          </StyledText>
          <StyledView
            style={{transform: [{translateY: 20}]}}
            className="items-center relative w-full">
            <StyledView className="absolute top-0" style={{marginTop: -20}}>
              <StyledText
                h5
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{color: 'white'}}>
                {chef_name}
              </StyledText>
            </StyledView>
            <StyledView className="justify-center items-center">
              <LetterLogo />
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 42,
                  zIndex: 100,
                }}
                className="absolute left-1"
                source={{
                  uri: chef_profile_image,
                }}
              />
            </StyledView>
          </StyledView>
        </StyledView>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default LiveChefCard;
