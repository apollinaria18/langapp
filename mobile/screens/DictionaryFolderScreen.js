// screens/DictionaryFolderScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDictionary } from '../mediadata/chemistry/DictionaryContext';
import * as Speech from 'expo-speech';

export default function DictionaryFolderScreen({ route }) {
  const { folderName } = route.params;
  const { dictionary } = useDictionary();
  const words = dictionary[folderName] || [];

  const speak = (text) => {
    Speech.speak(text, { language: 'en' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{folderName}</Text>

      {words.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.word}>{item.word}</Text>
            <TouchableOpacity onPress={() => speak(item.word)}>
            <Text style={styles.speaker}>🔊</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.definition}>{item.definition}</Text>
        </View>
      ))}

      {words.length === 0 && (
        <Text style={styles.emptyText}>There are no words in this folder yet</Text>
      )}
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
    marginBottom: 30,
    marginTop: 20, 
  },
  card: {
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: 'gray',
  },
});  