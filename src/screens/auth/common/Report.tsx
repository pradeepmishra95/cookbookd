import {StyledButton, StyledPageView, StyledView} from '@/components';
import toastMessages from '@/constants/toastMessages';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {showToast} from '@/utils/Toaster';
import useCustomForm from '@/utils/useCustomForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import {useCallback, useState} from 'react';

type ReportPropsType = NativeStackScreenProps<RootStackParamList, 'report'>;

interface initialStateI {
  loading: boolean;
}

const initialState: initialStateI = {
  loading: false,
};

const Report = ({route, navigation}: ReportPropsType) => {
  const [state, setState] = useState(initialState);
  const {Form, form, defaultValues} = useCustomForm(
    {description: ''},
    {description: {placeholder: 'Description'}},
  );
  const handleSubmit = useCallback(async (formData: typeof defaultValues) => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request(
      'POST',
      urls.auth.common.report,
      {},
      {
        [route.params.type === 'post' ? 'post_id' : 'stream_id']:
          route.params.id,
        ...formData,
      },
    );
    if (status === HttpStatusCode.OK && data.success) {
      showToast(toastMessages.report.post);
      navigation.pop();
    }
    setState(prev => ({...prev, loading: false}));
  }, []);
  return (
    <StyledPageView
      header
      title={`Report ${route.params.type === 'post' ? 'Post' : 'Live Stream'}`}
      route={route}
      navigation={navigation}>
      <StyledView tw="flex-1 justify-start w-full">
        <Form />
      </StyledView>
      <StyledButton
        loading={state.loading}
        disabled={state.loading}
        twContainer={'w-full'}
        onPress={form.handleSubmit(handleSubmit)}
        title={'Report'}
      />
    </StyledPageView>
  );
};

export default Report;
