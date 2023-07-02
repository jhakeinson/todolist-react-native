import { Stack } from "expo-router";
import {
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import store, { persistor } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as ReduxProvider } from "react-redux";
import { Provider } from "../lib/context/auth";

const themwe = {
  ...DefaultTheme,
  dark: true,
};

const RootLayout = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider>
          <PaperProvider 
            theme={themwe}
            // settings={{
            //   icon: (props) => <AntDesign />,
            // }}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationDuration: 250,
              }}
            />
          </PaperProvider>
        </Provider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default RootLayout;
