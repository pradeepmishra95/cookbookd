import BackSVG from '@/assets/icons/custom/BackSVG';
import ClipBoardTextSVG from '@/assets/icons/custom/ClipBoardTextSVG';
import LocationSVG from '@/assets/icons/custom/LocationSVG';
import LockSVG from '@/assets/icons/custom/LockSVG';
import MessageQuestionSVG from '@/assets/icons/custom/MessageQuestionSVG';
import Wallet1SVG from '@/assets/icons/custom/Wallet1SVG';
import {StyledPageView, StyledView} from '@/components';
import StyledListItem, {StyledListItemPropsType} from '@/components/ListItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme as useRNUITheme} from '@rneui/themed';
import {RootStackParamList} from 'App';

type SettingsPropsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_settings'
>;

const Settings = ({navigation, route}: SettingsPropsType) => {
  const {theme} = useRNUITheme();
  const ForwordButton = () => (
    <BackSVG className="rotate-180" color={theme.colors.black} />
  );

  const ListItems: (StyledListItemPropsType & {
    navigateTo?: Parameters<
      NativeStackScreenProps<RootStackParamList>['navigation']['navigate']
    >[0];
  })[] = [
    {
      title: 'Addresses',
      leftComponent: <LocationSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'address_management', params: undefined},
    },
    {
      title: 'Payment',
      leftComponent: <Wallet1SVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
    },
    {
      title: 'Change Password',
      leftComponent: <LockSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'change_password', params: undefined},
    },
    {
      title: 'Customer Support',
      leftComponent: <MessageQuestionSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'support', params: undefined},
    },
    {
      title: 'Guideline',
      leftComponent: <MessageQuestionSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'guideline', params: undefined},
    },
    {
      title: 'Terms & Conditions',
      leftComponent: <ClipBoardTextSVG color={theme.colors.black} />,
      rightComponent: <ForwordButton />,
      navigateTo: {name: 'terms_and_condition', params: undefined},
    },
  ];

  return (
    <StyledPageView
      header
      navigation={navigation}
      route={route}
      twScrollView={'justify-start'}
      title="Settings">
      <StyledView className=" w-full h-full justify-start gap-y-3 mt-2">
        {ListItems.map((item, i) => (
          <StyledListItem
            key={i}
            {...item}
            onPress={() => {
              item.navigateTo !== undefined
                ? navigation.navigate(item.navigateTo)
                : undefined;
            }}
            twContainer={'w-full rounded-lg'}
            leftComponent={
              <StyledView
                className=" rounded-full p-1"
                style={{backgroundColor: theme.colors.greyOutline}}>
                {item.leftComponent}
              </StyledView>
            }
            containerStyle={{backgroundColor: theme.colors.grey0}}
          />
        ))}
      </StyledView>
    </StyledPageView>
  );
};

export default Settings;
