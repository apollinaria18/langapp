// screens/DictionaryScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDictionary } from '../mediadata/chemistry/DictionaryContext';

export default function DictionaryScreen() {
  const { dictionary } = useDictionary();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(dictionary).map((folderName) => (
        <TouchableOpacity
          key={folderName}
          style={styles.folderCard}
          onPress={() =>
            navigation.navigate('DictionaryFolder', { folderName })
          }
        >
          <Text style={styles.folderName}>{folderName}</Text>
        </TouchableOpacity>
      ))}

      {Object.keys(dictionary).length === 0 && (
        <Text style={styles.emptyText}>No folders added</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  folderCard: {
    backgroundColor: '#E8E6FF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  folderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A44C6',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: 'gray',
  },
});
