import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Добавлено
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeProvider } from "./context/ThemeContext";

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import HomeScreen from './screens/HomeScreen';
import DictionaryScreen from './screens/DictionaryScreen';
import MediaScreen from './screens/MediaScreen';
import TestsScreen from './screens/TestsScreen';
import GrammarScreen from './screens/GrammarScreen';
import ProfileScreen from './screens/ProfileScreen';
import PartScreen from './screens/PartScreen';
import VideoScreen from './screens/LessonsinChemistry1/VideoScreen';
import Exercise1Screen from './screens/LessonsinChemistry1/Exercise1Screen';
import Exercise2Screen from './screens/LessonsinChemistry1/Exercise2Screen';
import Exercise3Screen from './screens/LessonsinChemistry1/Exercise3Screen';
import Exercise1Part2Screen from './screens/LessonsinChemistry1/Exercise1Part2Screen';
import Exercise2Part2Screen from './screens/LessonsinChemistry1/Exercise2Part2Screen';
import Exercise3Part2Screen from './screens/LessonsinChemistry1/Exercise3Part2Screen';
import Exercise1Part3Screen from './screens/LessonsinChemistry1/Exercise1Part3Screen';
import Exercise2Part3Screen from './screens/LessonsinChemistry1/Exercise2Part3Screen';
import Exercise3Part3Screen from './screens/LessonsinChemistry1/Exercise3Part3Screen';
import Exercise1Part4Screen from './screens/LessonsinChemistry1/Exercise1Part4Screen';
import Exercise2Part4Screen from './screens/LessonsinChemistry1/Exercise2Part4Screen';
import Exercise3Part4Screen from './screens/LessonsinChemistry1/Exercise3Part4Screen';

import { DictionaryProvider } from './mediadata/chemistry/DictionaryContext'; 
import DictionaryFolderScreen from './screens/DictionaryFolderScreen';
import ReviewScreen from './screens/ReviewScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#6C63FF',
          marginLeft: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Dictionary':
              iconName = 'book-open-page-variant';
              break;
            case 'Media':
              iconName = 'play-circle-outline';
              break;
            case 'Tests':
              iconName = 'checkbox-marked-circle-outline';
              break;
            case 'Grammar':
              iconName = 'file-document-outline';
              break;
            case 'Profile':
              iconName = 'account-circle-outline';
              break;
          }

          return <Icon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 100,
          paddingBottom: 20,
          paddingTop: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dictionary" component={DictionaryScreen} />
      <Tab.Screen name="Media" component={MediaScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Grammar" component={GrammarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <PaperProvider>
        <DictionaryProvider> 
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="PartScreen" component={PartScreen} />
              <Stack.Screen name="DictionaryFolder" component={DictionaryFolderScreen} />
              <Stack.Screen name="VideoScreen" component={VideoScreen} />
              <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
              <Stack.Screen name="Exercise1Screen" component={Exercise1Screen} />
              <Stack.Screen name="Exercise2Screen" component={Exercise2Screen} />
              <Stack.Screen name="Exercise3Screen" component={Exercise3Screen} />
              <Stack.Screen name="Exercise1Part2Screen" component={Exercise1Part2Screen} />
              <Stack.Screen name="Exercise2Part2Screen" component={Exercise2Part2Screen} />
              <Stack.Screen name="Exercise3Part2Screen" component={Exercise3Part2Screen} />
              <Stack.Screen name="Exercise1Part3Screen" component={Exercise1Part3Screen} />
              <Stack.Screen name="Exercise2Part3Screen" component={Exercise2Part3Screen} />
              <Stack.Screen name="Exercise3Part3Screen" component={Exercise3Part3Screen} />
              <Stack.Screen name="Exercise1Part4Screen" component={Exercise1Part4Screen} />
              <Stack.Screen name="Exercise2Part4Screen" component={Exercise2Part4Screen} />
              <Stack.Screen name="Exercise3Part4Screen" component={Exercise3Part4Screen} />
            </Stack.Navigator>
          </NavigationContainer>
        </DictionaryProvider>
      </PaperProvider>
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
