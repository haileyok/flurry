import { useCallback, useState } from 'react';
import { IServiceType } from '@src/api/types';
import { IValidationResult } from '@src/types/IValidationResult';
import {
  emailRegex,
  hostRegex,
  usernameRegex,
} from '@src/lib/regex/commonRegex';
import { Alert } from 'react-native';

interface Form {
  serviceType: IServiceType;
  host: string;
  username: string;
  email: string;
  password: string;
  inviteCode: string;
}

interface UseCreateAccount {
  form: Form;
  onInputChange: (value: string, name: string) => void;
  onSubmit: () => void;
}

export const useCreateAccount = (): UseCreateAccount => {
  const [form, setForm] = useState<Form>({
    serviceType: 'masto',
    host: '',
    username: '',
    email: '',
    password: '',
    inviteCode: '',
  });

  const onInputChange = useCallback((value: string, name: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  const onSubmit = (): void => {
    const result = validate(form);

    if (!result.isValid) {
      Alert.alert('Error', result.message);
    }
  };

  return {
    form,
    onInputChange,
    onSubmit,
  };
};

const validate = (form: Form): IValidationResult => {
  const { serviceType, host, username, email, inviteCode, password } = form;

  // eslint-disable-next-line
  if (!host || !username || !email || !password || (serviceType === 'bsky' && !inviteCode)) {
    return {
      isValid: false,
      message: 'All fields are required.',
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters.',
    };
  }

  if (host.includes('://')) {
    return {
      isValid: false,
      message: 'Host must not include protocol.',
    };
  }

  if (!hostRegex.test(host)) {
    return {
      isValid: false,
      message: 'Host is invalid.',
    };
  }

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username must only contain letters, numbers, and underscores.',
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Email is invalid.',
    };
  }

  return {
    isValid: true,
  };
};
