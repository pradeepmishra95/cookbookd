import FilledLocationSVG from '@/assets/icons/FilledLocation.svg';
import {
  StyledButton,
  StyledInput,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

type OrderDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'chef_order_details'
>;

type OrderItemProps = {
  name: string;
  amount: number;
  image: string;
};

interface initialStateI {
  description: string;
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
  description: '',
};

const OrderDetails = ({navigation, route}: OrderDetailsProps) => {
  const [state, setState] = useState<initialStateI>(initialState);

  const {theme} = useTheme();

  const OrderItems: OrderItemProps[] = [
    {
      name: 'Meat',
      amount: 2,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU',
    },
    {
      name: 'Sandwhich',
      amount: 1,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU',
    },
    {
      name: 'Pizza',
      amount: 3,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU',
    },
    {
      name: 'Burger',
      amount: 1,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU',
    },
  ];

  const OrderItem = ({name, amount, image}: OrderItemProps) => (
    <StyledView className="items-center gap-y-1">
      {/* https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU */}
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp3BTlqyVBHHn1_QrBNo7E2J8mX_jnfpQcHhoYy2uG7ecYdInSm_X8MWpdknJbRrjKpYA&usqp=CAU',
        }}
        style={{borderRadius: 10}}
        height={100}
        width={100}
      />
      <StyledText>{name}</StyledText>
      <StyledText>{amount} items</StyledText>
    </StyledView>
  );
  return (
    <StyledPageView
      header
      navigation={navigation}
      twScrollView="justify-start"
      title={
        <StyledView tw="flex-row gap-2">
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
            }}
            style={{width: 48, height: 48, borderRadius: 48}}
          />
          <StyledView tw="justify-center items-start">
            <StyledText h2 className="mb-1">
              {route.params.customer_name}
            </StyledText>
            <StyledView tw=" flex-row justify-center items-center gap-x-1">
              <FilledLocationSVG
                color={theme.colors.black}
                width={15}
                height={15}
              />
              <StyledText
                h5
                style={{color: theme.colors.lightText}}
                className=" justify-center items-center">
                1.7 miles
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      }
      footerComponent={
        <StyledView className="flex-row gap-x-2">
          <TouchableOpacity
            activeOpacity={1}
            // onPress={() => BottomSheetRef.current?.present()}
            style={{
              flex: 1,
              height: 44,
              backgroundColor: theme.colors.greyOutline,
              borderColor: theme.colors.grey1,
              borderWidth: 0.5,
              borderRadius: 8,
            }}
            tw="justify-center items-center">
            <StyledText h4>Reject</StyledText>
          </TouchableOpacity>
          {/* <TouchableOpacity
            activeOpacity={1}
            disabled={true}
            onPress={() =>
              navigation.navigate('chef_order_details', {
                customer_name: 'Gojo Satoro',
              })
            }
            style={{
              flex: 1,
              height: 44,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            }}
            tw="justify-center items-center">
            <StyledText h4>Accept</StyledText>
          </TouchableOpacity> */}
          <StyledButton title={'Accept'} twContainer={'flex-1 '} />
        </StyledView>
      }
      route={route}>
      <StyledView className=" w-full justify-start gap-y-4">
        <StyledView
          style={{backgroundColor: theme.colors.searchBg}}
          className="rounded-xl w-full gap-y-2 p-3">
          <StyledView className="w-full">
            <StyledView className="w-full flex-row">
              <StyledText style={{color: theme.colors.lightText}}>
                Order
              </StyledText>
              <StyledText> #23241232</StyledText>
            </StyledView>
            <StyledView className="w-full flex-row">
              <StyledText style={{color: theme.colors.lightText}}>
                Order On:{' '}
              </StyledText>
              <StyledText> Jun 21, 2023 at 11:30 AM</StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="w-full flex-row">
            <StyledText style={{color: theme.colors.lightText}}>
              Expected Delivery:{' '}
            </StyledText>
            <StyledText> Jun 24, 2023 at 2:30 PM</StyledText>
          </StyledView>
          <StyledView className="w-full flex-row items-center">
            <StyledText style={{color: theme.colors.lightText}}>
              Order Type:{' '}
            </StyledText>
            <StyledView
              className="py-1 px-3 rounded-3xl "
              style={{borderColor: theme.colors.primary, borderWidth: 0.5}}>
              <StyledText>Delivery</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledView className="gap-y-2">
          <StyledText h3>Address Details</StyledText>
          <StyledView
            style={{backgroundColor: theme.colors.searchBg}}
            className="rounded-xl w-full p-3">
            <StyledText h4>23280 Ebraska St, Frebraska 2321</StyledText>
          </StyledView>
        </StyledView>

        <StyledView className="gap-y-2">
          <StyledText h3>Order Items</StyledText>
          <StyledView>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              ItemSeparatorComponent={() => <StyledView tw="m-1" />}
              data={OrderItems}
              renderItem={({item}) => (
                <OrderItem
                  name={item.name}
                  amount={item.amount}
                  image={item.image}
                />
              )}
            />
          </StyledView>
        </StyledView>

        <StyledView className="gap-y-2">
          <StyledText h3>Total Prize</StyledText>
          <StyledView>
            <StyledInput
              multiline
              numberOfLines={4}
              placeholder="Description"
              textAlignVertical="top"
              style={{fontSize: 14}}
              containerStyle={{
                flexDirection: 'column-reverse',
                marginBottom: 10,
                paddingHorizontal: 0,
              }}
              onChangeText={desc =>
                setState(prev => ({
                  ...prev,
                  description:
                    prev.description.length <= 250 ? desc : prev.description,
                }))
              }
              value={state.description}
              errorStyle={{display: 'none'}}
              inputContainerStyle={{paddingHorizontal: 10}}
              label={
                <StyledText
                  tw="w-full text-right"
                  style={{color: theme.colors.lightText}}
                  h4>
                  {state.description.length}/250
                </StyledText>
              }
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledPageView>
  );
};

export default OrderDetails;
