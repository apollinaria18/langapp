// screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = 'https://auth.expo.dev/@karavai.polina/langapp';
    // 🔐 Google auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '76494221415-oqk4nvdujd810oe55sj5hsmdd0kth2r2.apps.googleusercontent.com',
    androidClientId: '76494221415-gjc864q34s4uc8nm5jppo2akgca3br33.apps.googleusercontent.com',
    iosClientId: '76494221415-hdb9c37r3ip6k54e9afmk900l9d9sm6b.apps.googleusercontent.com',
    webClientId: '76494221415-ndlsmdhv83idv0kd3fm8906b7p5e3egd.apps.googleusercontent.com', 
  },{
    useProxy: true,
  });

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

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome</Text>

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

      <Button
        mode="outlined"
        icon="google"
        onPress={() => promptAsync()}
        style={styles.googleButton}
        disabled={!request}
      >
        Sign in with Google
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  input: { marginBottom: 15 },
  button: { marginTop: 10, backgroundColor: '#6C63FF' },
  googleButton: { marginTop: 10, borderColor: '#6C63FF', borderWidth: 1 },
  link: { textAlign: 'center', marginTop: 15, color: '#6C63FF' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 20 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  or: { textAlign: 'center', marginVertical: 10, color: '#999' },
});
