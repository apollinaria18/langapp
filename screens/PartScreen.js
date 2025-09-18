import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

import { useDictionary } from '../mediadata/chemistry/DictionaryContext';
import { addWordToUserDictionary } from "../firebase/dictionaryService";
import { getUserScore, saveUserScore } from "../firebase/userScores";



// Импортируй все JSON явно
import episode1part1 from '../mediadata/chemistry/episode1-part1.json';
import episode1part2 from '../mediadata/chemistry/episode1-part2.json';
import episode1part3 from '../mediadata/chemistry/episode1-part3.json';
import episode1part4 from '../mediadata/chemistry/episode1-part4.json';

// Мапа
const partDataMap = {
  part1: episode1part1,
  part2: episode1part2,
  part3: episode1part3,
  part4: episode1part4,
};

export default function PartScreen({ route, navigation}) {
  const { partId, folderName } = route.params;
  const [avgScore, setAvgScore] = useState(null);
  
  const data = partDataMap[partId];

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const score = await getUserScore(folderName);
        if (score !== null) setAvgScore(score);
      } catch (e) {
        console.error("❌ Error fetching score:", e);
      }
    };
    fetchScore();
  }, [folderName]);

  const handleFinish = async (score) => {
  try {
    await saveUserScore(folderName, score); 
    setAvgScore(score); // обновляем локально
  } catch (e) {
    console.error("Ошибка при сохранении:", e);
  }
};

  const { addWord } = useDictionary(); 

  const speak = (text) => {
    Speech.speak(text, { language: 'en' });
  };

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Контент не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      {data.content ? <Text style={styles.content}>{data.content}</Text> : null}

      {data.words && data.words.length > 0 && (
        <View style={styles.wordsContainer}>
          {data.words.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.word}>{item.word}</Text>
                <TouchableOpacity onPress={() => speak(item.word)}>
                  <Text style={styles.speaker}>🔊</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.definition}>{item.definition}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addWord(folderName, item)} 
              >
                <Text style={styles.addButtonText}>Add to dictionary</Text>
              </TouchableOpacity>
            </View>
        ))}
        </View>
      )}
    <TouchableOpacity
        style={styles.nextButton}
          onPress={async () => {
              await handleFinish(80);

          switch (partId) {
            case 'part1':
              exercises = ['Exercise1Screen', 'Exercise2Screen', 'Exercise3Screen'];
              break;
            case 'part2':
              exercises = ['Exercise1Part2Screen', 'Exercise2Part2Screen', 'Exercise3Part2Screen'];
              break;
            case 'part3':
              exercises = ['Exercise1Part3Screen', 'Exercise2Part3Screen', 'Exercise3Part3Screen'];
              break;
            case 'part4':
              exercises = ['Exercise1Part4Screen', 'Exercise2Part4Screen', 'Exercise3Part4Screen'];
              break;
            default:
              exercises = [];
          }

          if (exercises.length > 0) {
            navigation.navigate('VideoScreen', {
              part: partId,
              exercises: exercises,
            });
          }
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  wordsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A44C6',
  },
  speaker: {
    fontSize: 22,
    color: '#6C63FF',
  },
  definition: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
    addButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
    addButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    nextButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#4A44C6',
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

