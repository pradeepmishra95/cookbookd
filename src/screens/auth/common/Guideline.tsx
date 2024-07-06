import {StyledPageView, StyledText, StyledView} from '@/components';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import React, {useEffect, useState} from 'react';
import Config from 'react-native-config';

type GuidelinesProps = NativeStackScreenProps<RootStackParamList, 'guideline'>;

type initialStateI = {
  pageTitle: string;
  pageContent: string;
  pageLoading: boolean;
};
const initialState: initialStateI = {
  pageTitle: '',
  pageContent: '',
  pageLoading: true,
};

interface ContentResponseI {
  page_title: string;
  page_content: string;
}
const Guideline = ({navigation, route}: GuidelinesProps) => {
  const [state, setState] = useState<initialStateI>(initialState);
  useEffect(() => {
    (async () => {
      const {data, status, HttpStatusCode} = await request<ContentResponseI[]>(
        'GET',
        Config.USER_TYPE === 'chef'
          ? urls.auth.chef.guidelines
          : urls.auth.customer.guidelines,
      );
      if (status === HttpStatusCode.OK && data.success) {
        if (data.data.length > 0) {
          setState(prev => ({
            ...prev,
            pageContent: data.data[0].page_content,
            pageTitle: data.data[0].page_title,
          }));
        }
      }
      setState(prev => ({...prev, pageLoading: false}));
    })();
  }, []);
  return (
    <StyledPageView
      header
      title="Guideline"
      twScrollView={'pt-5'}
      loading={state.pageLoading}
      navigation={navigation}
      route={route}>
      <StyledView tw="w-full flex-1 justify-start">
        <StyledText h2>{state.pageTitle}</StyledText>
        <StyledText h4>{state.pageContent}</StyledText>
      </StyledView>
    </StyledPageView>
  );
};

export default Guideline;
