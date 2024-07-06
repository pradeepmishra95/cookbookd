import bottomTabData from '@/constants/bottomTab';
import {CustomerBottomTabParamListType} from '@/routes/auth/customer/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Text} from '@rneui/themed';
import {createElement} from 'react';

import {Pressable, View} from 'react-native';

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  return (
    <View tw="flex-row">
      {state.routes.map((route, index: number) => {
        const {options} = descriptors[route.key];
        const {title, icon} =
          bottomTabData['customer'][
            route.name as keyof CustomerBottomTabParamListType
          ];
        const isFocused = state.index === index;

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
            style={{
              backgroundColor: options.tabBarActiveBackgroundColor,
              borderTopColor: options.tabBarInactiveTintColor,
              borderTopWidth: 0.5,
            }}
            key={index}>
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
      })}
    </View>
  );
};
export default TabBar;
