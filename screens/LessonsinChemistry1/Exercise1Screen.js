import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const wordBank = [
  'cue card',
  'leftovers',
  'sign up',
  'pageant',
  'submit',
  'keep the lights on',
  'hoard',
  'rip-off',
];

const questions = [
  {
    sentence: [
      '1. The actor forgot his lines and had to glance at the ',
      <Text style={{ fontWeight: 'bold' }}>large card with prompts</Text>,
      '.',
    ],
    answer: 'cue card',
  },
  {
    sentence: [
      '2. Please don’t ',
      <Text style={{ fontWeight: 'bold' }}>collect all the supplies for yourself and hide them</Text>,
      ' — we all need to eat.',
    ],
    answer: 'hoard',
  },
  {
    sentence: [
      '3. After dinner, we packed the ',
      <Text style={{ fontWeight: 'bold' }}>food that remained</Text>,
      ' into containers for lunch tomorrow.',
    ],
    answer: 'leftovers',
  },
  {
    sentence: [
      '4. You need to ',
      <Text style={{ fontWeight: 'bold' }}>formally hand in</Text>,
      ' your scholarship application by Friday.',
    ],
    answer: 'submit',
  },
  {
    sentence: [
      '5. These donations are the only thing helping us ',
      <Text style={{ fontWeight: 'bold' }}>continue operating</Text>,
      ' during tough times.',
    ],
    answer: 'keep the lights on',
  },
  {
    sentence: [
      '6. That movie was just a ',
      <Text style={{ fontWeight: 'bold' }}>bad copy</Text>,
      ' of an older, better film.',
    ],
    answer: 'rip-off',
  },
  {
    sentence: [
      '7. She’s going to ',
      <Text style={{ fontWeight: 'bold' }}>enroll in</Text>,
      ' the baking competition next weekend.',
    ],
    answer: 'sign up',
  },
  {
    sentence: [
      '8. My little cousin won first place in the local ',
      <Text style={{ fontWeight: 'bold' }}>contest where girls are judged on beauty</Text>,
      '.',
    ],
    answer: 'pageant',
  },
];

export default function InteractiveInstructionsScreen() {
  const navigation = useNavigation();

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(''));
  const [attempts, setAttempts] = useState(Array(questions.length).fill(0));
  const [correctFlags, setCorrectFlags] = useState(Array(questions.length).fill(false));
  const [dropDownStates, setDropDownStates] = useState(
    Array(questions.length).fill(false)
  );

    const handleSelect = (value, index) => {
  if (correctFlags[index]) return;

  const updatedAnswers = [...userAnswers];
  const updatedAttempts = [...attempts];
  const updatedCorrect = [...correctFlags];

  updatedAnswers[index] = value;
  updatedAttempts[index] += 1;

  if (value === questions[index].answer) {
    // если угадал — отмечаем как правильный
    updatedCorrect[index] = true;
  } else if (updatedAttempts[index] >= 3) {
    // если 3 раза подряд неверно → показать правильный и закрыть вопрос
    updatedAnswers[index] = questions[index].answer;
    updatedCorrect[index] = false; // НЕ засчитываем в результат
  }

  setUserAnswers(updatedAnswers);
  setAttempts(updatedAttempts);
  setCorrectFlags(updatedCorrect);
};


  const getScore = () => {
  let penalties = 0;

  questions.forEach((_, i) => {
    const att = attempts[i];

    if (!correctFlags[i] && att >= 3) {
      // трижды ошибся → штраф 12.5% и не засчитываем
      penalties += 12.5;
      return;
    }

    if (correctFlags[i]) {
      if (att === 2) penalties += 10;   // −10%
      if (att === 3) penalties += 12; // −12%
    }
  });

  return Math.max(100 - penalties, 0);
};

  const allAnswered = questions.every((_, i) => correctFlags[i] || attempts[i] >= 3);

  const getCardStyle = (i) => {
    const isCorrect = correctFlags[i];
    const att = attempts[i];

    if (!isCorrect) return styles.card;

    let cornerStyles = [];
    if (att >= 2) cornerStyles.push(styles.corner1);
    if (att >= 3) cornerStyles.push(styles.corner2);
    if (att >= 4) cornerStyles.push(styles.corner3);

    return [styles.card, styles.correct, ...cornerStyles];
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Word Replacement Task</Text>

        {questions.map((q, i) => (
          <View key={i} style={getCardStyle(i)}>
            <Text style={styles.question}>
              {q.sentence.map((part, idx) => (
                <Text key={idx}>{part}</Text>
              ))}
            </Text>

            <DropDownPicker
              items={wordBank.map((word) => ({ label: word, value: word }))}
              open={dropDownStates[i]}
              value={userAnswers[i]}
              setOpen={(open) => {
                const newStates = [...dropDownStates];
                newStates[i] = open;
                setDropDownStates(newStates);
              }}
              setValue={(callback) => {
                const newValue = callback(userAnswers[i]);
                handleSelect(newValue, i);
              }}
              disabled={correctFlags[i] || attempts[i] >= 3}   // 🔥 теперь блокируется и после 3 ошибок
              style={[
                styles.dropdown,
                { zIndex: questions.length - i, elevation: questions.length - i },
              ]}
              dropDownDirection={i === 7 ? 'TOP' : 'AUTO'}
              dropDownContainerStyle={[
                styles.dropdownContainer,
                { zIndex: questions.length - i + 1, elevation: questions.length - i + 1 },
              ]}
              placeholder=""
              listMode="SCROLLVIEW"
              animationDuration={250}
            />
           {!correctFlags[i] && attempts[i] > 0 && attempts[i] < 3 && (
            <Text style={styles.resultText}>❌ Incorrect. Try again.</Text>
          )}

          {!correctFlags[i] && attempts[i] >= 3 && (
            <Text style={styles.resultText}>
              ❌ Right answer: <Text style={{ fontWeight: "bold" }}>{questions[i].answer}</Text>
            </Text>
          )}

          {correctFlags[i] && (
            <Text style={styles.resultText}>✅ Correct</Text>
          )}
          </View>
        ))}
      </ScrollView>

      {allAnswered && (
         <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Score: {getScore().toFixed(1)}%</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Exercise2Screen', {
                  score1: getScore(),
                })
              }
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingBottom: 40,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    color: '#6C63FF',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F9F8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    position: 'relative',
  },
  correct: {
    borderColor: 'green',
  },
  corner1: {
    borderTopLeftWidth: 4,
    borderTopLeftColor: 'red',
  },
  corner2: {
    borderBottomLeftWidth: 4,
    borderBottomLeftColor: 'red',
  },
  corner3: {
    borderTopRightWidth: 4,
    borderTopRightColor: 'red',
  },
  question: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#6C63FF',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#6C63FF',
  },
  resultText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(187, 184, 246, 0.9)', // полупрозрачный сиреневый
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },

  resultsBox: {
    backgroundColor: '#8B82FF', // яркий сиреневый
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
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },

  nextButton: {
    backgroundColor: '#4A44C6', // темно-сиреневый
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
