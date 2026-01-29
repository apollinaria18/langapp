import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import { useRoute } from '@react-navigation/native';


const QUESTIONS = [
  {
    id: 1,
    sentence: (
      <Text>
        The manager gave him a <Text style={{ fontWeight: "bold" }}>reprimand</Text> for being late three times this week.
      </Text>
    ),
    options: ["Promotion", "Official criticism", "Applause"],
    answer: 1,
  },
  {
    id: 2,
    sentence: (
      <Text>
        She usually works on her project during her <Text style={{ fontWeight: "bold" }}>off-hours</Text> at home.
      </Text>
    ),
    options: ["Regular working time", "Vacation abroad", "Time when not officially working"],
    answer: 2,
  },
  {
    id: 3,
    sentence: (
      <Text>
        The advertisement had a certain <Text style={{ fontWeight: "bold" }}>appeal</Text> that made people curious.
      </Text>
    ),
    options: ["Boring tone", "Attractive quality", "Legal warning"],
    answer: 1,
  },
  {
    id: 4,
    sentence: (
      <Text>
        The <Text style={{ fontWeight: "bold" }}>thief</Text> was caught trying to steal a laptop from the lab.
      </Text>
    ),
    options: ["A person who tells stories", "A person who cleans", "A person who steals"],
    answer: 2,
  },
  {
    id: 5,
    sentence: (
      <Text>
        The older kids used to <Text style={{ fontWeight: "bold" }}>pick on</Text> him at school for wearing glasses.
      </Text>
    ),
    options: ["Support and encourage", "Tease or bully unfairly", "Choose for a team"],
    answer: 1,
  },
  {
    id: 6,
    sentence: (
      <Text>
        The director promised to <Text style={{ fontWeight: "bold" }}>hold accountable</Text> the assistant for the missing documents.
      </Text>
    ),
    options: ["Give praise", "Ignore the situation", "Make responsible and demand explanation"],
    answer: 2,
  },
  {
    id: 7,
    sentence: (
      <Text>
        She decided to <Text style={{ fontWeight: "bold" }}>take chances</Text> and invest in a new startup.
      </Text>
    ),
    options: ["Avoid risks", "Do something risky", "Wait for results"],
    answer: 1,
  },
  {
    id: 8,
    sentence: (
      <Text>
        The officer began to <Text style={{ fontWeight: "bold" }}>interrogate</Text> the suspect for over an hour.
      </Text>
    ),
    options: ["Praise politely", "Ignore completely", "Question aggressively to get information"],
    answer: 2,
  },
  {
    id: 9,
    sentence: (
      <Text>
        All lab work must be done under proper <Text style={{ fontWeight: "bold" }}>supervision</Text>.
      </Text>
    ),
    options: ["Personal freedom", "Lack of control", "Careful watching to ensure safety and correctness"],
    answer: 2,
  },
  {
    id: 10,
    sentence: (
      <Text>
        Wearing safety goggles is <Text style={{ fontWeight: "bold" }}>compulsory</Text> in the lab.
      </Text>
    ),
    options: ["Optional", "Required by rule or law", "Outdated"],
    answer: 1,
  },
  {
    id: 11,
    sentence: (
      <Text>
        While <Text style={{ fontWeight: "bold" }}>on the clock</Text>, you should avoid personal phone calls.
      </Text>
    ),
    options: ["At work", "On vacation", "Sleeping"],
    answer: 0,
  },
  {
    id: 12,
    sentence: (
      <Text>
        He’s such a <Text style={{ fontWeight: "bold" }}>fibber</Text>—you can’t trust half of what he says.
      </Text>
    ),
    options: ["A person who forgets", "A person who tells small lies", "A person who whispers"],
    answer: 1,
  },
];

export default function Exercise2Part2Screen({ navigation }) {
  const initialState = QUESTIONS.map(() => ({
    correct: false,
    penalty: 0,
    lastWrong: null,
  }));

  const route = useRoute();

  const [state, setState] = useState(initialState);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleOptionPress = (qIndex, optionIndex) => {
  if (state[qIndex].correct) return;

  setState((prev) => {
    const updated = [...prev];
    updated[qIndex].lastWrong = null;

    if (optionIndex === QUESTIONS[qIndex].answer) {
      updated[qIndex].correct = true;
    } else {
      updated[qIndex].lastWrong = optionIndex;
      updated[qIndex].penalty += 1; // считаем количество ошибок
    }
    return updated;
  });
};

const calculateScore = () => {
  let total = 100; // максимум

  state.forEach((q) => {
    if (q.penalty === 1) {
      total -= 6;
    } else if (q.penalty >= 2) {
      total -= 8;
    }
  });

  return Math.max(0, total); // не уходим в минус
};

  // Когда все вопросы отвечены — показываем результат
  useEffect(() => {
    const allAnswered = state.every((q) => q.correct);
    if (allAnswered) {
      const score = calculateScore();
      setFinalScore(score.toFixed(0));
      setResultsVisible(true);
    }
  }, [state]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Read each sentence carefully. The word in bold is a vocabulary term. Choose the correct meaning</Text>

        {QUESTIONS.map((q, qIndex) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>
              {qIndex + 1}. {q.sentence}
            </Text>

            {q.options.map((option, index) => {
              let backgroundColor = "#ddddddff";
              if (state[qIndex].lastWrong === index) {
                backgroundColor = "#e78080ff";
              }
              if (state[qIndex].correct && index === q.answer) {
                backgroundColor = "#78e268ff";
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOptionPress(qIndex, index)}
                  style={[styles.optionButton, { backgroundColor }]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Модалка вынесена за ScrollView */}
      <Modal visible={resultsVisible} transparent animationType="fade">
        <View style={[StyleSheet.absoluteFillObject, styles.resultsOverlay]}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Score: {finalScore}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                navigation.navigate("Exercise3Part2Screen", { 
                  part2score1: Number(route.params?.part2score1),
                  part2score2: Number(finalScore),
                })
              }
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff4d",
    flexGrow: 1,
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionBlock: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f5f5ff",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  optionText: {
    color: "#fcf9f9ff",
    fontWeight: "bold",
  },
  resultsOverlay: {
    backgroundColor: 'rgba(187, 184, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsBox: {
    backgroundColor: '#8B82FF',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  scoreText: {
    fontSize: 26,
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
