import {VerificationType} from '@/screens/Verification';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

type CommonRoutesType = {
  verification: {
    [key in VerificationType]?: {
      title?: string;
      data: string;
    };
  } & {
    header?: boolean;
    backButton?: boolean;
    navigateTo: Parameters<
      NativeStackScreenProps<RootStackParamList>['navigation']['replace']
    >;
    mode?: 'forgot_password';
  };
  enter_location: undefined;
};

export default CommonRoutesType;
