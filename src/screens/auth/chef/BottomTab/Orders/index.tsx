import BagSVG from '@/assets/icons/bag.svg';
import ChatSVG from '@/assets/icons/chat.svg';
import PhoneSVG from '@/assets/icons/custom/PhoneSVG';
import TrashSVG from '@/assets/icons/trash.svg';
import {StyledPageView, StyledText, StyledView} from '@/components';
import Divider from '@/components/Divider';
import {Header} from '@/components/Header';
import useCommonBottomSheet from '@/utils/useCommonBottomSheet';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@rneui/themed';
import React, {ReactNode, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';

type order = {
  order_id: number;
  name: string;
  date: string;
  customer_name: string;
  order_image?: string;
  customer_image?: string;
};

const tabs = ['Pending', 'Confirmed', 'Completed'];

interface initialStateI {
  selectedTab: number;
  passwordVisible: boolean;
  rememberMe: boolean;
  orders: {pending: order[]; confirmed: order[]; completed: order[]};
  loading: boolean;
}

const initialState: initialStateI = {
  selectedTab: 0,
  passwordVisible: false,
  rememberMe: false,
  orders: {
    pending: [
      {
        order_id: 23247232,
        name: 'Lotteria - 124 Sandwhich ',
        date: 'Wed, 22 Jun at 12:30 Pm ',
        customer_name: 'Satoro Gojo',
      },
    ],
    confirmed: [
      {
        order_id: 23247232,
        name: 'Lotteria - 124 Sandwhich',
        date: 'Wed, 22 Jun at 12:30 Pm',
        customer_name: 'Satoro Gojo',
      },
    ],
    completed: [
      {
        order_id: 23247232,
        name: 'Lotteria - 124 Sandwhich',
        date: 'Wed, 22 Jun at 12:30 Pm',
        customer_name: 'Satoro Gojo',
      },
    ],
  },
  loading: false,
};

type OrdersCardProps = {
  FooterButtons?: ReactNode;
  HeaderStatus?: ReactNode;
  name?: string;
  date?: string;
  customerName?: string;
  customerImage?: string;
  ordeId?: number;
  orderImage?: string;
};

const OrdersCard = ({
  FooterButtons,
  HeaderStatus,
  ordeId,
  name,
  date,
  customerImage,
  orderImage,
  customerName,
}: OrdersCardProps) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  return (
    <StyledView
      className="justify-start w-full"
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: theme.colors.grey0,
      }}>
      <StyledView className="flex-row justify-between items-center mb-2">
        <StyledText h5>{`Order #${ordeId}`}</StyledText>
        {HeaderStatus}
      </StyledView>
      <StyledView className="flex-row justify-between w-full">
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
          }}
          className=" h-full"
          style={{
            flex: 0.6,
            borderRadius: 10,
            minWidth: '30%',
            maxHeight: 150,
          }}
        />
        <StyledView className="flex-2" style={{maxWidth: '70%'}}>
          <StyledView className="mb-3">
            <StyledText h2>{name}</StyledText>
            <StyledText h5>1 item</StyledText>
          </StyledView>
          <StyledView>
            <StyledText h5>Delivery</StyledText>
            <StyledText h4>{date}</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <Divider height={0.5} className="my-2" />
      <StyledView tw="flex-row justify-between items-center">
        <StyledView className="flex-row items-center flex-1">
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
            }}
            className="mr-2"
            style={{height: 36, width: 36, borderRadius: 36}}
          />
          <StyledView className="">
            <StyledText h5>Customer</StyledText>
            <StyledText h4>{customerName}</StyledText>
          </StyledView>
        </StyledView>
        {FooterButtons}
      </StyledView>
    </StyledView>
  );
};

