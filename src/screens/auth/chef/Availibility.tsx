import {
  StyledButton,
  StyledPageView,
  StyledText,
  StyledView,
} from '@/components';
import StyledBottomSheet from '@/components/BottomSheet';
import Checkbox from '@/components/Checkbox';
import urls from '@/constants/urls';
import request from '@/services/api/request';
import {showToast} from '@/utils/Toaster';
import getOrdinalNumber from '@/utils/ordinalNumber';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@rneui/themed';
import {RootStackParamList} from 'App';
import dayjs from 'dayjs';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {ProgressFooter} from './Onboarding/CompleteProfile';

type AvailibilityPropsType = NativeStackScreenProps<
  RootStackParamList,
  'chef_availability'
>;

export enum WeekDays {
  'Monday' = 'monday',
  'Tuesday' = 'tuesday',
  'Wednesday' = 'wednesday',
  'Thursday' = 'thursday',
  'Friday' = 'friday',
  'Saturday' = 'saturday',
  'Sunday' = 'sunday',
}

type initialStateI = {
  [key in WeekDays]: {
    checked: boolean;
    timings: {from: Date | null; to: Date | null}[];
  };
} & {
  selected: {
    value: WeekDays | null;
    type: 'from' | 'to' | null;
    index: number;
  };
  loading: boolean;
  dataLoading: boolean;
};

export type AvailabilityType = {
  [key in WeekDays]: {
    from: string;
    to: string;
  }[];
};

const initialState: initialStateI = Object.values(WeekDays).reduce(
  (prevValue, value) => ({
    ...prevValue,
    [value as WeekDays]: {
      checked: false,
      timings: [{from: null, to: null}],
    },
  }),
  {
    selected: {value: null, type: null, index: -1},
    loading: false,
    dataLoading: false,
  } as unknown as initialStateI,
);

