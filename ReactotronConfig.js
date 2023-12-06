import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reactotronZustand from "reactotron-plugin-zustand";
import {useAccountStore} from "./src/state/account";
import {useLogStore} from "./src/state/log";
import { NativeModules } from "react-native";

let scriptHostname;

if(__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  scriptHostname = scriptURL.split('://')[1].split(':')[0];
}

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .useReactNative() // add all built-in react native plugins
  .use(
    reactotronZustand({
      stores: [
        {
          name: "account",
          zustand: useAccountStore,
        },
        {
          name: 'log',
          zustand: useLogStore,
        }
      ],
    }),
  )
  .configure({
    name: "flurry",
  }) // controls connection & communication settings
  .configure({host: scriptHostname})
  .connect(); // let's connect!
