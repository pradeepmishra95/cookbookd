import { StyledButton, StyledPageView, StyledView } from '@/components';
import { SelectOptions } from '@/components/Select';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import useCustomForm from '@/utils/useCustomForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgressFooter } from '../../Onboarding/CompleteProfile';

export type BankDetails = {
  id: string;
  bank_holder_name: string;
  account_type: string;
  bank_name: string;
  bank_number: string;
  transit_number: string;
  account_number: string;
  routing_number: string;
  social_secuirity_number: string;
  date_of_birth: string;
  address_line_1: string;
  address_line_2: string;
  state: string;
  city: string;
  zipcode: string;
  phone_number: string;
  id_front: string;
  id_back: string;
};

type BankDetailsUpdatePropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_bank_details_update'
>;

interface initialStateI {
  state: {
    options: SelectOptions[];
    loading: boolean;
  };
  city: {
    options: SelectOptions[];
    loading: boolean;
  };
  account_type: {
    options: SelectOptions[];
    loading: boolean;
  };
  loading: boolean;
}

const initialState: initialStateI = {
  account_type: {options: [], loading: false},
  state: {options: [], loading: false},
  city: {options: [], loading: false},
  loading: false,
};

const BankDetailsUpdate = ({route, navigation}: BankDetailsUpdatePropsType) => {
  const [state, setState] = useState(initialState);
  const showProgressFooter = useMemo(
    () => route.params.showProgressFooter ?? false,
    [],
  );
  const isUpdating = useMemo(
    () => typeof route.params?.id !== 'undefined',
    [route.params],
  );
  const {form, Form, defaultValues} = useCustomForm(
    {
      bank_holder_name: '',
      account_type: '',
      bank_name: '',
      bank_number: '',
      transit_number: '',
      account_number: '',
      routing_number: '',
      social_secuirity_number: '',
      date_of_birth: '',
      address_line_1: '',
      address_line_2: '',
      state: '',
      city: '',
      zipcode: '',
      phone_number: '',
    },
    {
      bank_holder_name: {
        placeholder: 'Account Holder Name',
        rules: {required: true},
      },
      account_type: {
        placeholder: 'Account Type',
        rules: {required: true},
        type: 'select',
        options: state.account_type.options,
        selectProps: {loading: state.account_type.loading},
      },
      bank_name: {placeholder: 'Bank Name', rules: {required: true}},
      bank_number: {placeholder: 'Bank Number', rules: {required: true}},
      transit_number: {placeholder: 'Transit Number', rules: {required: true}},
      account_number: {placeholder: 'Account Number', rules: {required: true}},
      routing_number: {placeholder: 'Routing Number', rules: {required: true}},
      social_secuirity_number: {
        placeholder: 'Social Security Number',
        rules: {required: true},
      },
      date_of_birth: {placeholder: 'DOB', rules: {required: true}},
      address_line_1: {placeholder: 'Address Line 1', rules: {required: true}},
      address_line_2: {placeholder: 'Address Line 2', rules: {required: true}},
      state: {
        placeholder: 'State',
        rules: {required: true},
        type: 'select',
        options: state.state.options,
        selectProps: {
          loading: state.state.loading,
          search: true,
          setSelected: item => fetchCities(item),
        },
      },
      city: {
        placeholder: 'City',
        rules: {required: true},
        type: 'select',
        options: state.city.options,
        selectProps: {loading: state.city.loading, search: true},
      },
      zipcode: {placeholder: 'Zip Code', rules: {required: true}},
      phone_number: {placeholder: 'Phone Number', rules: {required: true}},
    },
    [state.account_type, state.city, state.state],
  );

  const onSubmit = async (formData: typeof defaultValues) => {
    setState(prev => ({...prev, loading: true}));
    const {data, status, HttpStatusCode} = await request<string>(
      'POST',
      urls.auth.chef.bank_account.add,
      {},
      formData,
    );
    if (status === HttpStatusCode.OK && data.success) {
      if (showProgressFooter)
        navigation.navigate('chef_bottom_tab', {screen: 'home'});
      else navigation.goBack();
    }
    setState(prev => ({...prev, loading: false}));
  };

  const fetchStates = useCallback(async () => {
    form.resetField('state');

    setState(prev => ({...prev, state: {...prev.state, loading: true}}));
    const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
      'GET',
      `${urls.auth.common.constants.states}`,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({
        ...prev,
        state: {...prev.state, options: data.data},
      }));
    }
    setState(prev => ({...prev, state: {...prev.state, loading: false}}));
  }, []);

  const fetchCities = useCallback(async (state: string | null) => {
    form.resetField('city');
    console.log({state});
    if (state) {
      setState(prev => ({...prev, city: {...prev.city, loading: true}}));
      const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
        'GET',
        `${urls.auth.common.constants.city}/${state}`,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          city: {...prev.city, options: data.data},
        }));
      }
      setState(prev => ({...prev, city: {...prev.city, loading: false}}));
    }
  }, []);

  useEffect(() => {
    fetchStates();
    (async () => {
      setState(prev => ({
        ...prev,
        account_type: {...prev.account_type, loading: true},
      }));
      const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
        'GET',
        urls.auth.common.constants.account_type,
      );
      if (status === HttpStatusCode.OK && data.success) {
        setState(prev => ({
          ...prev,
          account_type: {...prev.account_type, options: data.data},
        }));
      }
      setState(prev => ({
        ...prev,
        account_type: {...prev.account_type, loading: false},
      }));
    })();
  }, []);

  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      twScrollView={'justify-start pt-2'}
      title="Add Bank Account"
      footerComponent={
        showProgressFooter ? (
          <ProgressFooter
            total={4}
            current={4}
            label="Finish"
            loading={state.loading}
            disabled={state.loading}
            // onPress={form.handleSubmit(onSubmit)}
            onPress={() =>
              navigation.navigate('chef_bottom_tab', {screen: 'home'})
            }
          />
        ) : (
          <></>
        )
      }>
      <Form />
      {!showProgressFooter && (
        <StyledView tw="w-full">
          <StyledButton
            title={isUpdating ? 'Update' : 'Submit'}
            onPress={form.handleSubmit(onSubmit)}
          />
        </StyledView>
      )}
    </StyledPageView>
  );
};

export default BankDetailsUpdate;
