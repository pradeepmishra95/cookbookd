import ErrorSVG from '@/assets/icons/error.svg';
import SuccessSVG from '@/assets/icons/success.svg';
import {StyledView} from '@/components';
import toasterStyles from '@/constants/toasterStyles';
import {StatusBar} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import FeatherIcon from 'react-native-vector-icons/Feather';

const renderIcon = (type: 'success' | 'error') => {
  switch (type) {
    case 'success':
      return <SuccessSVG />;
    default:
      return <ErrorSVG height={60} width={60} />;
  }
};

const showToast = ({
  message,
  description,
  type,
}: {
  message: string;
  description: string;
  type: 'success' | 'error';
}) => {
  showMessage({
    message,
    description,
    floating: true,
    ...toasterStyles[type],
    icon: () => renderIcon(type),
    renderBeforeContent: () => (
      <StyledView tw="absolute right-0 top-0 p-3">
        <FeatherIcon size={20} name="x" color={'#000'} />
      </StyledView>
    ),
  });
};

const Toaster = () => {
  return (
    <FlashMessage statusBarHeight={StatusBar.currentHeight} position="top" />
  );
};

export {showToast};
export default Toaster;
