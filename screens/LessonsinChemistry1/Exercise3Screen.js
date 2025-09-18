import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveUserScore } from "../../firebase/userScores";

const sentences = [
  { id: 0, text: 'All along the road there were market stalls selling', options: ['rip-off', 'off-rip'], correct: 'rip-off' },
  { id: 1, text: 'In wartime people have a tendency to', options: ['submit', 'hoard'], correct: 'hoard' },
  { id: 2, text: "Please don't block those ads – they help keep the lights", options: ['off', 'on'], correct: 'on' },
  { id: 3, text: 'You must', options: ['submit', 'sign up'], correct: 'submit' },
  { id: 4, text: 'Our youngest son is taking part in the school', options: ['pagaent', 'pageant'], correct: 'pageant' },
  { id: 5, text: "She's", options: ['signed up', 'sign up'], correct: 'signed up' },
  { id: 6, text: 'I often give my guests', options: ['leftovers', 'rip-offs'], correct: 'leftovers' },
  { id: 7, text: 'I provide them with', options: ['clue cards', 'cue cards'], correct: 'cue cards' },
];

export default function Exercise3Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { score1 = 0, score2 = 0, folderName = "defaultFolder", partId = null } = route.params || {};

  const [selected, setSelected] = useState(Array(sentences.length).fill(null));
  const [attempts, setAttempts] = useState(Array(sentences.length).fill(0));
  const [completed, setCompleted] = useState(Array(sentences.length).fill(false));
  const [scoreVisible, setScoreVisible] = useState(false);
  const [averageVisible, setAverageVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [average, setAverage] = useState(0);

  const handleSelect = (index, choice) => {
    if (completed[index]) return;

    const correct = sentences[index].correct;
    const newAttempts = [...attempts];
    const newSelected = [...selected];
    const newCompleted = [...completed];

    newAttempts[index] += 1;
    newSelected[index] = choice;

    if (choice === correct) {
      newCompleted[index] = true;
    }

    setAttempts(newAttempts);
    setSelected(newSelected);
    setCompleted(newCompleted);
  };

  useEffect(() => {
  const allDone = completed.every(Boolean);
  if (allDone) {
    let penalties = 0;

    attempts.forEach((tries, i) => {
      if (!completed[i]) return; // если слово так и не угадано, ничего не добавляем (0%)
      if (tries === 2) penalties += 12;    // -12% от общего
      if (tries === 3) penalties += 12.5;  // -12.5% от общего
    });

    const total = Math.max(100 - penalties, 0);
    setScore(total);
    setScoreVisible(true);
    saveUserScore(folderName, total).catch((e) => {
      console.error("❌ Error saving score:", e);
  });
  }
}, [completed]);

  const handleShowAverage = () => {
    const avg = (score1 + score2 + score) / 3;
    setAverage(avg);
    setAverageVisible(true);
  };

  const handleAverageAction = async () => {
  try {
    // Сохраняем средний балл под названием папки
    await saveUserScore(folderName, average);

    if (average >= 70) {
      navigation.navigate('MainTabs', { screen: 'Media' });
    } else {
      navigation.navigate('PartScreen', {
        partId: partId,
        folderName: folderName,
      });
    }
  } catch (e) {
    console.error("❌ Error saving score:", e);
  } finally {
    setAverageVisible(false);
  }
};

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete the sentences with the correct words and phrases</Text>

        {sentences.map((item, index) => (
          <View key={item.id} style={styles.questionBox}>
            <Text style={styles.questionText}>
              {item.text}{' '}
              <Text style={{ fontWeight: 'bold' }}>{item.options.join(' / ')}</Text>
            </Text>
            <View style={styles.optionsContainer}>
              {item.options.map((option) => {
                const isSelected = selected[index] === option;
                const isCorrect = option === item.correct;
                const isWrong = isSelected && !isCorrect;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      isSelected && isCorrect && styles.correctButton,
                      isSelected && isWrong && styles.wrongButton,
                    ]}
                    onPress={() => handleSelect(index, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Модалка для результата */}
      <Modal visible={scoreVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>✅ You scored: {score.toFixed(1)}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                setScoreVisible(false);
                handleShowAverage();
              }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка для среднего арифметического */}
      <Modal visible={averageVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              📊 Average score: {average.toFixed(1)}%
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={handleAverageAction}>
              <Text style={styles.nextButtonText}>
                {average >= 70 ? 'Go to Folders' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#4A44C6',
  },
  questionBox: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f5f5ff',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
  },
  correctButton: {
    backgroundColor: '#8BC34A',
  },
  wrongButton: {
    backgroundColor: '#F44336',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(187, 184, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultBox: {
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
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4A44C6',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 16,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
