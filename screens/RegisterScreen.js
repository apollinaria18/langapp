// screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase"; // важно добавить db в firebase.js

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    // Проверка email
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Проверка пароля
    if (password.length < 8 || password.length > 20) {
      setError("Password must be between 8 and 20 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // сохраняем данные профиля в Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: email.split("@")[0], // по умолчанию логин = часть почты
        createdAt: serverTimestamp(),
      });

      alert("Registration successful!");
      navigation.navigate("Login");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Register</Text>

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
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    justifyContent: "center",
   },
  input: { 
    marginBottom: 15,
   },
  button: { 
    marginTop: 10, 
    backgroundColor: "#6C63FF",
   },
  link: { 
    textAlign: "center", 
    marginTop: 15, 
    color: "#6C63FF",
   },
  title: { 
    fontSize: 24, 
    textAlign: "center", 
    marginBottom: 20, 
    fontWeight: "bold",
    color: '#5750cfff',
   },
  logo: { 
    width: 150, 
    height: 150, 
    alignSelf: "center", 
    marginBottom: 20,
   },
  error: { 
    color: "red", 
    textAlign: "center", 
    marginBottom: 10,
   },
});
