// App.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import Login from './navigation/stackNavigation/LoginScreen';
import ExpenseDetails from './navigation/stackNavigation/ExpenseDetailsScreen';
import AddExpense from './navigation/stackNavigation/AddExpenseScreen';

import data, { ExpenseItem } from './src/data';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = async () => {
    const email = await AsyncStorage.getItem('email');
    setIsLoggedIn(!!email);
  };

  const handleLogin = async (email: string, password: string) => {
    if (password === 'SOM@React@1') {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('expenses', JSON.stringify(data));
      await AsyncStorage.setItem('totalSpending', '0');
      setIsLoggedIn(true);
    } else {
      Alert.alert('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['email', 'expenses', 'totalSpending']);
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <ExpenseDetails {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name='AddExpense' component={AddExpense} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;