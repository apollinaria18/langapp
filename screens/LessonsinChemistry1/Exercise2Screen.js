import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const originalWordBank = [
  'cue card',
  'leftovers',
  'sign up',
  'pageant',
  'submit',
  'keep the lights on',
  'hoard',
  'rip-off',
];

const imageSources = [
  require('../../assets/match/1-cue-card.png'),
  require('../../assets/match/2-leftovers.png'),
  require('../../assets/match/3-sign-up.png'),
  require('../../assets/match/4-pageant.png'),
  require('../../assets/match/5-submit.png'),
  require('../../assets/match/6-keep-lights-on.png'),
  require('../../assets/match/7-hoard.png'),
  require('../../assets/match/8-rip-off.png'),
];


const correctMatches = {
  0: 'cue card',
  1: 'leftovers',
  2: 'sign up',
  3: 'pageant',
  4: 'submit',
  5: 'keep the lights on',
  6: 'hoard',
  7: 'rip-off',
};

export default function Exercise2Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [words, setWords] = useState([]);
  const [assignedWords, setAssignedWords] = useState(Array(8).fill(null));
  const [selectedWord, setSelectedWord] = useState(null);
  const [attempts, setAttempts] = useState(Array(8).fill(0));
  const [errorMessages, setErrorMessages] = useState(Array(8).fill(''));
  const [scoreVisible, setScoreVisible] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffled = [...originalWordBank].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  }, []);

  const handleImagePress = (index) => {
    if (!selectedWord) return;

    const currentAttempt = attempts[index];
    const correctWord = correctMatches[index];

    const updatedAttempts = [...attempts];
    updatedAttempts[index] = currentAttempt + 1;

    const updatedErrors = [...errorMessages];

    if (selectedWord === correctWord) {
      const updatedAssignments = [...assignedWords];
      updatedAssignments[index] = selectedWord;

      updatedErrors[index] = '';

      setAssignedWords(updatedAssignments);
      setWords(words.filter((w) => w !== selectedWord));
      setSelectedWord(null);
    } else {
      updatedErrors[index] = '❌ Incorrect. Try again.';
    }

    setAttempts(updatedAttempts);
    setErrorMessages(updatedErrors);
  };

  const getBorderColor = (i) => {
    if (!assignedWords[i] && !errorMessages[i]) return '#ccc';
    if (assignedWords[i] === correctMatches[i]) return 'green';
    if (errorMessages[i]) return 'red';
    return '#ccc';
  };

  const allCorrect = assignedWords.every(
    (word, index) => word === correctMatches[index]
  );

  useEffect(() => {
  if (allCorrect) {
    let penalties = 0;

    assignedWords.forEach((word, index) => {
      if (word === correctMatches[index]) {
        const att = attempts[index];
        if (att === 2) penalties += 10;      // −10% от общего
        if (att === 3) penalties += 12.5;    // −12.5% от общего
      }
    });

    const finalScore = Math.max(100 - penalties, 0);

    setScore(finalScore);
    setScoreVisible(true);
  }
}, [assignedWords]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Match each picture with the correct word or phrase
        </Text>

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

        <FlatList
          data={imageSources}
          numColumns={2}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.imageGrid}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.imageBox,
                { borderColor: getBorderColor(index) },
              ]}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.9}
            >
              <Image source={item} style={styles.image} resizeMode="contain" />
              <Text style={styles.assignment}>
                {assignedWords[index] || 'Tap to assign'}
              </Text>
              {!!errorMessages[index] && (
                <Text style={styles.errorText}>{errorMessages[index]}</Text>
              )}
            </TouchableOpacity>
          )}
        />

        {scoreVisible && (
          <View style={styles.resultsOverlay}>
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>✅ Score: {score.toFixed(1)}%</Text>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() =>
                  navigation.navigate('Exercise3Screen', {
                    score1: route.params?.score1 || 0,
                    score2: score,
                  })
                }
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#4A44C6',
    textAlign: 'center',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  wordBox: {
    backgroundColor: '#e6e4fb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 6,
    borderColor: '#6C63FF',
    borderWidth: 1,
  },
  wordBoxSelected: {
    backgroundColor: '#d1ceff',
    borderColor: '#4A44C6',
  },
  wordText: {
    fontSize: 14,
    color: '#333',
  },
  imageGrid: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  imageBox: {
    width: width * 0.42,
    height: width * 0.5,
    borderWidth: 3,
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: '#f9f8ff',
  },
  image: {
    width: '80%',
    height: '60%',
  },
  assignment: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(187, 184, 246, 0.9)', // полупрозрачный сиреневый фон
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },

  resultBox: {
    backgroundColor: '#8B82FF', // насыщенный сиреневый цвет
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },

  nextButton: {
    backgroundColor: '#4A44C6', // темный сиреневый для кнопки
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
