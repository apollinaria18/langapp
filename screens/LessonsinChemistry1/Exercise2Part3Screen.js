import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useRoute } from '@react-navigation/native';

const EXERCISES = [
  { phrase: "Take for granted", options: ["negotiations", "friendship", "help"], answer: "negotiations" },
  { phrase: "Pursue", options: ["your dreams", "performance", "a career"], answer: "performance" },
  { phrase: "Claim", options: ["responsibility", "bright light", "insurance"], answer: "bright light" },
  { phrase: "Reflect on", options: ["medical", "your actions", "past experiences"], answer: "medical" },
  { phrase: "Keep somebody up", options: ["talking", "breakthrough", "all night"], answer: "breakthrough" },
  { phrase: "Mediocre", options: ["dreams", "performance", "service"], answer: "dreams" },
  { phrase: "Breakthrough", options: ["scientific", "noise", "major"], answer: "noise" },
];

export default function CrossWordExercise({ navigation }) {
  const [selected, setSelected] = useState({});
  const [attempts, setAttempts] = useState(Array(EXERCISES.length).fill(0));
  const [showResult, setShowResult] = useState(false);
  const route = useRoute();
  const [finalScore, setFinalScore] = useState(0);

  const getOptionStyle = (index, option) => {
    const userChoice = selected[index];
    if (!userChoice) return styles.option;

    if (option === EXERCISES[index].answer && option === userChoice) {
      return [styles.option, styles.correctOption];
    } else if (option === userChoice && option !== EXERCISES[index].answer) {
      return [styles.option, styles.wrongOption];
    } else {
      return styles.option;
    }
  };

  const getOptionTextStyle = (index, option) => {
    const userChoice = selected[index];
    if (!userChoice) return styles.optionText;

    if (option === EXERCISES[index].answer && option === userChoice) {
      return [styles.optionText, { color: "#fff", fontWeight: "bold" }];
    } else if (option === userChoice && option !== EXERCISES[index].answer) {
      return [styles.optionText, { color: "#fff", fontWeight: "bold" }];
    } else {
      return styles.optionText;
    }
  };

  const handleSelect = (index, option) => {
    const newSelected = { ...selected, [index]: option };
    const newAttempts = [...attempts];

    if (selected[index] !== EXERCISES[index].answer) {
      newAttempts[index] += 1;
    }

    setSelected(newSelected);
    setAttempts(newAttempts);

    // Проверяем, все ли ответы верные
    const allAnswered = Object.keys(newSelected).length === EXERCISES.length;
    const lastIndex = EXERCISES.length - 1;

    if (allAnswered && newSelected[lastIndex] === EXERCISES[lastIndex].answer) {
      const score = getScore(newSelected, newAttempts);
      setFinalScore(score);
      setShowResult(true);
    }
  };

  const getScore = (selectedAnswers, attemptsArray) => {
  let total = 100; // начинаем с 100%
  
  EXERCISES.forEach((exercise, i) => {
    if (selectedAnswers[i] === exercise.answer) {
      const mistakes = attemptsArray[i] - 1; // минус 1, потому что первая попытка без штрафа
      let penalty = 0;

      if (mistakes === 0) penalty = 0;        // правильный с первой попытки
      else if (mistakes === 1) penalty = 10;  // 1-я ошибка = -10%
      else if (mistakes === 2) penalty = 12;  // 2-я ошибка = -12%
      else if (mistakes === 3) penalty = 14;  // 3-я ошибка = -14%
      else penalty = 14;                       // все последующие = -14%

      total -= penalty;
    } else {
      // если ответ неверный, снимаем максимальный штраф за это упражнение
      total -= 14;
    }
  });

  return Math.max(0, Number(total.toFixed(1)));
};


  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cross one word that doesn’t collocate</Text>
        {EXERCISES.map((item, index) => (
          <View key={index} style={styles.exerciseBox}>
            <Text style={styles.phrase}>
              <Text style={styles.bold}>{item.phrase}</Text> —
            </Text>
            <View style={styles.optionsContainer}>
              {item.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelect(index, option)}
                  style={getOptionStyle(index, option)}
                >
                  <Text style={getOptionTextStyle(index, option)}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {showResult && (
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Score: {finalScore}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                navigation.navigate("Exercise3Part3Screen", { 
                  part3score1: Number(route.params?.part3score1),
                  part3score2: Number(finalScore),
                })
              }
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A44C6",
    marginBottom: 25,
    marginTop: 10,
  },
  exerciseBox: {
    marginBottom: 20,
    backgroundColor: "#f4f3ff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  phrase: { fontSize: 18, marginBottom: 10, color: "#333" },
  bold: { fontWeight: "bold", color: "#4A44C6" },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  option: {
    backgroundColor: "#e6e4fb",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#6C63FF",
    minWidth: 90,
    alignItems: "center",
  },
  correctOption: { backgroundColor: "#4CAF50", borderColor: "#388E3C" },
  wrongOption: { backgroundColor: "#F44336", borderColor: "#D32F2F" },
  optionText: { fontSize: 14, color: "#333", textAlign: "center" },

  resultsOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(187, 184, 246, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultsBox: {
    backgroundColor: "#8B82FF",
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#4A44C6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
