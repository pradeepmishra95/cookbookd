import {StyledText, StyledView} from '@/components';
import {useTheme} from '@rneui/themed';
import {ReactNode} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CheckboxI {
  status: boolean;
  toggleStatus: () => void;
  loading?: boolean;
  label?: ReactNode;
  size?: number;
}

const Checkbox = ({
  status,
  loading,
  toggleStatus,
  label,
  size,
  ...props
}: CheckboxI & TouchableOpacityProps) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={toggleStatus}
      {...props}>
      <StyledView className="flex-row items-center gap-1">
        <MaterialIcon
          name={status ? 'checkbox-marked' : 'checkbox-blank-outline'}
          color={theme.colors.black}
          size={size ?? 24}
        />
        {label ? (
          typeof label === 'string' ? (
            <StyledText h4>{label}</StyledText>
          ) : (
            label
          )
        ) : null}
      </StyledView>
    </TouchableOpacity>
  );
};

export default Checkbox;
