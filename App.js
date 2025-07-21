// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import HomeScreen from './screens/HomeScreen';
import DictionaryScreen from './screens/DictionaryScreen';
import MediaScreen from './screens/MediaScreen';
import TestsScreen from './screens/TestsScreen';
import GrammarScreen from './screens/GrammarScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Показать заголовок
        headerTitleAlign: 'left', // Выравнивание влево
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
        height: 100,              // чуть выше стандартного
        paddingBottom: 20,       // поднимает иконки немного вверх
        paddingTop: 1,           // добавляет немного сверху
      },
      tabBarLabelStyle: {
        fontSize: 12,            // размер подписи
        marginBottom: 5,         // опускает текст вниз
      },
      tabBarIconStyle: {
        marginTop: 0,            // чтобы не съезжала иконка
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
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
