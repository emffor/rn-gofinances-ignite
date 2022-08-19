import React from 'react';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from './src/routes/app.routes';
import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/hook/auth';


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  //Boa pratica com AppLoading

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {/* <AppRoutes /> */}

        <AuthProvider>
          <SignIn />
        </AuthProvider>

      </NavigationContainer>
    </ThemeProvider>
  );
}