const Availibality = ({route, navigation}: AvailibilityPropsType) => {
  const [state, setState] = useState(initialState);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();

  const timingsAction = useCallback(
    ({
      value,
      index,
    }:
      | {value: WeekDays; index?: undefined}
      | {value: WeekDays; index: number}) => {
      if (typeof index === 'number') {
        setState(prev => {
          let prevValue = Object.assign({}, prev);
          if (prevValue[value ?? 'monday'].timings.length > 0)
            prevValue[value ?? 'monday'].timings.splice(index, 1);

          return {
            ...prev,
            [value ?? 'monday']: {
              ...prev[value ?? 'monday'],
              timings: prevValue[value ?? 'monday'].timings,
            },
          };
        });
      } else {
        setState(prev => {
          let prevValue = Object.assign({}, prev);
          prevValue[value ?? 'monday'].timings.push({
            from: null,
            to: null,
          });
          return {
            ...prev,
            [value ?? 'monday']: {
              ...prev[value ?? 'monday'],
              timings: prevValue[value ?? 'monday'].timings,
            },
          };
        });
      }
    },
    [],
  );

  const onChange = useCallback(
    (
      value: WeekDays | null,
      type: 'from' | 'to' | null,
      index: number,
      date: Date | undefined,
    ) => {
      setState(prev => {
        let prevValue = Object.assign({}, prev);
        prevValue[value ?? 'monday'].timings[index][type ?? 'from'] =
          date ?? null;
        return {
          ...prev,
          selected:
            Platform.OS === 'android' ? initialState.selected : prev.selected,
          [value ?? 'monday']: {
            ...prev[value ?? 'monday'],
            timings: prevValue[value ?? 'monday'].timings,
          },
        };
      });
    },
    [],
  );

  const handleTimeChange = useCallback(
    (value: WeekDays, index: number, type: 'from' | 'to') => {
      if (Platform.OS !== 'android') {
        setState(prev => ({...prev, selected: {value, type, index}}));
        bottomSheetRef.current?.present();
      } else {
        DateTimePickerAndroid.open({
          mode: 'time',
          value: state[value].timings[index][type] ?? new Date(),
          onChange: (_, date) => onChange(value, type, index, date),
        });
      }
    },
    [state],
  );

  const onSubmit = async () => {
    setState(prev => ({...prev, loading: true}));
    const formData: {[key in WeekDays]?: {from: string; to: string}[]} = {};
    for (let [key, value] of Object.entries(WeekDays)) {
      if (state[value].checked) {
        for (let index in state[value].timings) {
          if (
            !state[value].timings[index].from ||
            !state[value].timings[index].to
          ) {
            setState(prev => ({...prev, loading: false}));
            showToast({
              message: 'Incomplete Availability',
              description: `Please complete the availability of ${getOrdinalNumber(
                Number.parseInt(index) + 1,
              )} shift of ${key} or deselect it`,
              type: 'error',
            });

            return;
          } else {
            formData[value] = state[value].timings.map(item => ({
              from: dayjs(item.from).format('hh:mm A'),
              to: dayjs(item.to).format('hh:mm A'),
            }));
          }
        }
      }
    }
    const {data, status, HttpStatusCode} = await request(
      'POST',
      urls.auth.chef.availability.add,
      {},
      formData,
    );
    setState(prev => ({...prev, loading: false}));
    if (status === HttpStatusCode.OK && data.success) {
      if (route.params?.mode === 'page') navigation.goBack();
      else navigation.replace('chef_menu_management');
    }
  };

  useEffect(() => {
    (async () => {
      setState(prev => ({...prev, dataLoading: true}));
      const {data, status, HttpStatusCode} = await request<AvailabilityType>(
        'GET',
        urls.auth.chef.availability.get,
      );
      if (status === HttpStatusCode.OK && data.success) {
        const formattedData = Object.keys(data.data).reduce(
          (prevValue, value) => ({
            ...prevValue,
            [value as WeekDays]: {
              checked: true,
              timings: data.data[value as WeekDays].map(each => ({
                from: dayjs(each.from, 'hh:mm A').isValid()
                  ? dayjs(each.from, 'hh:mm A').toDate()
                  : null,
                to: dayjs(each.to, 'hh:mm A').isValid()
                  ? dayjs(each.to, 'hh:mm A').toDate()
                  : null,
              })),
            },
          }),
          {} as unknown as initialStateI,
        );

        setState(prev => ({
          ...prev,
          ...formattedData,
        }));
      }
      setState(prev => ({...prev, dataLoading: false}));
    })();
  }, []);

  return (
    <StyledPageView
      header
      route={route}
      navigation={navigation}
      title={route.params?.title ?? 'Your Availability'}
      twScrollView={'justify-start'}
      loading={state.dataLoading}
      footerComponent={
        route.params?.mode !== 'page' && (
          <ProgressFooter
            total={4}
            current={2}
            onPress={onSubmit}
            loading={state.loading}
            disabled={state.loading}
          />
        )
      }>
      <StyledView tw="flex-1">
        {Object.entries(WeekDays).map(([key, value]) => (
          <StyledView
            key={key}
            style={{gap: 10}}
            tw="w-full my-2 flex-row items-center">
            <Checkbox
              tw="flex-[0.9]"
              label={key}
              disabled={state.loading}
              status={state[value].checked}
              toggleStatus={() =>
                setState(prev => ({
                  ...prev,
                  [value]: prev[value].checked
                    ? initialState[value]
                    : {...initialState[value], checked: true},
                }))
              }
            />
            <FeatherIcon
              name="plus-circle"
              size={18}
              disabled={
                !state[value].checked ||
                state[value].timings.length === 3 ||
                state.loading
              }
              onPress={() => timingsAction({value: value})}
              color={
                !state[value].checked || state[value].timings.length === 3
                  ? theme.colors.grey5
                  : theme.colors.black
              }
              style={{paddingHorizontal: 10, flex: 0.2}}
            />
            <StyledView tw="flex-[2]">
              {state[value].timings.map((item, index) => (
                <StyledView
                  key={`${value}-${index}`}
                  tw="flex-row mb-2 w-full items-center">
                  <StyledView
                    tw="flex-row flex-1 items-center"
                    style={{gap: 15}}>
                    <TouchableOpacity
                      disabled={!state[value].checked || state.loading}
                      style={{
                        borderColor: theme.colors.grey5,
                        borderWidth: 1,
                        borderRadius: 8,
                      }}
                      onPress={() => handleTimeChange(value, index, 'from')}
                      tw="flex-row  p-2 items-center justify-between flex-1">
                      {item.from ? (
                        <StyledText tw="text-center flex-1" h4>
                          {dayjs(item.from).format('hh:mm A')}
                        </StyledText>
                      ) : (
                        <>
                          <StyledText
                            h4
                            style={{
                              color: !state[value].checked
                                ? theme.colors.grey5
                                : theme.colors.black,
                            }}>
                            From
                          </StyledText>
                          <FeatherIcon
                            name="clock"
                            size={18}
                            color={
                              !state[value].checked
                                ? theme.colors.grey5
                                : theme.colors.black
                            }
                          />
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={!state[value].checked || state.loading}
                      tw="flex-row items-center  p-2 justify-between flex-1"
                      onPress={() => handleTimeChange(value, index, 'to')}
                      style={{
                        borderColor: theme.colors.grey5,
                        borderWidth: 1,
                        borderRadius: 8,
                      }}>
                      {item.to ? (
                        <StyledText tw="text-center flex-1" h4>
                          {dayjs(item.to).format('hh:mm A')}
                        </StyledText>
                      ) : (
                        <>
                          <StyledText
                            h4
                            style={{
                              color: !state[value].checked
                                ? theme.colors.grey5
                                : theme.colors.black,
                            }}>
                            To
                          </StyledText>
                          <FeatherIcon
                            name="clock"
                            size={18}
                            color={
                              !state[value].checked
                                ? theme.colors.grey5
                                : theme.colors.black
                            }
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </StyledView>

                  <FeatherIcon
                    name="x-circle"
                    size={18}
                    disabled={
                      !state[value].checked ||
                      state[value].timings.length === 1 ||
                      state.loading
                    }
                    onPress={() => timingsAction({value, index})}
                    color={
                      !state[value].checked || state[value].timings.length === 1
                        ? theme.colors.grey5
                        : theme.colors.black
                    }
                    style={{paddingLeft: 10}}
                  />
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        ))}
      </StyledView>
      {route.params?.mode === 'page' && (
        <StyledButton
          twContainer={'w-full my-2'}
          loading={state.loading}
          disabled={state.loading}
          onPress={onSubmit}
          title={'Update'}
        />
      )}

      {Platform.OS !== 'android' ? (
        <StyledBottomSheet
          bottomSheetRef={bottomSheetRef}
          index={0}
          snapPoints={['40%']}>
          <StyledView tw="flex-1 justify-center items-center">
            <DateTimePicker
              display="spinner"
              textColor={theme.colors.black}
              value={
                state.selected.value
                  ? state[state.selected.value ?? 'monday'].timings[
                      state.selected.index
                    ][state.selected.type ?? 'from'] ?? new Date()
                  : new Date()
              }
              onChange={(_, date) =>
                onChange(
                  state.selected.value,
                  state.selected.type,
                  state.selected.index,
                  date,
                )
              }
              mode="time"
            />
          </StyledView>
        </StyledBottomSheet>
      ) : null}
    </StyledPageView>
  );
};

export default Availibality;
