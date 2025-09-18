import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VideoScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Получаем часть урока и список экранов из параметров
  const { part, exercises } = route.params || {};

  // Определяем текст инструкции в зависимости от части
  const textMap = {
    part1: 'Please watch only the first 12 minutes of the video.',
    part2: 'Please watch from 12 to 22 minutes of the video.',
    part3: 'Please watch from 22 to 33.20 minutes of the video.',
    part4: 'Please watch from 33.20 to 45.32 minutes of the video.',
  };
  const videoInstruction = textMap[part] || 'Please watch the video.';

  const handleNext = () => {
    if (exercises && exercises.length > 0) {
      navigation.navigate(exercises[0], {
        part,
        exercises, // передаём дальше, чтобы следующий экран знал, куда идти
        currentIndex: 0,
      });
    }
  };

  const openVideo = () => {
    Linking.openURL(
      'https://rutube.ru/video/7fd6132c4e1a745e44d35a18086f260b/?playlist=417779'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>{videoInstruction}</Text>

      <TouchableOpacity onPress={openVideo} style={styles.linkContainer}>
        <Text style={styles.linkText}>📺 Watch on Rutube</Text>
      </TouchableOpacity>

      <Pressable
        onPress={handleNext}
        style={({ pressed }) => [
          styles.nextButton,
          pressed && styles.nextButtonPressed,
        ]}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4A44C6',
    marginBottom: 30,
  },
  linkContainer: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 50,
    shadowColor: '#4A44C6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4A44C6',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#372c7a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  nextButtonPressed: {
    backgroundColor: '#372c7a',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
