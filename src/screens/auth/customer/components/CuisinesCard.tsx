import {StyledText, StyledView} from '@/components';
import {CuisinesType} from '@/utils/types/customer';
import React from 'react';
import {Image} from 'react-native';

type CuisineCardPropsType = CuisinesType & {
  mode?: 'row';
  styleCardProps: any;
};

const CuisineCard = ({
  image,
  label,
  mode,
  styleCardProps,
}: CuisineCardPropsType) => {
  return (
    <StyledView
      className={`items-center gap-y-2 ${
        mode === 'row' ? 'flex-row gap-x-2' : ''
      }`}>
      <StyledView>
        <Image
          source={{uri: image}}
          style={{...styleCardProps}}
        />
      </StyledView>
      <StyledText h4>{label}</StyledText>
    </StyledView>
  );
};

export default CuisineCard;
