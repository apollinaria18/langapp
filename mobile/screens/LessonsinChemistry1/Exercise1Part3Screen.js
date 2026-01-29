import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WORDS = ["long", "bad", "grateful", "good", "sleeping", "answer", "prove"];

const SENTENCES = [
  { text: "**To take for granted** – If you take situations or people for granted, you do not realize or show that you are ________ for how much you get from them.", answer: "grateful" },
  { text: "**To pursue** – If you pursue a plan, activity, or situation, you try to do it or achieve it, usually over a ________ period of time.", answer: "long" },
  { text: "**To claim** – To say that something is true or is a fact, although you cannot ________ it and other people might not believe it.", answer: "prove" },
  { text: "**To reflect on somebody** – To affect other people's opinion of someone or something, especially in a ________ way.", answer: "bad" },
  { text: "**To keep somebody up** – To prevent someone from going to bed or ________.", answer: "sleeping" },
  { text: "**Mediocre** – Not very ________.", answer: "good" },
  { text: "**A breakthrough** – An important discovery or event that helps to improve a situation or provide an ________ to a problem.", answer: "answer" },
];

export default function ExerciseWordsScreen() {
  const navigation = useNavigation();
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWords, setSelectedWords] = useState(Array(SENTENCES.length).fill(null));
  const [results, setResults] = useState(Array(SENTENCES.length).fill(""));
  const [attempts, setAttempts] = useState(Array(SENTENCES.length).fill(0));
  const [penalties, setPenalties] = useState(Array(SENTENCES.length).fill(0));
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setWords([...WORDS].sort(() => Math.random() - 0.5));
  }, []);

  const handleSentencePress = (index) => {
    if (!selectedWord) return;

    const updatedSelectedWords = [...selectedWords];
    const updatedResults = [...results];
    const updatedAttempts = [...attempts];
    const updatedPenalties = [...penalties];

    updatedAttempts[index] += 1;
    const attemptNum = updatedAttempts[index];

    if (selectedWord === SENTENCES[index].answer) {
  // правильный ответ
  updatedSelectedWords[index] = selectedWord;
  updatedResults[index] = "✅ Correct";
  setWords(words.filter((w) => w !== selectedWord));
} else {
  // неправильный ответ
  if (attemptNum === 1) {
    updatedResults[index] = "❌ Incorrect";
    updatedPenalties[index] = 10;
  } else if (attemptNum === 2) {
    updatedResults[index] = "❌ Incorrect again";
    updatedPenalties[index] = 12;
  } else if (attemptNum >= 3) {
    updatedResults[index] = `❌ Right answer: ${SENTENCES[index].answer}`;
    updatedSelectedWords[index] = SENTENCES[index].answer; // показываем правильный
    updatedPenalties[index] = 14.5;
    setWords(words.filter((w) => w !== SENTENCES[index].answer));
  }
}

    setSelectedWords(updatedSelectedWords);
    setResults(updatedResults);
    setAttempts(updatedAttempts);
    setPenalties(updatedPenalties);
    setSelectedWord(null);

    // если все предложения закрыты → показать результат
    const finished = updatedSelectedWords.every((w, i) => w !== null);
    if (finished) {
      setShowResult(true);
    }
  };

  const renderSentenceText = (text, insertedWord) => {
    const parts = text.split("**");
    if (parts.length === 3) {
      const boldPart = parts[1];
      const rest = parts[2].replace(/_+/g, insertedWord || "______");
      return (
        <>
          <Text style={styles.boldText}>{boldPart}</Text>
          <Text>{rest}</Text>
        </>
      );
    }
    return <Text>{text}</Text>;
  };

  // подсчет баллов
  const getScore = () => {
    const totalPenalty = penalties.reduce((sum, p) => sum + p, 0);
    return Math.max(100 - totalPenalty, 0).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.instructions}>Complete the sentences with the words:</Text>

        <View style={styles.wordBank}>
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedWord(word)}
              style={[styles.wordBox, selectedWord === word && styles.wordBoxSelected]}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {SENTENCES.map((sentence, index) => {
          const isCorrect = selectedWords[index] === sentence.answer && results[index].includes("✅");
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.sentenceBox,
                isCorrect && { borderColor: "green" },
                results[index].includes("❌") && { borderColor: "red" },
              ]}
              onPress={() => handleSentencePress(index)}
              disabled={results[index].includes("Right answer")} // после 3-й ошибки блокируем
            >
              <Text style={styles.sentenceText}>
                {renderSentenceText(sentence.text, selectedWords[index])}
              </Text>
              {!!results[index] && (
                <Text style={isCorrect ? styles.correctText : styles.errorText}>{results[index]}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* overlay с результатом */}
      {showResult && (
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Your score: {getScore()}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => navigation.navigate("Exercise2Part3Screen", { part3score1: Number(getScore()) })}
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
    flexGrow: 1, 
    padding: 20,
 },
  instructions: { 
    fontSize: 18, 
    marginBottom: 20, 
    marginTop: 10, 
    color: "#4A44C6", 
    fontWeight: "bold", 
    textAlign: "center",
 },

  wordBank: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    marginBottom: 20,
 },
  wordBox: { 
    backgroundColor: "#e6e4fb", 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    margin: 6, 
    borderColor: "#6C63FF", 
    borderWidth: 1,
 },
  wordBoxSelected: { 
    backgroundColor: "#d1ceff", 
    borderColor: "#4A44C6",
 },
  wordText: { 
    fontSize: 14, 
    color: "#333",
 },

  sentenceBox: { 
    padding: 12, 
    borderWidth: 2, 
    borderRadius: 8, 
    marginBottom: 12, 
    backgroundColor: "#f9f8ff", 
    borderColor: "#ccc",
 },
  sentenceText: { 
    fontSize: 16, 
    marginBottom: 5, 
    color: "#000",
 },
  boldText: { 
    fontWeight: "bold",
 },
  errorText: { 
    color: "red", 
    fontWeight: "bold",
 },
  correctText: { 
    color: "green", 
    fontWeight: "bold",
 },

  // overlay
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
 },
  nextButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
 },
});
