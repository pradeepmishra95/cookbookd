import BackSVG from '@/assets/icons/custom/BackSVG';
import {StyledText, StyledView} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';
import {TouchableOpacity} from 'react-native';

export type PageHeaderPropsType = NativeStackScreenProps<
  RootStackParamList,
  keyof RootStackParamList
> & {
  title?: ReactElement<any, string | JSXElementConstructor<any>> | string;
  backButton?: boolean;
  rightComponent?: ReactNode;
  isCenter?: boolean;
};

const PageHeader = ({
  title,
  navigation,
  backButton,
  rightComponent,
  isCenter,
}: PageHeaderPropsType) => {
  const {theme} = useTheme();
  const renderCenterElement = useCallback(() => {
    return typeof title === 'string' ? (
      <StyledView>
        <StyledText h1>{title ?? ''}</StyledText>
      </StyledView>
    ) : (
      title
    );
  }, [title]);

  return (
    <StyledView className="flex-row w-full justify-between items-center p-2">
      <StyledView tw="flex-row h-full items-center justify-center">
        {backButton ?? true ? (
          <TouchableOpacity
            onPress={() => navigation.pop()}
            tw="px-5 pr-7"
            activeOpacity={0.8}>
            <BackSVG color={theme.colors.black} />
          </TouchableOpacity>
        ) : null}
        {!(isCenter ?? false) && renderCenterElement()}
      </StyledView>

      {(isCenter ?? false) && (
        <StyledView tw="absolute h-full w-full h-full left-0 top-0">
          {renderCenterElement()}
        </StyledView>
      )}

      {rightComponent ? (
        <TouchableOpacity tw="p-3 " activeOpacity={0.8}>
          {rightComponent}
        </TouchableOpacity>
      ) : null}
    </StyledView>
  );
};

export default PageHeader;
