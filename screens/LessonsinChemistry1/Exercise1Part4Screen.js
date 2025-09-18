import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const QUESTIONS = [
  { phrase: "Free rein", text: "the freedom to do, say, or feel what you want without __________.", options: ["restrictions", "approval"], answer: "restrictions" },
  { phrase: "Treat as an equal", text: "to interact with someone as though they are on the same __________ level as you.", options: ["social", "financial"], answer: "social" },
  { phrase: "Odd", text: "used to describe something that is strange or __________.", options: ["normal", "unexpected"], answer: "unexpected" },
  { phrase: "Blowback", text: "unexpected negative reactions, such as criticism or __________.", options: ["praise", "protest"], answer: "protest" },
  { phrase: "Sympathetic", text: "showing understanding and care for someone else’s __________ or situation.", options: ["suffering", "success"], answer: "suffering" },
  { phrase: "Dead set on", text: "very determined to do or get something, no matter the __________.", options: ["obstacles", "benefits"], answer: "obstacles" },
  { phrase: "Fill out", text: "to complete a document or form by __________ in the necessary information.", options: ["writing", "erasing"], answer: "writing" },
  { phrase: "Dry up", text: "when a supply of something ends or __________.", options: ["increases", "disappears"], answer: "disappears" },
  { phrase: "Cluttered", text: "used to describe a space or thing that is untidy and has too many __________.", options: ["things", "spaces"], answer: "things" },
  { phrase: "Dismiss", text: "to decide that someone or something is not __________ or worth considering.", options: ["important", "irrelevant"], answer: "important" },
  { phrase: "Jot down", text: "to write something quickly in order to __________ it later.", options: ["remember", "forget"], answer: "remember" },
  { phrase: "Outcome", text: "the final result or __________ of an action or event.", options: ["beginning", "effect"], answer: "effect" },
  { phrase: "Epiphany", text: "a moment of sudden and important __________ or realization.", options: ["confusion", "understanding"], answer: "understanding" },
  { phrase: "Endeavor", text: "to try very hard to do something, especially something that is __________.", options: ["easy", "difficult"], answer: "difficult" },
  { phrase: "Messy", text: "describing a situation that is confused, unpleasant, or __________.", options: ["organized", "chaotic"], answer: "chaotic" },
];

export default function DefinitionsExercise({ navigation }) {
  const [selected, setSelected] = useState({});
  const [attempts, setAttempts] = useState({}); // считаем попытки для каждого вопроса
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleSelect = (index, option) => {
  const correctAnswer = QUESTIONS[index].answer;

  setAttempts((prev) => ({
    ...prev,
    [index]: (prev[index] || 0) + 1, // увеличиваем попытку
  }));

  if (option === correctAnswer) {
    setSelected((prev) => ({ ...prev, [index]: option }));
  }
};

useEffect(() => {
  // считаем, что задание завершено, если для всех вопросов есть хотя бы одна попытка
  if (QUESTIONS.every((_, index) => attempts[index] > 0)) {
    calculateScore();
  }
}, [attempts]);


const calculateScore = () => {
  const baseScore = 100;
  const penaltyPerWrong = 7;
  let totalPenalty = 0;

  // Считаем все попытки кроме правильных
  QUESTIONS.forEach((q, i) => {
    const wrongAttempts = (attempts[i] || 0) - (selected[i] === q.answer ? 1 : 0);
    if (wrongAttempts > 0) totalPenalty += wrongAttempts * penaltyPerWrong;
  });

  let final = baseScore - totalPenalty;
  if (final < 0) final = 0;

  setFinalScore(final.toFixed(1));
  setShowResult(true);
};

  const getOptionStyle = (index, option) => {
    const correctAnswer = QUESTIONS[index].answer;
    if (!selected[index]) {
      if (attempts[index] && option !== correctAnswer) {
        return [styles.option, styles.wrongOption]; // подсветка неправильного
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
        <Text style={styles.title}>Complete the definitions with the correct option</Text>

        {QUESTIONS.map((item, index) => (
          <View key={index} style={styles.questionBox}>
            <Text style={styles.question}>
              <Text style={styles.bold}>{item.phrase}</Text> – {item.text}
            </Text>
            <View style={styles.optionsContainer}>
              {item.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={getOptionStyle(index, option)}
                  onPress={() => handleSelect(index, option)}
                  disabled={selected[index] === item.answer} // блокируем только если ответ правильный
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
                    navigation.navigate("Exercise2Part4Screen", {
                        part4score1: Number(finalScore), // ✅ правильный вариант
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
  optionsContainer: { // В СТОЛБИК
    flexDirection: "column",
 }, 
  option: {
    backgroundColor: "#e6e4fb",
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    fontSize: 15, 
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
