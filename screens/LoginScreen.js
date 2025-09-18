import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import * as AuthSession from 'expo-auth-session';


import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      expoClientId: '76494221415-oqk4nvdujd810oe55sj5hsmdd0kth2r2.apps.googleusercontent.com',
      androidClientId: '76494221415-gjc864q34s4uc8nm5jppo2akgca3br33.apps.googleusercontent.com',
      iosClientId: '76494221415-hdb9c37r3ip6k54e9afmk900l9d9sm6b.apps.googleusercontent.com',
      webClientId: '76494221415-ndlsmdhv83idv0kd3fm8906b7p5e3egd.apps.googleusercontent.com',
    },
    {
      useProxy: true,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    }
  );


  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.replace('MainTabs'))
        .catch(() => setError('Google login failed.'));
    }
  }, [response]);

  const handleLogin = async () => {
    setError('');
    if (!email.includes('@')) return setError('Please enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (e) {
      setError('Incorrect email or password.');
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Apple Sign-In only works on iOS devices');
      return;
    }

    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
      });

      await signInWithCredential(auth, credential);
      navigation.replace('MainTabs');
    } catch (e) {
      setError('Apple login failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>LangApp</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Log In
      </Button>

      <Text style={styles.or}>OR</Text>

      {/* Google Sign-In */}
      <TouchableOpacity
        onPress={() => promptAsync()}
        style={styles.outlineButton}
        disabled={!request}
      >
        <Image
          source={require('../assets/google-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.outlineButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Apple Sign-In (shown on all platforms) */}
      <TouchableOpacity onPress={handleAppleLogin} style={styles.outlineButton}>
        <Image
          source={require('../assets/apple-icon.png')}
          style={styles.icon}
        />
        <Text style={styles.outlineButtonText}>Sign in with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'center',
   },
  input: { 
    marginBottom: 15,
   },
  button: { 
    marginTop: 10, 
    backgroundColor: '#6C63FF',
   },
  or: { 
    textAlign: 'center', 
    marginVertical: 10, 
    color: '#999',
   },
  error: { 
    color: 'red', 
    textAlign: 'center', 
    marginBottom: 10,
   },
  title: { 
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold', 
    color: '#5750cfff',
  },
  logo: { 
    width: 150, 
    height: 150, 
    alignSelf: 'center', 
    marginBottom: 20,
   },
  link: { 
    textAlign: 'center', 
    marginTop: 15, 
    color: '#6C63FF',
   },

  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  outlineButtonText: {
    color: '#6C63FF',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
