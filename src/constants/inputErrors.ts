import {LiteralUnion, RegisterOptions} from 'react-hook-form';

const inputErrors: Partial<
  Record<LiteralUnion<keyof RegisterOptions, string>, string>
> = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  password: 'Please enter a valid password.',
  confirmPassword: 'Passwords do not match',
  doesNotMatch: 'The input fields does not match.',
};

export default inputErrors;
