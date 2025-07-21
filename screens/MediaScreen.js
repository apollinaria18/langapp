import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MediaScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  text: {
    fontSize: 22, fontWeight: 'bold', color: '#6C63FF',
  },
});
