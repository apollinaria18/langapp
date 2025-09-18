import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getUserScore } from "../firebase/userScores";
import PartScreen from './PartScreen';

const Stack = createNativeStackNavigator();

// Главная папка
const folders = [
  {
    name: 'Lessons in Chemistry',
    episodes: Array.from({ length: 8 }, (_, i) => ({
      name: `Lessons in Chemistry Episode ${i + 1}`,
      parts: [
        { id: `episode${i + 1}-part1.json`, title: `Lessons in Chemistry Episode ${i + 1} Part 1` },
        { id: `episode${i + 1}-part2.json`, title: `Lessons in Chemistry Episode ${i + 1} Part 2` },
        { id: `episode${i + 1}-part3.json`, title: `Lessons in Chemistry Episode ${i + 1} Part 3` },
        { id: `episode${i + 1}-part4.json`, title: `Lessons in Chemistry Episode ${i + 1} Part 4` },
      ],
    })),
  },
];

const getPartId = (filename) => {
  if (filename.includes('part1')) return 'part1';
  if (filename.includes('part2')) return 'part2';
  if (filename.includes('part3')) return 'part3';
  if (filename.includes('part4')) return 'part4';
  return null;
};

function FolderList({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Episodes', { folder: item })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function EpisodeList({ route, navigation }) {
  const { folder } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={folder.episodes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Parts', { episode: item })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function PartList({ route, navigation }) {
  const { episode } = route.params;
  const [scores, setScores] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchScores = async () => {
        const results = {};
        for (let part of episode.parts) {
          const progress = await getUserScore(part.id);
          results[part.id] = progress;
        }
        setScores(results);
      };
      fetchScores();
    }, [episode])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={episode.parts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PartScreen', {
              partId: getPartId(item.id),
              folderName: item.id,  // сохраняем именно по id part1.json
            })}
          >
            <Text style={styles.cardTitle}>
              {item.title}
              {scores[item.id] != null && (
                <Text style={{ color: '#4A44C6' }}> — {scores[item.id]}%</Text>
              )}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function MediaScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Folders" component={FolderList} />
      <Stack.Screen name="Episodes" component={EpisodeList} />
      <Stack.Screen name="Parts" component={PartList} />
      <Stack.Screen name="PartScreen" component={PartScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 26,
    borderRadius: 16,
    backgroundColor: '#EDEAFF',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4A44C6',
    textAlign: 'center',
  },
});
