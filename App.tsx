import React from 'react';
import '@src/lib/polyfill';
import 'react-native-reanimated';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  TamaguiInternalConfig,
  TamaguiProvider,
  Text,
  Theme,
  useTheme,
} from 'tamagui';
import { ErrorBoundary } from 'react-error-boundary';
import { useFonts } from 'expo-font';
import tamaguiConfig from './tamagui.config';

import * as SplashScreen from 'expo-splash-screen';
import Stack from '@src/components/Stack/Stack';
import { useNavigationTheme } from '@src/hooks/useNavigationTheme';
import LoadingOverlay from '@src/components/Common/Loading/LoadingOverlay';
import {
  setDrawerOpen,
  useAppLoading,
  useLeftDrawerOpen,
  useRightDrawerOpen,
} from '@src/state/app';
import { enableMapSet } from 'immer';
import { StatusBar } from 'expo-status-bar';
import { enableFreeze } from 'react-native-screens';
import { ImageViewerProvider } from '@src/lib/imageViewer';
import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import {
  useHandleTheme,
  useNotificationListeners,
  useNotificationsPoll,
} from '@src/hooks';
import { writeError } from '@src/state/log';
import { MainStackParamList } from '@src/types/navigation/MainStackParamList';
import LeftDrawer from '@src/components/Drawers/LeftDrawer';
import RightDrawer from '@src/components/Drawers/RightDrawer';
import { Client } from '@src/api/Client';
import { QueryClient } from '@tanstack/react-query/build/modern/index';
import { QueryClientProvider } from '@tanstack/react-query';
import { Drawer } from 'react-native-drawer-layout';
import { StyleSheet } from 'react-native';

enableMapSet();

if (__DEV__) {
  require('./ReactotronConfig');
}

void SplashScreen.preventAutoHideAsync();

const NavigationRefContext =
  React.createContext<NavigationContainerRefWithCurrent<MainStackParamList> | null>(
    null,
  );

export const useNavigationRef =
  (): NavigationContainerRefWithCurrent<ReactNavigation.RootParamList> | null =>
    React.useContext(NavigationRefContext);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const client = new Client(queryClient);

const ClientContext = React.createContext<Client>({} as Client);
export const useClient = (): Client => React.useContext(ClientContext);

export default function App(): React.JSX.Element | null {
  enableFreeze(true);

  const theme = useHandleTheme();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    InterSemiBold: require('@tamagui/font-inter/otf/Inter-SemiBold.otf'),
  });

  if (!loaded) return null;

  void SplashScreen.hideAsync();

  return (
    <TamaguiProvider config={tamaguiConfig as TamaguiInternalConfig}>
      <Theme name={theme}>
        <QueryClientProvider client={queryClient}>
          <ClientContext.Provider value={client}>
            <StepTwo />
          </ClientContext.Provider>
        </QueryClientProvider>
      </Theme>
    </TamaguiProvider>
  );
}

function StepTwo(): React.JSX.Element {
  const navTheme = useNavigationTheme();
  const theme = useTheme();

  const isLoading = useAppLoading();

  const navRef =
    useNavigationContainerRef() as unknown as NavigationContainerRefWithCurrent<MainStackParamList>;

  useNotificationListeners(navRef);

  // Get the drawer status
  const leftDrawerOpen = useLeftDrawerOpen();
  const rightDrawerOpen = useRightDrawerOpen();

  useNotificationsPoll(client);

  return (
    <ErrorBoundary
      onError={(e) => {
        writeError(`[${e.name}] ${e.message}\n\n${e.stack ?? 'Stack Undef'}`);
      }}
      fallback={<Text>Error!</Text>}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ImageViewerProvider>
          <LoadingOverlay visible={isLoading} />
          <StatusBar style={theme.statusBar.val as 'light' | 'dark'} />

          <NavigationRefContext.Provider value={navRef}>
            <Drawer
              open={leftDrawerOpen}
              onOpen={() => setDrawerOpen('left', true)}
              onClose={() => setDrawerOpen('left', false)}
              renderDrawerContent={() => <LeftDrawer />}
              drawerStyle={styles.leftDrawerContainer}
              drawerType="slide"
            >
              <Drawer
                open={rightDrawerOpen}
                onOpen={() => setDrawerOpen('right', true)}
                onClose={() => setDrawerOpen('right', false)}
                renderDrawerContent={() => <RightDrawer />}
                drawerStyle={styles.rightDrawerContainer}
                drawerPosition="right"
                drawerType="slide"
              >
                <NavigationContainer theme={navTheme} ref={navRef}>
                  <Stack />
                </NavigationContainer>
              </Drawer>
            </Drawer>
          </NavigationRefContext.Provider>
        </ImageViewerProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  leftDrawerContainer: {
    flex: 1,
    width: '70%',
  },

  rightDrawerContainer: {
    right: 0,
    flex: 1,
    width: '70%',
  },
});
