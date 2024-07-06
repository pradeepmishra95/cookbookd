import bottomTabData from '@/constants/bottomTab';
import {ChefBottomTabParamListType} from '@/routes/auth/chef/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Text} from '@rneui/themed';
import {createElement} from 'react';
import {Pressable, View} from 'react-native';
import PlusAction from './PlusAction';

const renderTabBar = (
  route: BottomTabBarProps['state']['routes'][0],
  index: number,
  offset: number,
  descriptors: BottomTabBarProps['descriptors'],
  state: BottomTabBarProps['state'],
  navigation: BottomTabBarProps['navigation'],
) => {
  const {options} = descriptors[route.key];
  const {title, icon} =
    bottomTabData['chef'][route.name as keyof ChefBottomTabParamListType];
  const isFocused = state.index === offset + index;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };
  return (
    <View
      tw="flex-row flex-1 py-2"
      key={index}
      style={{
        backgroundColor: options.tabBarActiveBackgroundColor,
        borderTopColor: options.tabBarInactiveTintColor,
        borderTopWidth: 0.5,
      }}>
      <Pressable
        tw="flex-1 bg-transparent justify-center items-center"
        onPress={onPress}>
        {createElement(icon, {
          color: isFocused
            ? options.tabBarActiveTintColor
            : options.tabBarInactiveTintColor,
          height: 30,
          width: 30,
        })}
        <Text
          h4
          style={[
            !isFocused
              ? {
                  color: options.tabBarInactiveTintColor,
                }
              : {},
            {marginBottom: 5},
          ]}>
          {title}
        </Text>
        <View
          style={{
            height: 3,
            width: 18,
            borderRadius: 3,
            backgroundColor: isFocused
              ? options.tabBarActiveTintColor
              : 'transparent',
          }}
        />
      </Pressable>
    </View>
  );
};

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  return (
    <View tw="flex-row">
      {state.routes
        .slice(0, 2)
        .map((route, index: number) =>
          renderTabBar(route, index, 0, descriptors, state, navigation),
        )}
      <PlusAction />
      {state.routes
        .slice(2)
        .map((route, index: number) =>
          renderTabBar(route, index, 2, descriptors, state, navigation),
        )}
    </View>
  );
};
export default TabBar;
