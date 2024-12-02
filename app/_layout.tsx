import { Stack } from 'expo-router'
import React from 'react'
import "@/global.css";
import { PaperProvider } from 'react-native-paper';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    secondary: 'yellow',
  },
};

function layout() {
  return (
    <GluestackUIProvider mode="light" >
    <PaperProvider theme={theme}>
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: true,headerTitle:'Biznes360 Lite' }} />
        
    </Stack>
    </PaperProvider>
    </GluestackUIProvider>
    
  )
}

export default layout