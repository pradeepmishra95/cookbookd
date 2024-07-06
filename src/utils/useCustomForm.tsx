import {StyledInput, StyledText, StyledView} from '@/components';
import Select, {SelectOptions, SelectPropsType} from '@/components/Select';
import inputErrors from '@/constants/inputErrors';
import {InputProps} from '@rneui/base';
import {useTheme} from '@rneui/themed';
import {useCallback} from 'react';
import {
  Controller,
  DefaultValues,
  Path,
  RegisterOptions,
  useForm,
} from 'react-hook-form';

type InputConfigOptions = {
  type?: 'numeric' | 'email' | 'text';
  inputProps?: Omit<InputProps, 'placeholder'>;
  showCount?: boolean;
  options?: never;
  selectProps?: never;
};

type SelectConfigOptions = {
  type: 'select';
  selectProps?: Partial<
    Omit<SelectPropsType, 'placeholder' | 'selected' | 'options'>
  >;
  options: SelectOptions[];
  inputProps?: never;
  showCount?: never;
};

type ConfigOptions = InputConfigOptions | SelectConfigOptions;

type FormConfigOptions = {
  rules?: RegisterOptions;
  placeholder?: string;
  type?: 'numeric' | 'email' | 'text' | 'select';
} & ConfigOptions;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type FormProps = {
  loading?: boolean;
};

const useCustomForm = <T, K extends PartialRecord<string, string>>(
  defaultValues: DefaultValues<K>,
  config: PartialRecord<keyof K, FormConfigOptions> | undefined = undefined,
  dependency: React.DependencyList = [],
) => {
  const form = useForm({
    defaultValues: defaultValues,
  });
  const Form = useCallback(({loading}: FormProps) => {
    const {
      control,
      formState: {errors},
    } = form;

    const {theme} = useTheme();
    return (
      <>
        {Object.keys(defaultValues).map((formItem, i) => (
          <StyledView tw="w-full mb-2" key={`form-item-${i}`}>
            <Controller
              control={control}
              rules={config ? config[formItem]?.rules : undefined}
              render={({field: {onChange, onBlur, value}}) => {
                const fieldConfig =
                  config && config[formItem] ? config[formItem] ?? null : null;

                switch (fieldConfig ? fieldConfig.type : 'text') {
                  case 'select':
                    return (
                      <Select
                        {...(fieldConfig ? fieldConfig.selectProps : {})}
                        selected={value}
                        setSelected={
                          fieldConfig?.selectProps?.setSelected
                            ? item => {
                                (
                                  fieldConfig?.selectProps?.setSelected ??
                                  function () {}
                                )(item);
                                onChange(item);
                              }
                            : onChange
                        }
                        options={
                          fieldConfig?.options ? fieldConfig.options : []
                        }
                        disabled={
                          loading ||
                          (fieldConfig?.selectProps?.disabled ?? false)
                        }
                        placeholder={fieldConfig?.placeholder}
                        errorMessage={
                          inputErrors[errors[formItem]?.type as string]
                        }
                      />
                    );
                  default:
                    return (
                      <>
                        <StyledInput
                          {...(fieldConfig ? fieldConfig.inputProps : {})}
                          onBlur={onBlur}
                          errorMessage={
                            inputErrors[errors[formItem]?.type as string] ?? ''
                          }
                          onChangeText={text => {
                            if (fieldConfig) {
                              switch (fieldConfig.type) {
                                case 'numeric':
                                  text = text.replace(/[^0-9]/g, '');
                                  break;
                                default:
                                  break;
                              }
                            }
                            onChange(text);
                          }}
                          disabled={
                            loading ||
                            (fieldConfig?.inputProps?.disabled ?? false)
                          }
                          value={value ?? ''}
                          placeholder={
                            fieldConfig ? fieldConfig.placeholder : ''
                          }
                          containerStyle={[
                            {
                              paddingHorizontal: 0,
                              paddingVertical: 0,
                            },
                            fieldConfig
                              ? fieldConfig.inputProps?.containerStyle
                              : {},
                          ]}
                          inputContainerStyle={[
                            {paddingHorizontal: 5},
                            fieldConfig
                              ? fieldConfig.inputProps?.inputContainerStyle
                              : {},
                            errors[formItem]
                              ? {
                                  borderColor: theme.colors.primary,
                                  borderWidth: 1,
                                  borderBottomWidth: 1,
                                }
                              : {
                                  borderColor: 'transparent',
                                  borderWidth: 1,
                                  borderBottomWidth: 1,
                                },
                          ]}
                        />
                        {fieldConfig?.showCount === true ? (
                          <StyledText
                            tw="text-right absolute bottom-0 right-0"
                            style={{
                              color: theme.colors.lightText,
                              fontSize: 12,
                              fontFamily: 'Manrope-SemiBold',
                              fontWeight: '600',
                              marginRight: 6,
                            }}>
                            {value?.length}
                            {typeof fieldConfig.inputProps?.maxLength ===
                            'number'
                              ? `/${fieldConfig.inputProps?.maxLength}`
                              : null}
                          </StyledText>
                        ) : null}
                      </>
                    );
                }
              }}
              name={formItem as Path<K>}
            />
          </StyledView>
        ))}
      </>
    );
  }, dependency);

  return {Form, form, defaultValues};
};

export default useCustomForm;
