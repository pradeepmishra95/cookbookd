import GpsSVG from '@/assets/icons/custom/GpsSVG';
import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import {SelectOptions} from '@/components/Select';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {cacheAddressesAtAppStart} from '@/utils/cache';
import {checkLocationPermission} from '@/utils/location';
import useCustomForm from '@/utils/useCustomForm';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {AddressType} from './AddressManagement';

type AddressUpdatePropsType = NativeStackScreenProps<
  RootStackParamList,
  'address_update'
>;

type initialStateI = {
  country: {
    options: SelectOptions[];
    loading: boolean;
  };
  state: {
    options: SelectOptions[];
    loading: boolean;
  };
  loading: boolean;
  pageLoading: boolean;
};

const initialState: initialStateI = {
  country: {
    options: [],
    loading: false,
  },
  state: {
    options: [],
    loading: false,
  },
  loading: false,
  pageLoading: true,
};

const AddressUpdate = ({route, navigation}: AddressUpdatePropsType) => {
  const {theme} = useTheme();
  const [state, setState] = useState(initialState);
  const mode = useMemo(() => {
    switch (typeof route.params?.id) {
      case 'undefined':
        return 'add';
      case 'number':
        return route.params.id === -1 ? 'add_prefill' : 'update';
      default:
        return 'add';
    }
  }, [route.params]);

  const {form, Form, defaultValues} = useCustomForm(
    {
      country: '',
      state: '',
      address_name: '',
      city: '',
      flat_block: '',
      apartment_street_area: '',
      zipcode: '',
    },
    {
      country: {
        rules: {required: true},
        type: 'select',
        placeholder: 'Country',
        options: state.country.options,
        selectProps: {
          loading: state.country.loading,
          search: true,
          disabled: state.country.loading,
          setSelected: item => {
            fetchStates(item);
          },
        },
      },
      state: {
        rules: {required: true},
        type: 'select',
        placeholder: 'State',
        options: state.state.options,
        selectProps: {
          loading: state.state.loading,
          search: true,
          disabled: state.state.loading || state.country.loading,
        },
      },
      address_name: {
        rules: {required: true},
        placeholder: 'Address Name',
      },
      city: {
        rules: {required: true},
        placeholder: 'City',
      },
      flat_block: {
        rules: {required: true},
        placeholder: 'Flat/Block',
      },
      apartment_street_area: {
        rules: {required: true},
        placeholder: 'Apartment/Street/Area',
      },
      zipcode: {
        rules: {required: true},
        placeholder: 'ZIP Code',
      },
    },
    [state],
  );

  const onSubmit = useCallback(
    async (formData: typeof defaultValues) => {
      setState(prev => ({...prev, loading: true}));
      const {data, status, HttpStatusCode} = await request(
        mode === 'update' ? 'PUT' : 'POST',
        mode === 'update'
          ? `${urls.auth.common.address.update}/${route.params?.id}`
          : Config.USER_TYPE === 'chef'
          ? urls.auth.common.address.chef.add
          : urls.auth.common.address.customer.add,
        {},
        mode === 'update'
          ? {...route.params, ...formData}
          : [{...route.params, ...formData}],
      );
      if (status === HttpStatusCode.OK && data.success) {
        navigation.pop(2);
        cacheAddressesAtAppStart();
      }
      setState(prev => ({...prev, loading: false}));
    },
    [mode],
  );

  const handlePreFillData = useCallback(
    (data: AddressType) => {
      form.reset();
      form.setValue('city', data.city ?? '');
      form.setValue('flat_block', data.flat_block ?? '');
      form.setValue('apartment_street_area', data.apartment_street_area ?? '');
      form.setValue('zipcode', data.zipcode ?? '');
      console.log('state', state.country);

      let country = state.country.options.find(
        item => item.label === data.country,
      );

      if (country) {
        form.setValue('country', country.value);
        fetchStates(country.value, data.state);
      }
    },
    [state.country.options],
  );

  const fetchAddress = useCallback(
    async (latitude: number, longitude: number) => {
      if (state.country.options.length === 0) {
        const result = await fetchCounties();
        if (result.length === 0) {
          setState(prev => ({...prev, pageLoading: false}));
          return;
        }
        state.country.options = result;
      }
      const {data, status, HttpStatusCode} = await request<AddressType>(
        'POST',
        urls.auth.common.address.address_from_coordinates,
        {},
        {latitude, longitude},
      );
      if (status === HttpStatusCode.OK && data.success) {
        handlePreFillData(data.data);
      }
      setState(prev => ({...prev, pageLoading: false}));
    },
    [state.country.options],
  );

  const getCurrentLocation = useCallback(async () => {
    setState(prev => ({...prev, pageLoading: true}));
    if (!(await checkLocationPermission())) {
      Geolocation.requestAuthorization(
        () =>
          Geolocation.getCurrentPosition(position =>
            fetchAddress(position.coords.latitude, position.coords.longitude),
          ),
        // TODO add not allowed alert
      );
      return;
    }

    Geolocation.getCurrentPosition(position =>
      fetchAddress(position.coords.latitude, position.coords.longitude),
    );
  }, []);

  const fetchCounties = useCallback(async (key?: keyof SelectOptions) => {
    let response: Promise<SelectOptions[]>;
    setState(prev => ({...prev, country: {...prev.country, loading: true}}));
    const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
      'GET',
      urls.auth.common.constants.country,
    );
    if (status === HttpStatusCode.OK && data.success) {
      setState(prev => ({
        ...prev,
        country: {...prev.country, options: data.data},
        state: initialState.state,
      }));
      if (mode === 'update') {
        form.setValue('country', route.params?.country ?? '');
        fetchStates(
          route.params?.country ?? '',
          route.params?.state ?? '',
          'value',
        );
      }
      response = Promise.resolve(data.data);
    } else {
      response = Promise.resolve([]);
    }
    setState(prev => ({...prev, country: {...prev.country, loading: false}}));
    return response;
  }, []);

  useEffect(() => {
    console.log({mode});

    if (mode === 'update') {
      form.setValue('address_name', route.params?.address_name ?? '');
      form.setValue(
        'apartment_street_area',
        route.params?.apartment_street_area ?? '',
      );
      form.setValue('city', route.params?.city ?? '');
      form.setValue('flat_block', route.params?.flat_block ?? '');
      form.setValue('zipcode', route.params?.zipcode ?? '');
    }
    if (mode === 'add_prefill') {
      (async () => {
        const result = await fetchCounties();
        if (result.length === 0) {
          setState(prev => ({...prev, pageLoading: false}));
          return;
        }
        state.country.options = result;
        console.log('preefilling');
        if (route.params) handlePreFillData(route.params);
      })();
    }
    fetchCounties();
    setState(prev => ({...prev, pageLoading: false}));
  }, []);

  const fetchStates = useCallback(
    async (
      country: string | null,
      value?: string,
      key?: keyof SelectOptions,
    ) => {
      form.resetField('state');
      if (country) {
        setState(prev => ({...prev, state: {...prev.state, loading: true}}));
        const {data, status, HttpStatusCode} = await request<SelectOptions[]>(
          'GET',
          `${urls.auth.common.constants.states}/${country}`,
        );
        if (status === HttpStatusCode.OK && data.success) {
          setState(prev => ({
            ...prev,
            state: {...prev.state, options: data.data},
          }));
          if (value) {
            let geolocationState = data.data.find(
              item => item[key ?? 'label'] === value,
            );
            if (geolocationState)
              form.setValue('state', geolocationState.value);
            console.log({geolocationState});
          }
        }
        setState(prev => ({...prev, state: {...prev.state, loading: false}}));
      }
    },
    [],
  );

  return (
    <StyledPageView
      header
      title={mode === 'update' ? 'Edit Address' : 'Add Address'}
      route={route}
      navigation={navigation}
      twScrollView="justify-start pt-4"
      loading={state.pageLoading}>
      <StyledView tw="w-full flex-1">
        <Form loading={state.loading} />
        <TouchableOpacity
          onPress={getCurrentLocation}
          activeOpacity={0.8}
          tw="flex-row justify-center items-center gap-x-2 p-4">
          <GpsSVG />
          <StyledText
            h4
            tw="text-center"
            h4Style={{color: theme.colors.primary}}>
            Use My Current Location
          </StyledText>
        </TouchableOpacity>
      </StyledView>

      <StyledButton
        loading={state.loading}
        disabled={state.loading}
        onPress={form.handleSubmit(onSubmit)}
        twContainer="my-2 w-full">
        {mode === 'update' ? 'Update' : 'Add'}
      </StyledButton>
    </StyledPageView>
  );
};

export default AddressUpdate;
