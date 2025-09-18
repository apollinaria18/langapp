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
  "take for granted",
  "pursue",
  "mediocre",
  "breakthrough",
  "reflect on",
  "keep somebody up",
  "claim",
];

const SENTENCES = [
  {
    text: "We should never ________ our friends’ support; it’s something truly valuable.",
    answer: "take for granted",
  },
  {
    text: "After years of research, the scientists finally made a medical ________ that could save millions of lives.",
    answer: "breakthrough",
  },
  {
    text: "The lawyer advised the company to ________ legal action against the supplier.",
    answer: "claim",
  },
  {
    text: "His performance in the competition was rather ________ — not terrible, but far from impressive.",
    answer: "mediocre",
  },
  {
    text: "She had to ________ her actions after receiving negative feedback from the team.",
    answer: "reflect on",
  },
  {
    text: "I’m sorry if I ________ you ________ with my late-night phone call.",
    answer: "keep somebody up",
  },
  {
    text: "Despite many challenges, she continued to ________ her dream of becoming a doctor.",
    answer: "pursue",
  },
];

export default function CompleteSentencesScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const part3score1 = Number(route.params?.part3score1) || 0;
  const part3score2 = Number(route.params?.part3score2) || 0;

  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWords, setSelectedWords] = useState(Array(SENTENCES.length).fill(null));
  const [attempts, setAttempts] = useState(Array(SENTENCES.length).fill(0));
  const [penalties, setPenalties] = useState(Array(SENTENCES.length).fill(0));
  const [errorMessages, setErrorMessages] = useState(Array(SENTENCES.length).fill(""));
  const [scoreVisible, setScoreVisible] = useState(false);
  const [averageVisible, setAverageVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    setWords([...WORDS].sort(() => Math.random() - 0.5));
  }, []);

  const handleSentencePress = (index) => {
    if (!selectedWord) return;

    const updatedSelectedWords = [...selectedWords];
    const updatedAttempts = [...attempts];
    const updatedErrors = [...errorMessages];
    const updatedPenalties = [...penalties];

    updatedAttempts[index] += 1;
    const attemptNum = updatedAttempts[index];

    if (selectedWord === SENTENCES[index].answer) {
      updatedSelectedWords[index] = selectedWord;
      updatedErrors[index] = "✅ Correct!";
      setWords(words.filter((w) => w !== selectedWord));
      updatedPenalties[index] = 0; // штраф за правильный ответ = 0
    } else {
      if (attemptNum === 1) updatedPenalties[index] = 10;
      else if (attemptNum === 2) updatedPenalties[index] = 12;
      else if (attemptNum >= 3) {
        updatedPenalties[index] = 14.5;
        updatedSelectedWords[index] = SENTENCES[index].answer;
        updatedErrors[index] = `❌ Correct answer: ${SENTENCES[index].answer}`;
        setWords(words.filter((w) => w !== SENTENCES[index].answer));
      }
      if (attemptNum < 3) updatedErrors[index] = "❌ Incorrect. Try again.";
    }

    setSelectedWords(updatedSelectedWords);
    setAttempts(updatedAttempts);
    setErrorMessages(updatedErrors);
    setPenalties(updatedPenalties);
    setSelectedWord(null);

    const finished = updatedSelectedWords.every((w) => w !== null);
    if (finished) setScoreVisible(true);
  };

  useEffect(() => {
    const allAnswered = selectedWords.every((word) => word !== null);
    if (allAnswered) {
      const totalPenalty = penalties.reduce((sum, p) => sum + p, 0);
      const totalScore = Math.max(100 - totalPenalty, 0);
      setScore(totalScore);

      const scores = [part3score1, part3score2, totalScore];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      setAverage(avg);
    }
  }, [selectedWords, penalties]);

  const handleShowAverage = () => {
    setScoreVisible(false);
    setAverageVisible(true);
  };

  const handleAverageAction = () => {
    if (average >= 70) {
      navigation.navigate("MainTabs", { screen: "Media" });
    } else {
      navigation.navigate("PartScreen", {
        partId: "part3",
        folderName: "Lessons in Chemistry Episode 1",
      });
    }
    setAverageVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete the sentences with the words:</Text>

        <View style={styles.wordBank}>
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedWord(word)}
              style={[
                styles.wordBox,
                selectedWord === word && styles.wordBoxSelected,
              ]}
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
                errorMessages[index] && !isCorrect && { borderColor: "red" },
              ]}
              onPress={() => handleSentencePress(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.sentenceText}>
                {sentence.text.replace("________", selectedWords[index] || "________")}
              </Text>

              {/* Ошибки */}
              {!!errorMessages[index] && !isCorrect && (
                <Text style={styles.errorText}>{errorMessages[index]}</Text>
              )}

              {/* Верный ответ */}
              {isCorrect && <Text style={styles.correctText}>✅ Correct!</Text>}

              {/* Правильный ответ после 3 попыток */}
              {attempts[index] >= 3 && selectedWords[index] === SENTENCES[index].answer && errorMessages[index].includes("Correct answer") && (
                <Text style={styles.rightAnswerText}>
                  ❌ Right answer: <Text style={{ fontWeight: 'bold' }}>{SENTENCES[index].answer}</Text>
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* модалка результата */}
      <Modal visible={scoreVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>✅ Score: {score.toFixed(1)}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleShowAverage}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* модалка среднего */}
      <Modal visible={averageVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              📊 Average score: {average.toFixed(1)}%
            </Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleAverageAction}
            >
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(187, 184, 246, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultBox: {
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
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#4A44C6",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 16,
    elevation: 5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  rightAnswerText: {
  fontSize: 16,
  color: '#fff',           // или любой цвет на фоне
  backgroundColor: '#bdbaf3ff', // например, как у карточек в примере
  padding: 6,
  borderRadius: 6,
  fontWeight: 'bold',      // чтобы весь текст был жирным
  marginTop: 5,
  textAlign: 'center',
},
});