const Orders = () => {
  const {theme} = useTheme();
  const [state, setState] = useState<initialStateI>(initialState);
  const navigation = useNavigation();
  const {BottomSheet, BottomSheetRef} = useCommonBottomSheet({
    icon: <BagSVG />,
    text: 'Are you sure you want to reject this order',
    buttonText: 'Reject',
  });

  return (
    <StyledPageView
      isScrollable={false}
      style={{paddingHorizontal: 5}}
      twScrollView={'justify-start'}>
      <Header />
      <StyledView
        className="flex-row m-3 p-1 w-full"
        style={{
          borderColor: theme.colors.greyOutline,
          borderWidth: 2,
          borderRadius: 25,
        }}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={`tab-${i}`}
            activeOpacity={state.selectedTab === i ? 1 : 0.5}
            onPress={() =>
              state.selectedTab !== i &&
              (() => {
                // form.resetField('emailPhone');
                setState(prev => ({...prev, selectedTab: i}));
              })()
            }>
            <StyledText
              h4
              style={[
                {
                  borderRadius: 25,
                  paddingHorizontal: 25,
                  paddingVertical: 8,
                },
                state.selectedTab === i
                  ? {
                      backgroundColor: theme.colors.secondary,
                      color:
                        theme.mode === 'light'
                          ? theme.colors.white
                          : theme.colors.black,
                    }
                  : {},
              ]}>
              {tab}
            </StyledText>
          </TouchableOpacity>
        ))}
      </StyledView>
      <StyledView className="justify-start w-full">
        {state.selectedTab === 0 &&
          state.orders.pending.map((order, i) => {
            return (
              <OrdersCard
                key={i}
                name={order.name}
                ordeId={order.order_id}
                date={order.date}
                customerName={order.customer_name}
                FooterButtons={
                  <StyledView className="flex-row gap-x-2 flex-1 h-full">
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => BottomSheetRef.current?.present()}
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.greyOutline,
                        borderColor: theme.colors.grey1,
                        borderWidth: 0.5,
                        borderRadius: 8,
                      }}
                      tw="justify-center items-center">
                      <StyledText h4>Reject</StyledText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>
                        navigation.navigate('chef_order_details', {
                          customer_name: 'Gojo Satoro',
                        })
                      }
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8,
                      }}
                      tw="justify-center items-center">
                      <StyledText h4>Accept</StyledText>
                    </TouchableOpacity>
                  </StyledView>
                }
              />
            );
          })}

        {state.selectedTab === 1 &&
          state.orders.confirmed.map((order, i) => {
            return (
              <OrdersCard
                key={i}
                name={order.name}
                ordeId={order.order_id}
                date={order.date}
                customerName={order.customer_name}
                HeaderStatus={
                  <StyledView className="flex-row justify-end flex-1 h-full">
                    <TouchableOpacity
                      activeOpacity={1}
                      // className="w-1/2"
                      style={{
                        flex: 0.3,
                        backgroundColor: theme.colors.greyOutline,
                        borderColor: theme.colors.grey1,
                        borderWidth: 0.5,
                        borderRadius: 8,
                        height: 31,
                      }}
                      tw="justify-center items-center">
                      <StyledText h4>Ready</StyledText>
                    </TouchableOpacity>
                  </StyledView>
                }
                FooterButtons={
                  <StyledView className="flex-row gap-x-4">
                    <PhoneSVG color={theme.colors.black} />
                    <ChatSVG color={theme.colors.black} />
                  </StyledView>
                }
              />
            );
          })}

        {state.selectedTab === 2 &&
          state.orders.completed.map((order, i) => {
            return (
              <OrdersCard
                key={i}
                name={order.name}
                ordeId={order.order_id}
                date={order.date}
                customerName={order.customer_name}
                HeaderStatus={
                  <StyledView className="flex-row justify-end flex-1 h-full">
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#EDF5EE',
                        borderColor: theme.colors.grey1,
                        borderWidth: 0.5,
                        borderRadius: 15,
                        height: 31,
                      }}
                      tw="justify-center items-center">
                      <StyledText h4 style={{color: theme.colors.primary}}>
                        Cancelled
                      </StyledText>
                    </TouchableOpacity>
                  </StyledView>
                }
                FooterButtons={
                  <StyledView className="flex-row gap-x-4">
                    <TrashSVG color={theme.colors.black} />
                  </StyledView>
                }
              />
            );
          })}
      </StyledView>
      <BottomSheet />
    </StyledPageView>
  );
};

export default Orders;
