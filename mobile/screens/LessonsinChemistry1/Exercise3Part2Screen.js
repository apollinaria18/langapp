import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const WORDS = [
  "Reprimand",
  "Off-hours",
  "Appeal",
  "Thief",
  "Pick on",
  "Hold accountable",
  "Take chances",
  "Interrogate",
  "Supervision",
  "Compulsory",
  "On the clock",
  "Fibber",
];

const SENTENCES = [
  { text: "________! You couldn't run ten kilometres!", answer: "Fibber" },
  { text: "I was walking down the street doing nothing when the cops stopped and ________ me.", answer: "Interrogate" },
  { text: "This used to be a marvelous hotel but it has lost its _______ in recent years.", answer: "Appeal" },
  { text: "Just live, make mistakes, make memories, and _________ chances.", answer: "Take chances" },
  { text: "His boss gave him a severe __________ for being late.", answer: "Reprimand" },
  { text: "The government needs to be held ____________ for the way it spends taxpayers' money.", answer: "Hold accountable" },
  { text: "The art gallery was broken into last night, and the __________ got away with two valuable paintings.", answer: "Thief" },
  { text: "I'd love to go have a beer with you, but as you can see by the uniform I'm wearing, I'm actually ____ the clock right now.", answer: "On the clock" },
  { text: "Students are not allowed to handle these chemicals unless they are under the ____________ of a teacher.", answer: "Supervision" },
  { text: "Avoid crowds and traffic by shopping during _____-hours.", answer: "Off-hours" },
  { text: "His groupmates ________ on him because he's too fat.", answer: "Pick on" },
  { text: "The law made wearing seat belts in cars __________.", answer: "Compulsory" },
];

export default function Exercise3Part2Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Преобразуем входящие значения в числа сразу
  const score1 = Number(route.params?.part2score1) || 0;
  const score2 = Number(route.params?.part2score2) || 0;

  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWords, setSelectedWords] = useState(Array(SENTENCES.length).fill(null));
  const [attempts, setAttempts] = useState(Array(SENTENCES.length).fill(0));
  const [errorMessages, setErrorMessages] = useState(Array(SENTENCES.length).fill(""));
  const [scoreVisible, setScoreVisible] = useState(false);
  const [part2Score3, setPart2Score3] = useState(0);
  const [averageVisible, setAverageVisible] = useState(false);
  const [average, setAverage] = useState(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(Array(SENTENCES.length).fill(false));

  useEffect(() => {
    setWords([...WORDS].sort(() => Math.random() - 0.5));
  }, []);

  const handleSentencePress = (index) => {
    if (!selectedWord) return;

    const updatedSelectedWords = [...selectedWords];
    const updatedAttempts = [...attempts];
    const updatedErrors = [...errorMessages];
    const updatedShowCorrect = [...showCorrectAnswers];

    updatedAttempts[index] += 1;

    if (selectedWord === SENTENCES[index].answer) {
      updatedSelectedWords[index] = selectedWord;
      updatedErrors[index] = "";
      setWords(words.filter((w) => w !== selectedWord));
      setSelectedWord(null);
    } else {
      if (updatedAttempts[index] >= 3) {
        // После 3-й попытки показываем правильный ответ
        updatedShowCorrect[index] = true;
        updatedErrors[index] = `❌ Right answer: ${SENTENCES[index].answer}`;
      } else {
        updatedErrors[index] = "❌ Incorrect. Try again.";
      }
    }

    setSelectedWords(updatedSelectedWords);
    setAttempts(updatedAttempts);
    setErrorMessages(updatedErrors);
    setShowCorrectAnswers(updatedShowCorrect);
  };

  const allAnswered = selectedWords.every((word, index) => 
    word === SENTENCES[index].answer || attempts[index] >= 3
  );

  useEffect(() => {
    if (allAnswered) {
      let correctCount = 0;
      let totalPenalty = 0;

      selectedWords.forEach((word, index) => {
        if (word === SENTENCES[index].answer) {
          correctCount++;
          const att = attempts[index];
          // Apply penalties based on attempts
          if (att === 2) totalPenalty += 6; // -6% for 2nd attempt
          else if (att >= 3) totalPenalty += 7; // -7% for 3rd+ attempt
        }
      });

      const maxScore = 100;
      const basePerItem = maxScore / SENTENCES.length;
      const rawScore = basePerItem * correctCount;
      const finalScore = Math.max(rawScore - totalPenalty, 0);

      setPart2Score3(finalScore);

      // теперь считаем среднее правильно
      const avg = (score1 + score2 + finalScore) / 3;
      setAverage(avg);

      setScoreVisible(true);
    }
  }, [allAnswered]);

  const handleShowAverage = () => {
    setScoreVisible(false);
    setAverageVisible(true);
  };

  const handleAverageAction = () => {
    if (average >= 70) {
      navigation.navigate("MainTabs", { screen: "Media" });
    } else {
      navigation.navigate("PartScreen", {
        partId: "part2",
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
              style={[styles.wordBox, selectedWord === word && styles.wordBoxSelected]}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {SENTENCES.map((sentence, index) => {
          const isCorrect = selectedWords[index] === sentence.answer;
          const isAnswered = isCorrect || attempts[index] >= 3;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.sentenceBox,
                isCorrect && { borderColor: "green" },
                !isCorrect && isAnswered && { borderColor: "red" },
                errorMessages[index] && { borderColor: "red" },
              ]}
              onPress={() => handleSentencePress(index)}
              activeOpacity={0.8}
              disabled={isAnswered}
            >
              <Text style={styles.sentenceText}>
                {sentence.text.replace("________", selectedWords[index] || "________")}
              </Text>
              {!!errorMessages[index] && <Text style={styles.errorText}>{errorMessages[index]}</Text>}
              {isCorrect && <Text style={styles.correctText}>✅ Correct!</Text>}
              {showCorrectAnswers[index] && !isCorrect && (
                <Text style={styles.correctAnswerText}>
                  ✅ Correct answer: {sentence.answer}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Модалка для результата задания */}
      <Modal visible={scoreVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>✅ Score: {part2Score3.toFixed(1)}%</Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleShowAverage}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка для среднего */}
      <Modal visible={averageVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              📊 Average score: {average.toFixed(1)}%
            </Text>
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
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
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
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
  correctText: {
    color: "green",
    fontWeight: "bold",
  },
  correctAnswerText: {
    color: "green",
    fontWeight: "bold",
    marginTop: 5,
  },
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
});