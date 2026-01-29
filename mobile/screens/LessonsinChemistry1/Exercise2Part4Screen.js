import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const QUESTIONS = [
  { phrase: "Free rein", text: "means having complete freedom to do what you want without restrictions.", answer: "T" },
  { phrase: "Treat as an equal", text: "means to consider someone less important than yourself.", answer: "F" },
  { phrase: "Odd", text: "describes something unusual or unexpected.", answer: "T" },
  { phrase: "Blowback", text: "is the positive support you get after making a decision.", answer: "F" },
  { phrase: "Sympathetic", text: "means showing understanding and care for someone’s suffering.", answer: "T" },
  { phrase: "Dead set on", text: "means you are unsure and hesitant about doing it.", answer: "F" },
  { phrase: "Fill out", text: "means to destroy something.", answer: "F" },
  { phrase: "Dry up", text: "means a supply ends or disappears.", answer: "T" },
  { phrase: "Cluttered", text: "means neat and well-organized.", answer: "F" },
  { phrase: "Dismiss", text: "means to decide something is unimportant or not worth considering.", answer: "T" },
  { phrase: "Jot down", text: "means to quickly write something so you can remember it later.", answer: "T" },
  { phrase: "Outcome", text: "is the beginning of an event or situation.", answer: "F" },
  { phrase: "Epiphany", text: "is a sudden moment of understanding or realization.", answer: "T" },
  { phrase: "Endeavor", text: "means to make a serious effort to do something difficult.", answer: "T" },
  { phrase: "Messy", text: "describes a situation that is chaotic or disorganized.", answer: "T" },
];

export default function TrueFalseExercise() {
  const [selected, setSelected] = useState({});
  const [attempts, setAttempts] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const navigation = useNavigation();
  const route = useRoute();

  const handleSelect = (index, option) => {
    const correctAnswer = QUESTIONS[index].answer;

    setAttempts((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));

    if (option === correctAnswer) {
      setSelected((prev) => ({ ...prev, [index]: option }));
    }
  };

  useEffect(() => {
    if (Object.keys(selected).length === QUESTIONS.length) {
      calculateScore();
    }
  }, [selected]);

  const calculateScore = () => {
  let total = 100; // стартуем с 100%
  const penaltyPerMistake = 7; // штраф за каждую неправильную попытку в процентах

  QUESTIONS.forEach((q, i) => {
    const mistakes = (attempts[i] || 0) - (selected[i] === q.answer ? 1 : 0);
    // если пользователь правильно ответил сразу, mistakes = 0
    // если он ошибался хотя бы раз, штрафуем
    if (mistakes > 0) {
      total -= penaltyPerMistake * mistakes;
    }
  });

  if (total < 0) total = 0; // не уйти в минус
  setFinalScore(total.toFixed(1));
  setShowResult(true);
};

  const getOptionStyle = (index, option) => {
    const correctAnswer = QUESTIONS[index].answer;
    if (!selected[index]) {
      if (attempts[index] && option !== correctAnswer) {
        return [styles.option, styles.wrongOption];
      }
      return styles.option;
    }
    if (option === correctAnswer) return [styles.option, styles.correctOption];
    return styles.option;
  };

  const getOptionTextStyle = (index, option) => {
    const correctAnswer = QUESTIONS[index].answer;
    if (!selected[index]) {
      if (attempts[index] && option !== correctAnswer) {
        return [styles.optionText, { color: "#fff" }];
      }
      return styles.optionText;
    }
    if (option === correctAnswer) {
      return [styles.optionText, { color: "#fff", fontWeight: "bold" }];
    }
    return styles.optionText;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Read each statement and decide if it is True (T) or False (F)</Text>

        {QUESTIONS.map((item, index) => (
          <View key={index} style={styles.questionBox}>
            <Text style={styles.question}>
              <Text style={styles.bold}>{index + 1}. {item.phrase}</Text> – {item.text}
            </Text>
            <View style={styles.optionsContainer}>
              {["T", "F"].map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={getOptionStyle(index, option)}
                  onPress={() => handleSelect(index, option)}
                  disabled={selected[index] === item.answer}
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
                navigation.navigate("Exercise3Part4Screen", { 
                    part4score1: Number(route.params?.part4score1),
                    part4score2: Number(finalScore),
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
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#fff",
 },
  container: { 
    padding: 20, 
    paddingBottom: 100,
 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A44C6",
    marginBottom: 25,
    marginTop: 10,
  },
  questionBox: {
    marginBottom: 20,
    backgroundColor: "#f4f3ff",
    padding: 15,
    borderRadius: 12,
  },
  question: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: "#333",
 },
  bold: { 
    fontWeight: "bold", 
    color: "#4A44C6",
 },
  optionsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around",
 },
  option: {
    backgroundColor: "#e6e4fb",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6C63FF",
    marginVertical: 6,
  },
  correctOption: { 
    backgroundColor: "#4CAF50", 
    borderColor: "#388E3C",
 },
  wrongOption: { 
    backgroundColor: "#F44336", 
    borderColor: "#D32F2F",
 },
  optionText: { 
    fontSize: 16, 
    color: "#333", 
    textAlign: "center",
 },
  resultsOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(187, 184, 246, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsBox: {
    backgroundColor: "#8B82FF",
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  scoreText: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20,
 },
  nextButton: {
    backgroundColor: "#4A44C6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  nextButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
 },
});
