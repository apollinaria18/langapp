import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const WORDS = [
  "odd", "endeavor", "blowback", "jot down", "cluttered", "sympathetic",
  "messy", "treat as an equal", "outcome", "free rein", "dismiss",
  "fill out", "epiphany", "dry up", "dead set on"
];

const SENTENCES = [
  { text: "The manager gave the design team ________ to try any creative ideas they wanted for the new project.", answer: "free rein" },
  { text: "After his speech, the politician faced unexpected ________ from both the public and the media.", answer: "blowback" },
  { text: "Don’t forget to ________ your flight details so we can arrange the pickup.", answer: "jot down" },
  { text: "I know your desk is a bit ________, but I can still find what I need in here.", answer: "cluttered" },
  { text: "The teacher was strict but always tried to ________ her students.", answer: "treat as an equal" },
  { text: "She’s completely ________ becoming a professional athlete, no matter the obstacles.", answer: "dead set on" },
  { text: "The meeting ended without a clear ________, so we’ll have to discuss it again tomorrow.", answer: "outcome" },
  { text: "I had an ________ while reading that book — suddenly everything made sense.", answer: "epiphany" },
  { text: "His reaction was rather ________, considering the good news he had just received.", answer: "odd" },
  { text: "They decided to ________ the complaint, saying it wasn’t worth investigating.", answer: "dismiss" },
  { text: "The charity worker was genuinely ________ towards the refugees’ struggles.", answer: "sympathetic" },
  { text: "You’ll need to ________ this application form before the deadline.", answer: "fill out" },
  { text: "The water supply in the village began to ________ after weeks without rain.", answer: "dry up" },
  { text: "It was a challenging ________, but the whole team worked hard to make it a success.", answer: "endeavor" },
  { text: "The negotiations turned ________ after both sides refused to compromise.", answer: "messy" },
];

export default function ExerciseSentencesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { part4score1 = 0, part4score2 = 0 } = route.params || {};

  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWords, setSelectedWords] = useState(Array(SENTENCES.length).fill(null));
  const [results, setResults] = useState(Array(SENTENCES.length).fill(""));
  const [attempts, setAttempts] = useState(Array(SENTENCES.length).fill(0));

  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showAverage, setShowAverage] = useState(false);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    setWords([...WORDS].sort(() => Math.random() - 0.5));
  }, []);

  const handleSentencePress = (index) => {
  if (!selectedWord) return;

  const updatedSelectedWords = [...selectedWords];
  const updatedResults = [...results];
  const updatedAttempts = [...attempts];
  updatedAttempts[index] += 1;

  if (selectedWord === SENTENCES[index].answer) {
    // Правильный выбор → вставляем и убираем из банка слов
    updatedSelectedWords[index] = selectedWord;
    updatedResults[index] = "✅ Correct";
    setWords(words.filter((w) => w !== selectedWord));
  } else {
    // Неверно → оставляем слово в списке
    if (updatedAttempts[index] >= 3) {
      // Трижды неверно → показываем правильный ответ
      updatedSelectedWords[index] = SENTENCES[index].answer;
      updatedResults[index] = `❌ Correct answer: ${SENTENCES[index].answer}`;
      // Здесь слово НЕ удаляем из банка, но в score списываем 8%
    } else {
      updatedResults[index] = "❌ Incorrect. Try again";
    }
  }

  setSelectedWords(updatedSelectedWords);
  setResults(updatedResults);
  setAttempts(updatedAttempts);
  setSelectedWord(null);

  if (updatedSelectedWords.every((w, i) => w === SENTENCES[i].answer)) {
    const finalScore = getScore(updatedSelectedWords, updatedAttempts);
    setScore(finalScore);
    setShowResult(true);
  }
};

const getScore = (selWords, att) => {
  let total = 100; // стартовый балл 100%

  att.forEach((tries, i) => {
    if (selWords[i] === SENTENCES[i].answer) {
      const mistakes = tries - 1;
      if (mistakes === 1) total -= total * 0.05; // −5% от текущего total
      else if (mistakes === 2) total -= total * 0.06; // −6% от текущего total
      else if (mistakes >= 3) total -= total * 0.08; // −8% если слово показали после 3 попыток
    } else {
      total -= total * 0.08; // если слово так и не угадал
    }
  });

  return Math.max(0, Number(total.toFixed(1)));
};

  const handleNext = () => {
    setShowResult(false);
    const avg = (part4score1 + part4score2 + score) / 3;
    setAverage(avg);
    setShowAverage(true);
  };

  const handleAverageAction = () => {
    if (average >= 70) {
      navigation.navigate("MainTabs", { screen: "Media" });
    } else {
      navigation.navigate("PartScreen", {
        partId: "part1",
        folderName: "Lessons in Chemistry Episode 1",
      });
    }
    setShowAverage(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete the sentences with the correct words:</Text>

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
          const isCorrect = selectedWords[index] === sentence.answer;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.sentenceBox,
                isCorrect && { borderColor: "green" },
                results[index]?.includes("❌") && { borderColor: "red" },
              ]}
              onPress={() => handleSentencePress(index)}
            >
              <Text style={styles.sentenceText}>
                {sentence.text.replace("______", selectedWords[index] || "______")}
              </Text>
              {!!results[index] && (
                <Text style={isCorrect ? styles.correctText : styles.errorText}>{results[index]}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Модалка — результат за 3-е задание */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Your score: {score}%</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка — средний балл */}
      <Modal visible={showAverage} transparent animationType="fade">
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>📊 Average score: {average.toFixed(1)}%</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleAverageAction}>
              <Text style={styles.nextButtonText}>
                {average >= 70 ? "Go to Folders" : "Try Again"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flexGrow: 1, padding: 20 },
  title: {
    marginTop: 20,
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 16,
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
  wordBoxSelected: { backgroundColor: "#d1ceff", borderColor: "#4A44C6" },
  wordText: { fontSize: 14, color: "#333" },

  sentenceBox: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f8ff",
    borderColor: "#ccc",
  },
  sentenceText: { fontSize: 16, marginBottom: 5, color: "#000" },
  errorText: { color: "red", fontWeight: "bold" },
  correctText: { color: "green", fontWeight: "bold" },

  resultsOverlay: {
    flex: 1,
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
  nextButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
