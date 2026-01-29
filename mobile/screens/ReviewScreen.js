import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function OtzyvScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "feedbacks"), {
        uid: user?.uid || null,
        rating,
        feedback,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Thank you!", "Your review has been sent ✅");
      setRating(0);
      setFeedback("");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to send feedback");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave a review</Text>

      {/* ⭐ Звёздочки */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={40}
              color={star <= rating ? "#FFD700" : "#999"}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 📝 Текстовое поле */}
      <TextInput
        label="Your review (optional)"
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {/* Кнопка отправки */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={rating === 0}
        style={styles.button}
      >
        
       Send
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E2E",
    justifyContent: "center", // центрируем
    paddingBottom: 130,        // немного опускаем вниз
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25, // чуть больше отступ сверху
    color: "white",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 5,
  },
});

