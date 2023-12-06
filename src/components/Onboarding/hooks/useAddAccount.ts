import { useCallback, useState } from 'react';
import { IServiceType } from '@src/api/types';
import { IValidationResult } from '@src/types/IValidationResult';
import { hostRegex, usernameRegex } from '@src/lib/regex/commonRegex';
import { Alert } from 'react-native';
import { setAppLoading } from '@src/state/app';
import { Client } from '@src/api/Client';
import { useNav } from '@src/hooks';

interface Form {
  serviceType: IServiceType;
  host: string;
  username: string;
  password: string;
}

interface UseAddAccount {
  form: Form;
  onInputChange: (value: string, name: string) => void;
  onSubmit: () => void;
}

export const useAddAccount = (basic = false): UseAddAccount => {
  const client = new Client();

  const navigation = useNav();

  const [form, setForm] = useState<Form>({
    serviceType: 'masto',
    host: '',
    username: '',
    password: '',
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
      return;
    }

    if (form.serviceType === 'masto') {
      // TODO Implement
    } else {
      void onBskySubmit();
    }
  };

  const onBskySubmit = async (): Promise<void> => {
    setAppLoading(true);

    // Make sure that the handle includes the host
    const handleWithHost = form.username.includes('.')
      ? form.username
      : `${form.username}.${form.host}`;

    try {
      await client.initialize({
        host: form.host,
        handle: handleWithHost,
        serviceType: form.serviceType,
      });

      await client.login({
        handle: form.username,
        password: form.password,
      });
    } finally {
      setAppLoading(false);
      navigation.pop();
    }
  };

  return {
    form,
    onInputChange,
    onSubmit,
  };
};

const validate = (form: Form): IValidationResult => {
  const { serviceType, host, username, password } = form;

  // eslint-disable-next-line
  if (!host || (serviceType === 'bsky' && (!username || !password))) {
    return {
      isValid: false,
      message: 'All fields are required.',
    };
  }

  if (serviceType === 'masto') {
    return {
      isValid: true,
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

  return {
    isValid: true,
  };
};
